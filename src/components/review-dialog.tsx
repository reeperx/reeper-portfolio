"use client";

import { ReviewForm } from "@/components/review-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type ReviewDialogProps = {
  label?: string;
  triggerClassName?: string;
};

export function ReviewDialog({
  label = "Write a review",
  triggerClassName,
}: ReviewDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          className={
            triggerClassName ??
            "h-11 rounded-full bg-foreground px-5 text-sm font-semibold text-background hover:bg-foreground/90"
          }
        >
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Client review
          </p>
          <DialogTitle>Leave a review.</DialogTitle>
          <DialogDescription>
            Tell me what the work was like, what changed, and whether it was
            worth it. Your email stays private, and nothing is published until
            I check it against project records.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6">
          <ReviewForm />
        </div>
      </DialogContent>
    </Dialog>
  );
}
