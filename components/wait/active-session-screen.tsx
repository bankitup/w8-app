"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { AppShell } from "@/components/app-shell";
import { CategoryChip } from "@/components/category-chip";
import { FinishSessionDialog } from "@/components/wait/finish-session-dialog";
import { SessionCard } from "@/components/wait/session-card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { resolveWaitCategory } from "@/lib/categories";
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
  const activeCategory = activeSession
    ? resolveWaitCategory(activeSession.moodTags)
    : null;

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
                Начни новую короткую запись, и рядом снова появятся похожие ожидания.
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
      <div className="flex flex-1 flex-col gap-4">
        <header className="space-y-2 pt-1 animate-fade-in">
          <div className="flex items-center justify-between">
            <Link href="/" className="inline-flex text-sm text-muted-foreground transition hover:text-foreground">
              ← Главная
            </Link>
          </div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            W8 - stuck together
          </p>
          <h1 className="font-serif text-[30px] leading-tight">Текущее ожидание</h1>
        </header>

        <Card className="animate-fade-in overflow-hidden border-primary/[0.12]">
          <CardHeader className="space-y-2">
            <CardDescription>{formatStartedLabel(activeSession.startedAt)}</CardDescription>
            {activeCategory ? (
              <CategoryChip category={activeCategory} compact className="w-fit" />
            ) : null}
          </CardHeader>
          <CardContent className="space-y-3.5">
            <p className="font-serif text-[34px] leading-none text-foreground">
              {formatWaitDuration(activeSession.startedAt, now)}
            </p>
            <p className="text-base leading-7 text-foreground/92">
              {activeSession.message}
            </p>
          </CardContent>
        </Card>

        <div className="space-y-4 pb-3">
          {FEED_SECTIONS.map((section) => {
            const sessions = sectionMap[section.key];

            return (
              <section key={section.key} className="space-y-2.5 animate-fade-in">
                <h2 className="px-1 text-[13px] font-medium text-muted-foreground">
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

        <div className="sticky bottom-[calc(env(safe-area-inset-bottom)+10px)] mt-auto animate-fade-in rounded-[24px] border border-border bg-[rgba(252,247,241,0.9)] p-2.5 backdrop-blur">
          <Button size="default" variant="secondary" className="w-full" onClick={() => setFinishOpen(true)}>
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
