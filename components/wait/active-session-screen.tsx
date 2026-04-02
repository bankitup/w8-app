"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { AppShell } from "@/components/app-shell";
import { FinishSessionDialog } from "@/components/wait/finish-session-dialog";
import { SessionCard } from "@/components/wait/session-card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useW8 } from "@/lib/data/use-w8";
import { formatStartedLabel, formatWaitDuration } from "@/lib/time";

const FEED_SECTIONS = [
  {
    key: "similar",
    title: "Похожие на тебя"
  },
  {
    key: "longest",
    title: "Дольше всех ждут"
  },
  {
    key: "funny",
    title: "Смешно сейчас"
  },
  {
    key: "justFinished",
    title: "Кто только что дождался"
  }
] as const;

export function ActiveSessionScreen() {
  const router = useRouter();
  const { snapshot, isLoading, finishSession } = useW8();
  const [now, setNow] = useState(() => Date.now());
  const [finishOpen, setFinishOpen] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30000);
    return () => window.clearInterval(timer);
  }, []);

  const activeSession = snapshot?.activeSession ?? null;

  const sectionMap = useMemo(() => snapshot?.feed ?? null, [snapshot]);

  async function handleFinish(message: string) {
    finishSession(message);
    router.replace("/");
  }

  if (isLoading) {
    return (
      <AppShell>
        <div className="flex flex-1 items-center justify-center">
          <p className="text-sm text-muted-foreground">Собираю твоё ожидание…</p>
        </div>
      </AppShell>
    );
  }

  if (!activeSession || !sectionMap) {
    return (
      <AppShell>
        <div className="flex flex-1 flex-col gap-4 pt-6">
          <Link href="/" className="inline-flex text-sm text-muted-foreground transition hover:text-foreground">
            ← На главную
          </Link>

          <Card>
            <CardHeader>
              <CardDescription>Сейчас пусто</CardDescription>
              <CardTitle>Активного ожидания нет.</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-6 text-muted-foreground">
                Начни новую короткую запись, и лента снова соберётся вокруг неё.
              </p>
              <Link href="/start" className={`${buttonVariants()} w-full`}>
                Начать ждать
              </Link>
            </CardContent>
          </Card>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="flex flex-1 flex-col gap-5">
        <header className="space-y-2 pt-2 animate-fade-in">
          <div className="flex items-center justify-between">
            <Link href="/" className="inline-flex text-sm text-muted-foreground transition hover:text-foreground">
              ← Главная
            </Link>
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">W8</p>
          </div>
          <h1 className="font-serif text-3xl leading-tight">Текущее ожидание</h1>
        </header>

        <Card className="animate-fade-in overflow-hidden border-primary/[0.12] bg-[#151210]/95">
          <CardHeader>
            <CardDescription>{formatStartedLabel(activeSession.startedAt)}</CardDescription>
            <CardTitle className="text-[18px] text-muted-foreground">Сейчас</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <p className="text-center font-serif text-[42px] leading-none text-primary">
              {formatWaitDuration(activeSession.startedAt, now)}
            </p>
            <p className="text-center text-base leading-7 text-foreground/92">
              {activeSession.message}
            </p>
          </CardContent>
        </Card>

        <div className="space-y-5 pb-4">
          {FEED_SECTIONS.map((section) => {
            const sessions = sectionMap[section.key];

            return (
              <section key={section.key} className="space-y-3 animate-fade-in">
                <h2 className="px-1 text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  {section.title}
                </h2>
                <div className="space-y-3">
                  {sessions.map((session) => (
                    <SessionCard key={`${section.key}-${session.id}`} session={session} now={now} compact />
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        <div className="sticky bottom-[calc(env(safe-area-inset-bottom)+12px)] mt-auto animate-fade-in rounded-[28px] border border-white/[0.06] bg-background/88 p-3 backdrop-blur">
          <Button size="lg" variant="secondary" className="w-full" onClick={() => setFinishOpen(true)}>
            Завершить ожидание
          </Button>
        </div>
      </div>

      <FinishSessionDialog
        open={finishOpen}
        onOpenChange={setFinishOpen}
        onFinish={handleFinish}
      />
    </AppShell>
  );
}
