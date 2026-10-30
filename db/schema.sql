-- TOGB community schema.
-- Apply with: psql "$DATABASE_URL" -f db/schema.sql

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE
    CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text NOT NULL,
  excerpt text NOT NULL DEFAULT '',
  content text NOT NULL,
  cover_image_url text,
  cover_image_alt text,
  tags jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS blog_posts_published_idx
  ON blog_posts (status, published_at DESC);

CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  parent_id uuid REFERENCES comments(id) ON DELETE CASCADE,
  depth smallint NOT NULL DEFAULT 0
    CHECK (depth BETWEEN 0 AND 3),
  author_name text NOT NULL,
  author_email text NOT NULL,
  author_website text,
  body text NOT NULL,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected', 'spam')),
  created_at timestamptz NOT NULL DEFAULT now(),
  approved_at timestamptz,
  ip_hash text NOT NULL,
  user_agent_hash text NOT NULL,
  CONSTRAINT comments_parent_not_self CHECK (id <> parent_id)
);

CREATE INDEX IF NOT EXISTS comments_post_status_idx
  ON comments (post_id, status, created_at);
CREATE INDEX IF NOT EXISTS comments_parent_idx
  ON comments (parent_id);

CREATE TABLE IF NOT EXISTS comment_likes (
  comment_id uuid NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
  voter_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (comment_id, voter_hash)
);

CREATE INDEX IF NOT EXISTS comment_likes_comment_idx
  ON comment_likes (comment_id);

CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  company text,
  role text,
  quote text NOT NULL,
  rating smallint
    CHECK (rating IS NULL OR rating BETWEEN 1 AND 5),
  consent boolean NOT NULL DEFAULT false CHECK (consent),
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected')),
  verified boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  approved_at timestamptz,
  ip_hash text NOT NULL,
  user_agent_hash text NOT NULL
);

CREATE INDEX IF NOT EXISTS reviews_status_idx
  ON reviews (status, created_at DESC);

CREATE TABLE IF NOT EXISTS rate_limits (
  key text PRIMARY KEY,
  window_start timestamptz NOT NULL DEFAULT now(),
  count integer NOT NULL DEFAULT 0
);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS blog_posts_set_updated_at ON blog_posts;
CREATE TRIGGER blog_posts_set_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();
