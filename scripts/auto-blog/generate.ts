/**
 * Blog Post Generation Module
 * Uses LLM to synthesize research into blog posts for freelance full-stack developers
 */

import OpenAI from 'openai';
import type { ResearchResult } from './research.js';

export interface BlogPost {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string[];
  coverImageAlt: string;
  status: 'draft' | 'published';
}

const SYSTEM_PROMPT = `You are a senior full-stack developer and technical writer who runs a successful freelance practice. You write for other freelance full-stack developers about how AI is changing the industry.

Your voice:
- Direct, grounded, confident — no hype or agency jargon
- Practical insights from real experience
- Specific numbers, concrete examples, named tools
- South African context where relevant (rates in RAND, local clients)
- "Websites built to earn their keep" — business outcomes over tech novelty

Format every post as Markdown with:
- H2 headings for main sections
- Bullet points for scannable lists
- Code blocks for technical examples
- One actionable "What to do this week" section at the end
- No filler intros/conclusions — start with the insight`;

const POST_TEMPLATES = {
  tools: `Write a practical guide about AI coding tools for freelance developers.
Focus on: which tools are worth paying for, which are free, how they change your workflow, real time savings, and what clients notice.`,
  
  market: `Analyze how AI is affecting freelance rates and project pricing.
Cover: rate compression vs. value-based pricing, what clients now expect for "standard" work, how to position AI-augmented delivery as premium, and specific rate ranges in ZAR.`,
  
  skills: `Map the emerging skill stack for full-stack developers in the AI era.
Cover: prompt engineering as a deliverable, RAG/agent integration as a service, local LLM deployment for privacy-sensitive clients, and which traditional skills become more/less valuable.`,
  
  clients: `Explain how client expectations are shifting with AI-generated code.
Cover: faster delivery assumptions, quality review burden shifting to freelancers, maintenance of AI-written code, and how to set boundaries in contracts.`,
  
  tech: `Technical deep-dive on running open-source models locally for client work.
Cover: Ollama/LM Studio setup, model selection for coding tasks, hardware requirements, privacy advantages, and integrating local LLMs into your development workflow.`,
};

export class BlogPostGenerator {
  private client: OpenAI;

  constructor(apiKey: string, model = 'gpt-4o-mini', baseUrl?: string) {
    this.client = new OpenAI({ 
      apiKey, 
      baseURL: baseUrl,
      dangerouslyAllowBrowser: true,
    });
    this.model = model;
  }

  private model: string;

  async generatePost(
    category: keyof typeof POST_TEMPLATES,
    researchContext: string[],
    targetLength = 1800
  ): Promise<BlogPost> {
    const template = POST_TEMPLATES[category];
    const context = researchContext.join('\n\n---\n\n');

    const userPrompt = `${template}

RESEARCH CONTEXT (use specific details, quotes, data points):
${context}

TARGET LENGTH: ~${targetLength} words
TONE: Direct, practical, experienced freelancer voice
AUDIENCE: Freelance full-stack developers (React/Node/TypeScript/Python/Go)

OUTPUT FORMAT (JSON only):
{
  "title": "Specific, compelling title under 140 chars",
  "slug": "kebab-case-slug-from-title",
  "excerpt": "One or two sentences for blog index/social preview (max 320 chars)",
  "content": "Full markdown content",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "coverImageAlt": "Descriptive alt text for cover image",
  "status": "draft"
}`;

    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 4000,
        response_format: { type: 'json_object' },
      });

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error('Empty response from LLM');

      const post = JSON.parse(content) as BlogPost;
      
      // Validate and sanitize
      return this.sanitizePost(post, category);
    } catch (error) {
      console.error(`Error generating ${category} post:`, error);
      throw error;
    }
  }

  private sanitizePost(post: BlogPost, category: string): BlogPost {
    // Ensure slug is valid
    const slug = post.slug
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 160);

    // Ensure tags are valid
    const tags = Array.isArray(post.tags) 
      ? post.tags.slice(0, 8).map(t => String(t).trim().toLowerCase().replace(/[^a-z0-9-]/g, ''))
      : [category, 'ai', 'freelance', 'fullstack'];

    return {
      ...post,
      slug,
      tags,
      status: 'draft', // Always start as draft for review
    };
  }

  async generateWeeklyBatch(researchResults: ResearchResult[]): Promise<BlogPost[]> {
    // Group research by category
    const byCategory: Record<string, string[]> = {};
    for (const result of researchResults) {
      // Simple categorization based on keywords
      const text = `${result.title} ${result.summary}`.toLowerCase();
      let category: keyof typeof POST_TEMPLATES = 'tools';
      
      if (text.includes('rate') || text.includes('pricing') || text.includes('income') || text.includes('market')) {
        category = 'market';
      } else if (text.includes('skill') || text.includes('learn') || text.includes('prompt') || text.includes('rag') || text.includes('agent')) {
        category = 'skills';
      } else if (text.includes('client') || text.includes('expectation') || text.includes('contract') || text.includes('delivery')) {
        category = 'clients';
      } else if (text.includes('ollama') || text.includes('local') || text.includes('llama') || text.includes('mistral') || text.includes('privacy')) {
        category = 'tech';
      }

      if (!byCategory[category]) byCategory[category] = [];
      byCategory[category].push(`${result.title}: ${result.summary}`);
    }

    // Generate 2 posts per week from different categories
    const categories = Object.keys(byCategory) as (keyof typeof POST_TEMPLATES)[];
    const selectedCategories = categories.slice(0, 2);

    const posts: BlogPost[] = [];
    for (const category of selectedCategories) {
      if (byCategory[category]?.length) {
        const post = await this.generatePost(category, byCategory[category]);
        posts.push(post);
        // Rate limit between generations
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    return posts;
  }
}