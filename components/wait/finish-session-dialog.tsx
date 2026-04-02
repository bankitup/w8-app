"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

const MAX_LENGTH = 120;

export function FinishSessionDialog({
  open,
  onOpenChange,
  onFinish
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFinish: (message: string) => Promise<void> | void;
}) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleFinish() {
    setError(null);
    setIsSubmitting(true);

    try {
      await onFinish(message);
      setMessage("");
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Не получилось завершить ожидание."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Дождался?</DialogTitle>
          <DialogDescription>
            Оставь короткий финал. Одно сообщение о том, чем всё закончилось.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-3">
          <Textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Ответ пришёл. Я зря накрутил себя сильнее, чем нужно."
            maxLength={MAX_LENGTH}
            className="min-h-[120px]"
          />
          <div className="flex items-center justify-between px-1">
            <p className="text-xs text-muted-foreground">До {MAX_LENGTH} символов.</p>
            <p className="text-xs text-muted-foreground">{MAX_LENGTH - message.length}</p>
          </div>
          {error ? <p className="text-sm text-[#ff9d89]">{error}</p> : null}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="secondary"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Ещё жду
          </Button>
          <Button type="button" onClick={handleFinish} disabled={isSubmitting}>
            {isSubmitting ? "Сохраняю…" : "Завершить"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
