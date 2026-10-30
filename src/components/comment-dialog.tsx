"use client";

import type { ComponentProps } from "react";

import { CommentForm } from "@/components/comment-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type CommentDialogProps = {
  postSlug: string;
  parentId?: string;
  replyToName?: string;
  label?: string;
  triggerClassName?: string;
  triggerVariant?: ComponentProps<typeof Button>["variant"];
  compact?: boolean;
};

export function CommentDialog({
  postSlug,
  parentId,
  replyToName,
  label = "Leave a comment",
  triggerClassName,
  triggerVariant = "default",
  compact = false,
}: CommentDialogProps) {
  const isReply = Boolean(parentId);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant={triggerVariant}
          className={
            triggerClassName ??
            "h-11 rounded-full bg-foreground px-5 text-sm font-semibold text-background hover:bg-foreground/90"
          }
        >
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            {isReply ? "Reply" : "Discussion"}
          </p>
          <DialogTitle>
            {isReply && replyToName
              ? `Reply to ${replyToName}.`
              : "Leave a comment."}
          </DialogTitle>
          <DialogDescription>
            {isReply
              ? "Keep it useful, ask a question, or disagree well. Your email stays private and the reply is checked before it appears."
              : "Add something useful, ask a question, or disagree well. Your email stays private and comments are checked before they appear."}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6">
          <CommentForm
            postSlug={postSlug}
            parentId={parentId}
            compact={compact}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
