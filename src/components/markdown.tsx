import ReactMarkdown from "react-markdown";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

export function Markdown({ content }: { content: string }) {
  return (
    <div className="article-prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug]}
        components={{
          a: ({ href, children }) => {
            const external = Boolean(href && /^https?:\/\//i.test(href));

            return (
              <a
                href={href}
                {...(external
                  ? { target: "_blank", rel: "noreferrer noopener" }
                  : {})}
              >
                {children}
                {external ? (
                  <span className="sr-only"> (opens in a new tab)</span>
                ) : null}
              </a>
            );
          },
          img: ({ src, alt, title }) => {
            if (!src) {
              return null;
            }

            // Markdown images are author-controlled and do not go through
            // the Next image optimiser.
            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={src}
                alt={alt ?? ""}
                title={title}
                loading="lazy"
                decoding="async"
                className="rounded-2xl border border-border"
              />
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
