import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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

  return (
    <Card
      className={cn(
        "border-white/[0.06] bg-[#14110f]/82",
        compact ? "rounded-[24px]" : "rounded-[28px]"
      )}
    >
      <CardContent className={cn("space-y-3", compact ? "p-4" : "p-5")}>
        <div className="flex items-center justify-between gap-3">
          <Badge variant="muted">{isFinished ? "финал" : "ждёт"}</Badge>
          <p className="text-right text-xs leading-5 text-muted-foreground">
            {isFinished && session.finishedAt
              ? formatFinishedLabel(session.finishedAt, now)
              : formatWaitDuration(session.startedAt, now)}
          </p>
        </div>

        <p className="text-sm leading-6 text-foreground/88">{session.message}</p>

        {session.finalMessage ? (
          <p className="border-l border-primary/30 pl-3 text-sm leading-6 text-foreground">
            {session.finalMessage}
          </p>
        ) : null}

        <p className="text-xs leading-5 text-muted-foreground">
          {isFinished && session.finishedAt
            ? formatStartedLabel(session.startedAt)
            : `Началось: ${formatStartedLabel(session.startedAt).replace("Началось ", "").toLowerCase()}`}
        </p>
      </CardContent>
    </Card>
  );
}
