"use client";

import Link from "next/link";
import { useId, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  HONEYPOT_FIELD,
  commentSubmissionSchema,
} from "@/lib/community-schema";

type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; message: string }
  | { status: "error"; message: string; fieldErrors?: Record<string, string> };

export function CommentForm({
  postSlug,
  parentId,
  compact = false,
}: {
  postSlug: string;
  parentId?: string;
  compact?: boolean;
}) {
  const [state, setState] = useState<SubmitState>({ status: "idle" });
  const id = useId();
  const field = (name: string) => `${id}-${name}`;
  const errorFor = (name: string) =>
    state.status === "error" ? state.fieldErrors?.[name] : undefined;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      postSlug,
      parentId: parentId ?? "",
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      website: String(formData.get("website") ?? ""),
      body: String(formData.get("body") ?? ""),
      consent: formData.get("consent") === "on",
      [HONEYPOT_FIELD]: String(formData.get(HONEYPOT_FIELD) ?? ""),
    };

    const parsed = commentSubmissionSchema.safeParse(payload);

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};

      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form");

        if (!fieldErrors[key]) {
          fieldErrors[key] = issue.message;
        }
      }

      setState({
        status: "error",
        message: "Please check the highlighted fields.",
        fieldErrors,
      });
      return;
    }

    setState({ status: "submitting" });

    try {
      const response = await fetch("/api/blog/comments", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...parsed.data,
          parentId: parsed.data.parentId ?? "",
          [HONEYPOT_FIELD]: payload[HONEYPOT_FIELD],
        }),
      });
      const result = (await response.json()) as {
        ok?: boolean;
        message?: string;
        error?: string;
        fieldErrors?: Record<string, string>;
      };

      if (!response.ok || !result.ok) {
        setState({
          status: "error",
          message: result.error ?? "The comment could not be sent.",
          fieldErrors: result.fieldErrors,
        });
        return;
      }

      form.reset();
      setState({
        status: "success",
        message:
          result.message ??
          "Thanks. Your comment is awaiting moderation and will appear once it has been checked.",
      });
    } catch {
      setState({
        status: "error",
        message:
          "The comment could not be sent. Please try again or email me directly.",
      });
    }
  }

  if (state.status === "success") {
    return (
      <div
        role="status"
        className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm leading-relaxed text-primary"
      >
        {state.message}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={compact ? "mt-3 space-y-3" : "space-y-4"}>
      <div className={compact ? "grid gap-3 sm:grid-cols-2" : "grid gap-4 sm:grid-cols-2"}>
        <div className="space-y-1.5">
          <Label htmlFor={field("name")} className="text-xs">
            Name
          </Label>
          <Input
            id={field("name")}
            name="name"
            required
            maxLength={80}
            autoComplete="name"
            aria-invalid={errorFor("name") ? true : undefined}
            className="h-10 rounded-xl border-border/80 bg-background/80 text-sm"
          />
          {errorFor("name") ? (
            <p className="text-xs text-destructive">{errorFor("name")}</p>
          ) : null}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={field("email")} className="text-xs">
            Email <span className="font-normal text-muted-foreground">(private)</span>
          </Label>
          <Input
            id={field("email")}
            name="email"
            type="email"
            required
            maxLength={254}
            autoComplete="email"
            aria-invalid={errorFor("email") ? true : undefined}
            className="h-10 rounded-xl border-border/80 bg-background/80 text-sm"
          />
          {errorFor("email") ? (
            <p className="text-xs text-destructive">{errorFor("email")}</p>
          ) : null}
        </div>
      </div>

      {!compact ? (
        <div className="space-y-1.5">
          <Label htmlFor={field("website")} className="text-xs">
            Website <span className="font-normal text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id={field("website")}
            name="website"
            type="url"
            maxLength={240}
            placeholder="https://"
            autoComplete="url"
            aria-invalid={errorFor("website") ? true : undefined}
            className="h-10 rounded-xl border-border/80 bg-background/80 text-sm"
          />
          {errorFor("website") ? (
            <p className="text-xs text-destructive">{errorFor("website")}</p>
          ) : null}
        </div>
      ) : (
        <input type="hidden" name="website" value="" />
      )}

      <div className="space-y-1.5">
        <Label htmlFor={field("body")} className="text-xs">
          Comment
        </Label>
        <Textarea
          id={field("body")}
          name="body"
          required
          maxLength={3000}
          rows={compact ? 3 : 5}
          aria-invalid={errorFor("body") ? true : undefined}
          className="min-h-24 rounded-xl border-border/80 bg-background/80 text-sm leading-relaxed"
        />
        {errorFor("body") ? (
          <p className="text-xs text-destructive">{errorFor("body")}</p>
        ) : null}
      </div>

      <div className="flex items-start gap-2.5">
        <input
          id={field("consent")}
          name="consent"
          type="checkbox"
          required
          aria-invalid={errorFor("consent") ? true : undefined}
          className="mt-0.5 size-4 rounded border-border"
        />
        <label
          htmlFor={field("consent")}
          className="text-xs leading-relaxed text-muted-foreground"
        >
          I agree to the{" "}
          <Link
            href="/terms#comments-and-reviews"
            className="font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
          >
            comment and review policy
          </Link>
          . My name and comment will be public; my email will not be.
        </label>
      </div>
      {errorFor("consent") ? (
        <p className="text-xs text-destructive">{errorFor("consent")}</p>
      ) : null}

      <div className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
        <label htmlFor={field("bot")}>Leave this empty</label>
        <input
          id={field("bot")}
          name={HONEYPOT_FIELD}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="submit"
          disabled={state.status === "submitting"}
          className="h-10 rounded-full px-5 text-sm"
        >
          {state.status === "submitting" ? "Sending…" : "Post comment"}
        </Button>
        <p className="text-xs text-muted-foreground">
          Comments are checked before they appear.
        </p>
      </div>

      {state.status === "error" ? (
        <p role="alert" className="text-sm text-destructive">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
