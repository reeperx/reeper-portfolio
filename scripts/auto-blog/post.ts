/**
 * Database Posting Module
 * Inserts generated blog posts into Neon Postgres
 */

import { neon } from '@neondatabase/serverless';

export interface BlogPost {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string[];
  coverImageUrl?: string;
  coverImageAlt: string;
  status: 'draft' | 'published';
}

function asArray<T>(result: unknown): T[] {
  return Array.isArray(result) ? result : [];
}

export class BlogPoster {
  private sql: ReturnType<typeof neon>;

  constructor(databaseUrl: string) {
    this.sql = neon(databaseUrl);
  }

  async postExists(slug: string): Promise<boolean> {
    const rows = asArray(await this.sql`
      SELECT 1 FROM blog_posts WHERE slug = ${slug} LIMIT 1
    `);
    return rows.length > 0;
  }

  async createPost(post: BlogPost): Promise<{ id: string } | null> {
    // Check for duplicate slug
    if (await this.postExists(post.slug)) {
      // Append timestamp to make unique
      const timestamp = Date.now().toString(36);
      post.slug = `${post.slug}-${timestamp}`;
    }

    try {
      const rows = asArray(await this.sql`
        INSERT INTO blog_posts (
          slug, title, excerpt, content, cover_image_url, cover_image_alt,
          tags, status, published_at
        )
        VALUES (
          ${post.slug},
          ${post.title},
          ${post.excerpt},
          ${post.content},
          ${post.coverImageUrl || null},
          ${post.coverImageAlt},
          ${JSON.stringify(post.tags)}::jsonb,
          ${post.status},
          ${post.status === 'published' ? new Date().toISOString() : null}
        )
        RETURNING id
      `);

      const row = rows[0];
      if (row && typeof row === 'object' && 'id' in row) {
        return { id: row.id as string };
      }
      return null;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  }

  async createPosts(posts: BlogPost[]): Promise<Array<{ slug: string; id: string }>> {
    const results: Array<{ slug: string; id: string }> = [];

    for (const post of posts) {
      console.log(`Creating post: ${post.title}`);
      const result = await this.createPost(post);
      if (result) {
        results.push({ slug: post.slug, id: result.id });
        console.log(`  ✓ Created: ${post.slug} (${result.id})`);
      } else {
        console.error(`  ✗ Failed: ${post.title}`);
      }
    }

    return results;
  }

  async getRecentPosts(limit = 10): Promise<BlogPost[]> {
    const rows = asArray<BlogPost>(await this.sql`
      SELECT id, slug, title, excerpt, content, cover_image_url, cover_image_alt, tags, status, published_at, created_at
      FROM blog_posts
      ORDER BY created_at DESC
      LIMIT ${limit}
    `);
    return rows;
  }
}