"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

import { ArrowUpRight, Check } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  HONEYPOT_FIELD,
  budgets,
  contactInquirySchema,
  getContactFieldErrors,
  projectTypes,
  timelines,
  type ContactField,
  type ContactFieldErrors,
} from "@/lib/contact-schema";

type FormValues = {
  name: string;
  email: string;
  company: string;
  projectType: string;
  budget: string;
  timeline: string;
  message: string;
};

const initialValues: FormValues = {
  name: "",
  email: "",
  company: "",
  projectType: "",
  budget: "",
  timeline: "",
  message: "",
};

const inputClass =
  "h-11 rounded-xl border-border/80 bg-background/80 px-3.5 text-base text-foreground shadow-none placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-ring/30 md:text-sm";

const selectClass =
  "h-11 w-full min-w-0 appearance-none rounded-xl border border-border/80 bg-background/80 px-3.5 pr-10 text-base text-foreground shadow-none outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 md:text-sm";

const labelClass =
  "text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-card-foreground";

function FieldError({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p
      id={id}
      className="text-xs font-medium leading-relaxed text-destructive"
    >
      {children}
    </p>
  );
}

function ChevronDown() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
      fill="none"
      focusable="false"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function ContactForm() {
  const formId = useId();
  const successRef = useRef<HTMLHeadingElement>(null);
  const [values, setValues] = useState<FormValues>(initialValues);
  const [honeypot, setHoneypot] = useState("");
  const [fieldErrors, setFieldErrors] = useState<ContactFieldErrors>({});
  const [formError, setFormError] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [submittedName, setSubmittedName] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");

  const isSubmitting = status === "submitting";

  useEffect(() => {
    if (status === "success") {
      successRef.current?.focus();
    }
  }, [status]);

  function fieldId(field: ContactField) {
    return `${formId}-${field}`;
  }

  function focusField(field?: string) {
    if (!field) return;

    window.requestAnimationFrame(() => {
      document.getElementById(`${formId}-${field}`)?.focus();
    });
  }

  function updateField(field: ContactField, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: undefined }));

    if (status === "error") {
      setStatus("idle");
      setFormError("");
    }
  }

  function resetForm() {
    setValues(initialValues);
    setHoneypot("");
    setFieldErrors({});
    setFormError("");
    setStatus("idle");

    window.requestAnimationFrame(() => {
      document.getElementById(`${formId}-name`)?.focus();
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) return;

    setFormError("");

    const parsed = contactInquirySchema.safeParse(values);

    if (!parsed.success) {
      setFieldErrors(getContactFieldErrors(parsed.error));
      setStatus("error");
      setFormError("Please check the highlighted fields.");

      const firstField = parsed.error.issues[0]?.path[0];
      focusField(typeof firstField === "string" ? firstField : undefined);
      return;
    }

    setFieldErrors({});
    setStatus("submitting");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...parsed.data,
          [HONEYPOT_FIELD]: honeypot,
        }),
      });

      const result: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        const apiError =
          result && typeof result === "object"
            ? (result as {
                error?: string;
                fieldErrors?: ContactFieldErrors;
              })
            : null;
        const nextFieldErrors = apiError?.fieldErrors ?? {};

        setFieldErrors(nextFieldErrors);
        setFormError(
          apiError?.error ??
            "The message could not be sent. Please try again or email me directly.",
        );
        setStatus("error");
        focusField(Object.keys(nextFieldErrors)[0]);
        return;
      }

      setSubmittedName(parsed.data.name);
      setSubmittedEmail(parsed.data.email);
      setValues(initialValues);
      setHoneypot("");
      setStatus("success");
    } catch {
      setFormError(
        "The message could not be sent. Check your connection or email me directly.",
      );
      setStatus("error");
    }
  }

  return (
    <div className="rounded-[1.75rem] border border-border/80 bg-card p-5 text-card-foreground shadow-2xl shadow-black/20 sm:p-6 lg:p-7">
      {status === "success" ? (
        <div
          role="status"
          aria-live="polite"
          className="flex min-h-[22rem] flex-col justify-center py-4"
        >
          <span className="flex size-12 items-center justify-center rounded-full bg-sage text-[#143024]">
            <Check className="size-5" />
          </span>
          <p className="mt-6 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Sent
          </p>
          <h3
            ref={successRef}
            tabIndex={-1}
            className="mt-2 font-display text-[clamp(1.8rem,4vw,2.5rem)] font-semibold leading-[1.05] tracking-[-0.04em]"
          >
            Message sent.
          </h3>
          <p className="mt-4 max-w-[38ch] text-sm leading-relaxed text-muted-foreground">
            Thanks, {submittedName}. I’ll reply to {submittedEmail} within one
            business day.
          </p>
          <p className="mt-3 max-w-[38ch] text-sm leading-relaxed text-muted-foreground">
            If you need to add anything, send another message and I’ll pick it
            up with the first one.
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={resetForm}
            className="mt-7 h-10 w-fit rounded-full border-border bg-transparent px-5 text-sm font-semibold text-card-foreground hover:bg-muted"
          >
            Send another message
          </Button>
        </div>
      ) : (
        <form
          id="contact-form"
          aria-labelledby={`${formId}-heading`}
          aria-busy={isSubmitting}
          noValidate
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div>
            <h3
              id={`${formId}-heading`}
              className="font-display text-[clamp(1.55rem,3vw,2.1rem)] font-semibold leading-tight tracking-[-0.04em]"
            >
              Tell me about the project
            </h3>
            <p className="mt-2 max-w-[42ch] text-sm leading-relaxed text-muted-foreground">
              A few details now saves a round of questions later.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor={fieldId("name")} className={labelClass}>
                Name
              </Label>
              <Input
                id={fieldId("name")}
                name="name"
                autoComplete="name"
                required
                maxLength={80}
                placeholder="Ada Lovelace"
                value={values.name}
                aria-invalid={fieldErrors.name ? true : undefined}
                aria-describedby={
                  fieldErrors.name ? `${fieldId("name")}-error` : undefined
                }
                onChange={(event) => updateField("name", event.target.value)}
                className={inputClass}
              />
              {fieldErrors.name ? (
                <FieldError id={`${fieldId("name")}-error`}>
                  {fieldErrors.name}
                </FieldError>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor={fieldId("email")} className={labelClass}>
                Email
              </Label>
              <Input
                id={fieldId("email")}
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                spellCheck={false}
                required
                maxLength={254}
                placeholder="you@company.com"
                value={values.email}
                aria-invalid={fieldErrors.email ? true : undefined}
                aria-describedby={
                  fieldErrors.email ? `${fieldId("email")}-error` : undefined
                }
                onChange={(event) => updateField("email", event.target.value)}
                className={inputClass}
              />
              {fieldErrors.email ? (
                <FieldError id={`${fieldId("email")}-error`}>
                  {fieldErrors.email}
                </FieldError>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor={fieldId("company")} className={labelClass}>
                Company{" "}
                <span className="font-normal normal-case tracking-normal text-muted-foreground">
                  (optional)
                </span>
              </Label>
              <Input
                id={fieldId("company")}
                name="company"
                autoComplete="organization"
                maxLength={120}
                placeholder="Fieldnote"
                value={values.company}
                aria-invalid={fieldErrors.company ? true : undefined}
                aria-describedby={
                  fieldErrors.company
                    ? `${fieldId("company")}-error`
                    : undefined
                }
                onChange={(event) => updateField("company", event.target.value)}
                className={inputClass}
              />
              {fieldErrors.company ? (
                <FieldError id={`${fieldId("company")}-error`}>
                  {fieldErrors.company}
                </FieldError>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor={fieldId("projectType")} className={labelClass}>
                Project type
              </Label>
              <div className="relative">
                <select
                  id={fieldId("projectType")}
                  name="projectType"
                  required
                  value={values.projectType}
                  aria-invalid={fieldErrors.projectType ? true : undefined}
                  aria-describedby={
                    fieldErrors.projectType
                      ? `${fieldId("projectType")}-error`
                      : undefined
                  }
                  onChange={(event) =>
                    updateField("projectType", event.target.value)
                  }
                  className={selectClass}
                >
                  <option value="" disabled>
                    Select
                  </option>
                  {projectTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <ChevronDown />
              </div>
              {fieldErrors.projectType ? (
                <FieldError id={`${fieldId("projectType")}-error`}>
                  {fieldErrors.projectType}
                </FieldError>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor={fieldId("budget")} className={labelClass}>
                Budget
              </Label>
              <div className="relative">
                <select
                  id={fieldId("budget")}
                  name="budget"
                  required
                  value={values.budget}
                  aria-invalid={fieldErrors.budget ? true : undefined}
                  aria-describedby={
                    fieldErrors.budget
                      ? `${fieldId("budget")}-error`
                      : undefined
                  }
                  onChange={(event) =>
                    updateField("budget", event.target.value)
                  }
                  className={selectClass}
                >
                  <option value="" disabled>
                    Select
                  </option>
                  {budgets.map((budget) => (
                    <option key={budget} value={budget}>
                      {budget}
                    </option>
                  ))}
                </select>
                <ChevronDown />
              </div>
              {fieldErrors.budget ? (
                <FieldError id={`${fieldId("budget")}-error`}>
                  {fieldErrors.budget}
                </FieldError>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor={fieldId("timeline")} className={labelClass}>
                Timeline
              </Label>
              <div className="relative">
                <select
                  id={fieldId("timeline")}
                  name="timeline"
                  required
                  value={values.timeline}
                  aria-invalid={fieldErrors.timeline ? true : undefined}
                  aria-describedby={
                    fieldErrors.timeline
                      ? `${fieldId("timeline")}-error`
                      : undefined
                  }
                  onChange={(event) =>
                    updateField("timeline", event.target.value)
                  }
                  className={selectClass}
                >
                  <option value="" disabled>
                    Select
                  </option>
                  {timelines.map((timeline) => (
                    <option key={timeline} value={timeline}>
                      {timeline}
                    </option>
                  ))}
                </select>
                <ChevronDown />
              </div>
              {fieldErrors.timeline ? (
                <FieldError id={`${fieldId("timeline")}-error`}>
                  {fieldErrors.timeline}
                </FieldError>
              ) : null}
            </div>

            <div className="space-y-2 sm:col-span-2 xl:col-span-3">
              <div className="flex items-end justify-between gap-3">
                <Label htmlFor={fieldId("message")} className={labelClass}>
                  Project brief
                </Label>
                <span className="tabular text-[0.68rem] text-muted-foreground">
                  {values.message.length}/5000
                </span>
              </div>
              <Textarea
                id={fieldId("message")}
                name="message"
                required
                minLength={20}
                maxLength={5000}
                rows={4}
                placeholder="What are you building, what is not working, and when does it need to be live?"
                value={values.message}
                aria-invalid={fieldErrors.message ? true : undefined}
                aria-describedby={
                  fieldErrors.message
                    ? `${fieldId("message")}-error`
                    : undefined
                }
                onChange={(event) => updateField("message", event.target.value)}
                className="min-h-28 resize-y rounded-xl border-border/80 bg-background/80 px-3.5 py-3 text-base leading-relaxed text-foreground shadow-none placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-ring/30 md:text-sm"
              />
              {fieldErrors.message ? (
                <FieldError id={`${fieldId("message")}-error`}>
                  {fieldErrors.message}
                </FieldError>
              ) : null}
            </div>
          </div>

          <div className="hidden" aria-hidden="true">
            <Label htmlFor={`${formId}-${HONEYPOT_FIELD}`}>
              {HONEYPOT_FIELD}
            </Label>
            <Input
              id={`${formId}-${HONEYPOT_FIELD}`}
              name={HONEYPOT_FIELD}
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(event) => setHoneypot(event.target.value)}
            />
          </div>

          {formError ? (
            <p
              role="alert"
              className="rounded-xl border border-destructive/30 bg-destructive/10 px-3.5 py-3 text-sm leading-relaxed text-destructive"
            >
              {formError}
            </p>
          ) : null}

          <div className="flex flex-col gap-4 border-t border-border/80 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-[34ch] text-xs leading-relaxed text-muted-foreground">
              I’ll reply within one business day. Your details are only used to
              answer this inquiry.
            </p>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-11 w-full rounded-full bg-signal px-6 text-sm font-bold text-ink hover:bg-signal/90 focus-visible:ring-signal/40 sm:w-auto"
            >
              {isSubmitting ? (
                <>
                  <span
                    aria-hidden="true"
                    className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                  />
                  Sending…
                </>
              ) : (
                <>
                  Send project brief
                  <ArrowUpRight className="size-4 transition-transform group-hover/button:-translate-y-0.5 group-hover/button:translate-x-0.5" />
                </>
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
