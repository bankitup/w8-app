"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";

import { AppShell } from "@/components/app-shell";
import { CategoryChip } from "@/components/category-chip";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { CREATE_CATEGORY_PRESETS, getWaitCategory } from "@/lib/categories";
import { useW8 } from "@/lib/data/use-w8";
import { formatStartedLabel } from "@/lib/time";

const MAX_LENGTH = 140;

export function CreateSessionForm() {
  const router = useRouter();
  const { snapshot, isLoading, createSession } = useW8();
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeSession = snapshot?.activeSession ?? null;
  const remaining = MAX_LENGTH - message.length;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      createSession(message);
      router.push("/wait");
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Не получилось начать ожидание."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AppShell>
      <div className="flex flex-1 flex-col gap-3.5">
        <header className="space-y-2 pt-1 animate-fade-in">
          <Link href="/" className="inline-flex text-sm text-muted-foreground transition hover:text-foreground">
            ← Назад
          </Link>
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            W8 - stuck together
          </p>
          <h1 className="max-w-[12ch] font-serif text-[32px] leading-tight">
            Что ты сейчас ждёшь?
          </h1>
          <p className="max-w-[32ch] text-sm leading-6 text-muted-foreground">
            Одна короткая фраза. Как записка себе.
          </p>
        </header>

        {activeSession ? (
          <Card className="animate-fade-in">
            <CardHeader>
              <CardDescription>{formatStartedLabel(activeSession.startedAt)}</CardDescription>
              <CardTitle>Новая сессия пока недоступна.</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-6 text-foreground/88">{activeSession.message}</p>
              <Link href="/wait" className={`${buttonVariants()} w-full`}>
                Открыть текущее ожидание
              </Link>
            </CardContent>
          </Card>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-4">
            <Card className="animate-fade-in">
              <CardHeader className="pb-3">
                <CardDescription>Чаще всего ждут</CardDescription>
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {CREATE_CATEGORY_PRESETS.map((key) => {
                    const category = getWaitCategory(key);

                    return <CategoryChip key={key} category={category} />;
                  })}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  maxLength={MAX_LENGTH}
                  placeholder="Жду звонок после анализов и пытаюсь не додумывать лишнего."
                />
                <div className="flex items-center justify-between px-1">
                  <p className="text-[12px] leading-5 text-muted-foreground">
                    Без ссылок и длинных историй.
                  </p>
                  <p className="text-[12px] text-muted-foreground">{remaining}</p>
                </div>
                {error ? <p className="text-sm text-[#ff9d89]">{error}</p> : null}
              </CardContent>
            </Card>

            <div className="sticky bottom-[calc(env(safe-area-inset-bottom)+10px)] mt-auto space-y-2 rounded-[24px] border border-border bg-[rgba(252,247,241,0.9)] p-2.5 backdrop-blur">
              <Button
                type="submit"
                size="default"
                className="w-full"
                disabled={isSubmitting || isLoading}
              >
                {isSubmitting ? "Запускаю ожидание…" : "Начать ждать"}
              </Button>
              <p className="text-center text-[12px] leading-5 text-muted-foreground">
                Потом появится таймер и несколько похожих ожиданий рядом.
              </p>
            </div>
          </form>
        )}
      </div>
    </AppShell>
  );
}
