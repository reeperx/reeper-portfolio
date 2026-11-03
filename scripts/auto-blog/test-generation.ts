import { BlogPostGenerator } from './generate.js';

async function main() {
  const generator = new BlogPostGenerator(
    process.env.LLM_API_KEY!,
    process.env.LLM_MODEL!,
    process.env.LLM_BASE_URL
  );

  const testContext = [
    "Ollama library: https://ollama.com/library - Run AI models locally and in the cloud",
    "Essential AI Tools for Freelancers in 2025: A Comprehensive Guide - 2727 Coworking",
    "Top 10 AI Tools For Freelancers - freelancermap.com"
  ];

  console.log('Testing generation with Nemotron 3...');
  const post = await generator.generatePost('tools', testContext, 800);
  
  console.log('\n✅ Generated post:');
  console.log('Title:', post.title);
  console.log('Slug:', post.slug);
  console.log('Excerpt:', post.excerpt);
  console.log('Tags:', post.tags);
  console.log('\nContent preview (first 500 chars):');
  console.log(post.content.slice(0, 500));
}

main();