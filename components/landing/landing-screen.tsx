"use client";

import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { useW8 } from "@/lib/data/use-w8";
import { formatFinishedLabel, formatStartedLabel } from "@/lib/time";

export function LandingScreen() {
  const { snapshot, isLoading } = useW8();
  const activeSession = snapshot?.activeSession ?? null;
  const lastFinished = snapshot?.history[0];

  return (
    <AppShell>
      <div className="flex flex-1 flex-col gap-3.5">
        <header className="animate-fade-in space-y-2 pt-1">
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            W8 - stuck together
          </p>
          <h1 className="max-w-[11ch] font-serif text-[34px] leading-[1.02] text-balance">
            Небольшая вещь, чтобы переждать.
          </h1>
          <p className="max-w-[29ch] text-sm leading-6 text-muted-foreground">
            Короткая запись, таймер и несколько похожих ожиданий рядом.
          </p>
        </header>

        <Card className="animate-fade-in">
          <CardHeader>
            <CardDescription>Как устроено</CardDescription>
            <CardTitle className="text-[24px]">Одна активная запись за раз.</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            <p className="text-sm leading-6 text-foreground/88">
              Без профилей, без сообщений, без лишнего шума. Просто короткая фраза
              о том, что тянется прямо сейчас.
            </p>
            <p className="text-[13px] leading-5 text-muted-foreground">
              Похожие на тебя, дольше всех ждут, смешно сейчас и кто только что дождался.
            </p>
          </CardContent>
        </Card>

        {lastFinished ? (
          <Card className="animate-fade-in">
            <CardHeader>
              <CardDescription>
                {lastFinished.finishedAt
                  ? formatFinishedLabel(lastFinished.finishedAt)
                  : "Финал сохранён"}
              </CardDescription>
              <CardTitle className="text-[22px]">Последний финал</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5">
              <p className="text-sm leading-6 text-foreground/86">{lastFinished.message}</p>
              <p className="text-sm leading-6 text-foreground/94">{lastFinished.finalMessage}</p>
            </CardContent>
          </Card>
        ) : null}

        {activeSession ? (
          <Card className="animate-fade-in">
            <CardHeader>
              <CardDescription>{formatStartedLabel(activeSession.startedAt)}</CardDescription>
              <CardTitle className="text-[22px]">Ожидание уже идёт.</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-6 text-foreground/88">{activeSession.message}</p>
              <Link href="/wait" className={`${buttonVariants({ size: "lg" })} w-full`}>
                Вернуться к нему
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="sticky bottom-[calc(env(safe-area-inset-bottom)+10px)] mt-auto animate-fade-in space-y-2 rounded-[24px] border border-border bg-[rgba(252,247,241,0.88)] p-2.5 backdrop-blur">
            <Link href="/start" className={`${buttonVariants({ size: "lg" })} w-full`}>
              Начать ждать
            </Link>
            <p className="px-2 text-center text-[12px] leading-5 text-muted-foreground">
              {isLoading
                ? "Читаю твою локальную историю…"
                : "Ничего лишнего: только короткий текст и общее чувство времени."}
            </p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
