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
      <div className="flex flex-1 flex-col gap-4">
        <header className="animate-fade-in space-y-3 pt-2">
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">W8</p>
          <h1 className="max-w-[10ch] font-serif text-[42px] leading-[0.96] text-balance">
            Маленькая вещь, чтобы переждать.
          </h1>
          <p className="max-w-[28ch] text-sm leading-6 text-muted-foreground">
            Одна запись. Один таймер. Несколько похожих ожиданий рядом.
          </p>
        </header>

        <Card className="animate-fade-in bg-[#151210]/92">
          <CardHeader>
            <CardDescription>Сейчас внутри</CardDescription>
            <CardTitle className="text-[28px]">Активное ожидание, таймер и спокойная подборка рядом.</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm leading-6 text-foreground/88">
              Без профилей, без сообщений, без шума. Просто короткая фраза о том,
              что тянется прямо сейчас.
            </p>
            <p className="text-xs leading-5 text-muted-foreground">
              Похожие на тебя. Дольше всех ждут. Смешно сейчас. Кто только что дождался.
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
              <CardTitle className="text-[24px]">Последний финал</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm leading-6 text-foreground/86">{lastFinished.message}</p>
              <p className="text-sm leading-6 text-foreground">{lastFinished.finalMessage}</p>
            </CardContent>
          </Card>
        ) : null}

        {activeSession ? (
          <Card className="animate-fade-in">
            <CardHeader>
              <CardDescription>{formatStartedLabel(activeSession.startedAt)}</CardDescription>
              <CardTitle className="text-[24px]">Ожидание уже идёт.</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-6 text-foreground/88">{activeSession.message}</p>
              <Link href="/wait" className={`${buttonVariants({ size: "lg" })} w-full`}>
                Вернуться к нему
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="sticky bottom-[calc(env(safe-area-inset-bottom)+12px)] mt-auto animate-fade-in space-y-3 rounded-[28px] border border-white/[0.06] bg-background/88 p-3 backdrop-blur">
            <Link href="/start" className={`${buttonVariants({ size: "lg" })} w-full`}>
              Начать ждать
            </Link>
            <p className="text-center text-xs leading-5 text-muted-foreground">
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
