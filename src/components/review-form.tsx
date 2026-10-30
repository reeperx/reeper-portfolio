"use client";

import Link from "next/link";
import { useId, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { reviewSubmissionSchema } from "@/lib/community-schema";

type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; message: string }
  | { status: "error"; message: string; fieldErrors?: Record<string, string> };

export function ReviewForm() {
  const [state, setState] = useState<SubmitState>({ status: "idle" });
  const id = useId();
  const field = (name: string) => `${id}-${name}`;
  const errorFor = (name: string) =>
    state.status === "error" ? state.fieldErrors?.[name] : undefined;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const ratingValue = String(formData.get("rating") ?? "");
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      company: String(formData.get("company") ?? ""),
      role: String(formData.get("role") ?? ""),
      quote: String(formData.get("quote") ?? ""),
      rating: ratingValue ? Number(ratingValue) : null,
      consent: formData.get("consent") === "on",
      clientConfirmation: formData.get("clientConfirmation") === "on",
    };

    const parsed = reviewSubmissionSchema.safeParse(payload);

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
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(parsed.data),
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
          message: result.error ?? "The review could not be sent.",
          fieldErrors: result.fieldErrors,
        });
        return;
      }

      form.reset();
      setState({
        status: "success",
        message:
          result.message ??
          "Thanks. Your review is with me for moderation and will appear only after I check it.",
      });
    } catch {
      setState({
        status: "error",
        message:
          "The review could not be sent. Please try again or email me directly.",
      });
    }
  }

  if (state.status === "success") {
    return (
      <div
        role="status"
        className="rounded-2xl border border-primary/20 bg-primary/5 p-5 text-sm leading-relaxed text-primary"
      >
        {state.message}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor={field("name")} className="text-xs">
            Your name
          </Label>
          <Input
            id={field("name")}
            name="name"
            required
            maxLength={80}
            autoComplete="name"
            aria-invalid={errorFor("name") ? true : undefined}
            className="h-11 rounded-xl border-border/80 bg-background/80 text-sm"
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
            className="h-11 rounded-xl border-border/80 bg-background/80 text-sm"
          />
          {errorFor("email") ? (
            <p className="text-xs text-destructive">{errorFor("email")}</p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor={field("company")} className="text-xs">
            Company <span className="font-normal text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id={field("company")}
            name="company"
            maxLength={120}
            autoComplete="organization"
            className="h-11 rounded-xl border-border/80 bg-background/80 text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={field("role")} className="text-xs">
            Your role <span className="font-normal text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id={field("role")}
            name="role"
            maxLength={120}
            autoComplete="organization-title"
            className="h-11 rounded-xl border-border/80 bg-background/80 text-sm"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={field("rating")} className="text-xs">
          Rating <span className="font-normal text-muted-foreground">(optional)</span>
        </Label>
        <select
          id={field("rating")}
          name="rating"
          defaultValue=""
          className="h-11 w-full rounded-xl border border-border/80 bg-background/80 px-3 text-sm"
        >
          <option value="">No rating</option>
          <option value="5">5 — excellent</option>
          <option value="4">4 — good</option>
          <option value="3">3 — fair</option>
          <option value="2">2 — poor</option>
          <option value="1">1 — very poor</option>
        </select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={field("quote")} className="text-xs">
          Your review
        </Label>
        <Textarea
          id={field("quote")}
          name="quote"
          required
          maxLength={3000}
          rows={6}
          aria-invalid={errorFor("quote") ? true : undefined}
          className="min-h-36 rounded-xl border-border/80 bg-background/80 text-sm leading-relaxed"
        />
        <p className="text-xs text-muted-foreground">
          Please use your own words. I may fix a typo or trim for length, but I
          will not change the meaning.
        </p>
        {errorFor("quote") ? (
          <p className="text-xs text-destructive">{errorFor("quote")}</p>
        ) : null}
      </div>

      <div className="space-y-3 rounded-2xl border border-border bg-background/60 p-4">
        <div className="flex items-start gap-2.5">
          <input
            id={field("clientConfirmation")}
            name="clientConfirmation"
            type="checkbox"
            required
            aria-invalid={errorFor("clientConfirmation") ? true : undefined}
            className="mt-0.5 size-4 rounded border-border"
          />
          <label
            htmlFor={field("clientConfirmation")}
            className="text-xs leading-relaxed text-muted-foreground"
          >
            I confirm that I have worked with TOGB and that this review is my
            own honest experience.
          </label>
        </div>
        {errorFor("clientConfirmation") ? (
          <p className="text-xs text-destructive">
            {errorFor("clientConfirmation")}
          </p>
        ) : null}

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
            I consent to TOGB publishing this review, my name, role, company,
            and rating on this website and in related marketing. I understand I
            can ask for it to be removed later. Read the{" "}
            <Link
              href="/terms#comments-and-reviews"
              className="font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
            >
              review policy
            </Link>
            .
          </label>
        </div>
        {errorFor("consent") ? (
          <p className="text-xs text-destructive">{errorFor("consent")}</p>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="submit"
          disabled={state.status === "submitting"}
          className="h-11 rounded-full px-6 text-sm"
        >
          {state.status === "submitting" ? "Sending…" : "Send review"}
        </Button>
        <p className="text-xs text-muted-foreground">
          Reviews are checked against client records before publication.
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
