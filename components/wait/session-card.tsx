import { CategoryIcon } from "@/components/category-icon";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { resolveWaitCategory } from "@/lib/categories";
import { cn } from "@/lib/utils";
import { formatFinishedLabel, formatStartedLabel, formatWaitDuration } from "@/lib/time";
import type { WaitingSession } from "@/lib/types/w8";

export function SessionCard({
  session,
  compact,
  now
}: {
  session: WaitingSession;
  compact?: boolean;
  now: number;
}) {
  const isFinished = session.status === "finished";
  const category = resolveWaitCategory(session.moodTags, session.categoryKey);

  return (
    <Card
      className={cn(
        "border-border bg-card",
        compact ? "rounded-[20px]" : "rounded-[24px]"
      )}
    >
      <CardContent className={cn("space-y-2.5", compact ? "p-3.5" : "p-4")}>
        <div className="flex items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 text-[12px] text-muted-foreground">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <CategoryIcon category={category.key} className="h-4 w-4" />
            </span>
            <span>{category.label}</span>
            {isFinished ? <Badge variant="muted">финал</Badge> : null}
          </div>
          <p className="text-right text-xs leading-5 text-muted-foreground">
            {isFinished && session.finishedAt
              ? formatFinishedLabel(session.finishedAt, now)
              : formatWaitDuration(session.startedAt, now)}
          </p>
        </div>

        <p className="text-sm leading-6 text-foreground/88">{session.message}</p>

        {session.finalMessage ? (
          <p className="border-l border-border pl-3 text-sm leading-6 text-foreground/92">
            {session.finalMessage}
          </p>
        ) : null}

        <p className="text-[12px] leading-5 text-muted-foreground">
          {isFinished && session.finishedAt
            ? formatStartedLabel(session.startedAt)
            : `Началось: ${formatStartedLabel(session.startedAt).replace("Началось ", "").toLowerCase()}`}
        </p>
      </CardContent>
    </Card>
  );
}
