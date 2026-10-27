import Link from "next/link";

export default function NotFound() {
  return (
    <main
      id="main"
      tabIndex={-1}
      className="flex min-h-[calc(100svh-4rem)] flex-col justify-center px-6 py-24 lg:min-h-svh lg:px-12"
    >
      <p className="font-display text-[clamp(6rem,20vw,14rem)] font-semibold leading-none tracking-[-0.06em] text-link">
        404
      </p>
      <h1 className="mt-4 font-display text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
        This page doesn’t exist.
      </h1>
      <p className="mt-3 max-w-[40ch] text-muted-foreground">
        The work is still over here.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/#work"
          className="rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          See the work
        </Link>
        <Link
          href="/"
          className="rounded-full border border-border px-5 py-3 text-sm font-medium transition-colors hover:border-foreground"
        >
          Back home
        </Link>
      </div>
    </main>
  );
}
