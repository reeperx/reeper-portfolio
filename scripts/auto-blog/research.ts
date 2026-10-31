/**
 * AI Trend Research Module
 * Searches for trending AI news affecting freelance full-stack developers
 */

import FirecrawlApp from '@mendable/firecrawl-js';

interface FirecrawlSearchItem {
  markdown?: string;
  extract?: {
    title?: string;
    summary?: string;
    keyPoints?: string[];
    publishDate?: string;
    author?: string;
  };
  metadata?: {
    title?: string;
    url?: string;
    source?: string;
    publishedAt?: string;
  };
}

export interface ResearchResult {
  title: string;
  url: string;
  summary: string;
  publishedAt: string;
  source: string;
  relevanceScore: number;
}

export interface ResearchTopic {
  query: string;
  category: string;
  keywords: string[];
}

const RESEARCH_TOPICS: ResearchTopic[] = [
  {
    query: 'AI tools for freelance developers 2024 2025',
    category: 'tools',
    keywords: ['copilot', 'cursor', 'windsurf', 'v0', 'bolt', 'lovable', 'replit', 'ai coding assistant'],
  },
  {
    query: 'AI impact on freelance software developer income rates 2024',
    category: 'market',
    keywords: ['rates', 'pricing', 'hourly', 'project pricing', 'value-based', 'commoditization'],
  },
  {
    query: 'full stack developer skills AI era 2024 2025',
    category: 'skills',
    keywords: ['prompt engineering', 'AI integration', 'LLM APIs', 'RAG', 'vector databases', 'agents'],
  },
  {
    query: 'client expectations AI generated code freelance',
    category: 'clients',
    keywords: ['client expectations', 'delivery speed', 'quality', 'review process', 'maintenance'],
  },
  {
    query: 'open source AI models local development 2024 ollama llama',
    category: 'tech',
    keywords: ['ollama', 'llama', 'mistral', 'local LLM', 'privacy', 'offline development'],
  },
];

export class AITrendResearcher {
  private firecrawl: FirecrawlApp;

  constructor(apiKey: string) {
    this.firecrawl = new FirecrawlApp({ apiKey });
  }

  async searchTopic(topic: ResearchTopic, limit = 5): Promise<ResearchResult[]> {
    try {
      const results = await this.firecrawl.search(topic.query, {
        limit,
        scrapeOptions: {
          formats: ['markdown', 'extract'],
          extract: {
            schema: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                summary: { type: 'string' },
                keyPoints: { type: 'array', items: { type: 'string' } },
                publishDate: { type: 'string' },
                author: { type: 'string' },
              },
              required: ['title', 'summary'],
            },
          },
        },
      });

      if (!results.success || !results.data) {
        console.warn(`Search failed for topic: ${topic.query}`);
        return [];
      }

      return results.data
        .filter((item: FirecrawlSearchItem) => item.markdown || item.extract)
        .map((item: FirecrawlSearchItem, index: number) => ({
          title: item.extract?.title || item.metadata?.title || `Result ${index + 1}`,
          url: item.metadata?.url || '',
          summary: item.extract?.summary || item.markdown?.slice(0, 500) || '',
          publishedAt: item.extract?.publishDate || item.metadata?.publishedAt || new Date().toISOString(),
          source: item.metadata?.source || item.metadata?.url || 'Unknown',
          relevanceScore: this.calculateRelevance(item, topic),
        }))
        .sort((a: ResearchResult, b: ResearchResult) => b.relevanceScore - a.relevanceScore);
    } catch (error) {
      console.error(`Error searching topic "${topic.query}":`, error);
      return [];
    }
  }

  private calculateRelevance(item: FirecrawlSearchItem, topic: ResearchTopic): number {
    const text = `${item.extract?.summary || ''} ${item.markdown || ''} ${item.metadata?.title || ''}`.toLowerCase();
    let score = 0;

    for (const keyword of topic.keywords) {
      const regex = new RegExp(keyword.toLowerCase(), 'g');
      const matches = text.match(regex);
      score += matches ? matches.length * 2 : 0;
    }

    // Boost recent content
    const pubDate = item.extract?.publishDate || item.metadata?.publishedAt;
    if (pubDate) {
      const daysOld = (Date.now() - new Date(pubDate).getTime()) / (1000 * 60 * 60 * 24);
      if (daysOld < 7) score += 10;
      else if (daysOld < 30) score += 5;
    }

    return score;
  }

  async researchAllTopics(limitPerTopic = 5): Promise<ResearchResult[]> {
    const allResults: ResearchResult[] = [];

    for (const topic of RESEARCH_TOPICS) {
      console.log(`Researching: ${topic.category} - ${topic.query}`);
      const results = await this.searchTopic(topic, limitPerTopic);
      allResults.push(...results);
      
      // Rate limiting between searches
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Deduplicate by URL
    const seen = new Set<string>();
    const unique = allResults.filter(r => {
      if (seen.has(r.url)) return false;
      seen.add(r.url);
      return true;
    });

    return unique.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }
}

export function getTopStories(results: ResearchResult[], count = 3): ResearchResult[] {
  return results
    .filter(r => r.relevanceScore > 5)
    .slice(0, count);
}