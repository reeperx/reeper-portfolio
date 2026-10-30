"use client";

import { useActionState, useId } from "react";

import { loginAction, type LoginState } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: LoginState = {};

export function AdminLoginForm() {
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState,
  );
  const passwordId = useId();
  const errorId = useId();

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor={passwordId}>Admin password</Label>
        <Input
          id={passwordId}
          name="password"
          type="password"
          autoComplete="current-password"
          required
          aria-describedby={state.error ? errorId : undefined}
          aria-invalid={state.error ? true : undefined}
          className="h-11 rounded-xl border-border/80 bg-background/80"
        />
      </div>

      {state.error ? (
        <p
          id={errorId}
          role="alert"
          className="rounded-xl border border-destructive/25 bg-destructive/5 px-3 py-2 text-sm text-destructive"
        >
          {state.error}
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={isPending}
        className="h-11 w-full rounded-full"
      >
        {isPending ? "Checking…" : "Sign in"}
      </Button>
    </form>
  );
}
