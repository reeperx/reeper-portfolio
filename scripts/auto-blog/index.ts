/**
 * Automated Blog Pipeline Orchestrator
 * Runs research → generation → posting pipeline
 * Designed to run via GitHub Actions cron (twice weekly) or local cron
 */

import { AITrendResearcher, getTopStories } from './research.js';
import { BlogPostGenerator } from './generate.js';
import { BlogPoster } from './post.js';

export interface PipelineConfig {
  firecrawlApiKey: string;
  llmApiKey: string;
  databaseUrl: string;
  llmModel?: string;
  llmBaseUrl?: string;
  postsPerRun?: number;
  minRelevanceScore?: number;
}

export interface PipelineResult {
  success: boolean;
  postsCreated: number;
  posts: Array<{ slug: string; title: string; id: string }>;
  errors: string[];
  durationMs: number;
}

export class BlogPipeline {
  private config: PipelineConfig;
  private researcher: AITrendResearcher;
  private generator: BlogPostGenerator;
  private poster: BlogPoster;

  constructor(config: PipelineConfig) {
    this.config = {
      postsPerRun: 2,
      minRelevanceScore: 5,
      llmModel: 'nemotron-3-ultra',
      ...config,
    };

    this.researcher = new AITrendResearcher(this.config.firecrawlApiKey);
    this.generator = new BlogPostGenerator(
      this.config.llmApiKey,
      this.config.llmModel,
      this.config.llmBaseUrl,
    );
    this.poster = new BlogPoster(this.config.databaseUrl);
  }

  async run(): Promise<PipelineResult> {
    const startTime = Date.now();
    const errors: string[] = [];
    let postsCreated = 0;
    const createdPosts: Array<{ slug: string; title: string; id: string }> = [];

    try {
      console.log('🔍 Starting automated blog pipeline...');
      console.log(`   Target: ${this.config.postsPerRun} posts`);
      console.log(`   LLM: ${this.config.llmModel}${this.config.llmBaseUrl ? ` @ ${this.config.llmBaseUrl}` : ''}`);

      // Step 1: Research
      console.log('\n📚 Phase 1: Researching AI trends...');
      const researchResults = await this.researcher.researchAllTopics(5);
      console.log(`   Found ${researchResults.length} total results`);

      const topStories = getTopStories(researchResults, (this.config.postsPerRun ?? 2) * 2);
      console.log(`   Selected ${topStories.length} top stories for generation`);

      if (topStories.length === 0) {
        errors.push('No relevant research results found');
        return this.buildResult(startTime, postsCreated, createdPosts, errors);
      }

      // Step 2: Generate posts
      console.log('\n✍️  Phase 2: Generating blog posts...');
      const posts = await this.generator.generateWeeklyBatch(topStories);
      console.log(`   Generated ${posts.length} posts`);

      if (posts.length === 0) {
        errors.push('No posts generated from research');
        return this.buildResult(startTime, postsCreated, createdPosts, errors);
      }

      // Step 3: Post to database
      console.log('\n📤 Phase 3: Posting to database...');
      const results = await this.poster.createPosts(posts);
      postsCreated = results.length;
      createdPosts.push(...results.map(r => ({ slug: r.slug, title: posts.find(p => p.slug === r.slug)?.title ?? '', id: r.id })));

      console.log(`\n✅ Pipeline complete: ${postsCreated} posts created in ${Date.now() - startTime}ms`);

      return this.buildResult(startTime, postsCreated, createdPosts, errors);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      errors.push(`Pipeline failed: ${errorMsg}`);
      console.error('❌ Pipeline error:', error);
      return this.buildResult(startTime, postsCreated, createdPosts, errors);
    }
  }

  private buildResult(
    startTime: number,
    postsCreated: number,
    posts: Array<{ slug: string; title: string; id: string }>,
    errors: string[]
  ): PipelineResult {
    return {
      success: errors.length === 0 && postsCreated > 0,
      postsCreated,
      posts,
      errors,
      durationMs: Date.now() - startTime,
    };
  }
}

// CLI entry point
async function main() {
  const requiredEnv = ['FIRECRAWL_API_KEY', 'LLM_API_KEY', 'DATABASE_URL'];

  const missing = requiredEnv.filter(key => !process.env[key]);
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing.join(', '));
    console.error('\nRequired:');
    console.error('  FIRECRAWL_API_KEY - Get at https://firecrawl.dev');
    console.error('  LLM_API_KEY - Your OpenAI-compatible API key');
    console.error('  DATABASE_URL - Neon Postgres connection string');
    console.error('\nOptional:');
    console.error('  LLM_MODEL - Model name (default: nemotron-3-ultra)');
    console.error('  LLM_BASE_URL - Custom OpenAI-compatible endpoint (e.g., http://localhost:11434/v1 for Ollama)');
    console.error('  POSTS_PER_RUN - Number of posts per run (default: 2)');
    console.error('  MIN_RELEVANCE_SCORE - Minimum relevance score (default: 5)');
    process.exit(1);
  }

  const config: PipelineConfig = {
    firecrawlApiKey: process.env.FIRECRAWL_API_KEY!,
    llmApiKey: process.env.LLM_API_KEY!,
    databaseUrl: process.env.DATABASE_URL!,
    llmModel: process.env.LLM_MODEL || 'nemotron-3-ultra',
    llmBaseUrl: process.env.LLM_BASE_URL,
    postsPerRun: parseInt(process.env.POSTS_PER_RUN || '2', 10),
    minRelevanceScore: parseInt(process.env.MIN_RELEVANCE_SCORE || '5', 10),
  };

  const pipeline = new BlogPipeline(config);
  const result = await pipeline.run();

  console.log('\n📊 Pipeline Summary:');
  console.log(`   Success: ${result.success ? 'YES' : 'NO'}`);
  console.log(`   Posts created: ${result.postsCreated}`);
  console.log(`   Duration: ${result.durationMs}ms`);
  
  if (result.errors.length > 0) {
    console.log('   Errors:');
    result.errors.forEach(e => console.log(`     - ${e}`));
  }

  if (result.posts.length > 0) {
    console.log('   Created posts:');
    result.posts.forEach(p => console.log(`     - ${p.title} (/${p.slug})`));
  }

  process.exit(result.success ? 0 : 1);
}

main();