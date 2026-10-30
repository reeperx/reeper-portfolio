import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AdminLoginForm } from "@/components/admin-login-form";
import { LogoMark, Wordmark } from "@/components/logo";
import { isAdminAuthenticated, isAdminConfigured } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Sign in",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await isAdminAuthenticated()) {
    redirect("/admin");
  }

  const configured = isAdminConfigured();

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center gap-3">
          <LogoMark className="size-11 rounded-2xl" />
          <div>
            <Wordmark className="block text-xl leading-none" />
            <span className="mt-1 block text-[0.65rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Studio admin
            </span>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Private area
          </p>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em]">
            Sign in to moderate.
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Posts, comments, and reviews are published only after they are
            checked here.
          </p>

          <div className="mt-6">
            {configured ? (
              <AdminLoginForm />
            ) : (
              <div className="rounded-2xl border border-dashed border-border bg-background/60 p-4 text-sm leading-relaxed text-muted-foreground">
                Admin access is not configured yet. Add{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs">
                  ADMIN_PASSWORD
                </code>{" "}
                and{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs">
                  ADMIN_SESSION_SECRET
                </code>{" "}
                to the environment, then reload this page.
              </div>
            )}
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link
            href="/"
            className="font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
          >
            Back to the site
          </Link>
        </p>
      </div>
    </div>
  );
}
