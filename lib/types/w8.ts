import type { WaitCategoryKey } from "@/lib/categories";

export type SessionStatus = "active" | "finished";

export interface WaitingSession {
  id: string;
  source: "viewer" | "mock";
  status: SessionStatus;
  categoryKey?: WaitCategoryKey;
  message: string;
  finalMessage?: string;
  startedAt: string;
  finishedAt?: string;
  moodTags: string[];
  tone?: "soft" | "anxious" | "funny" | "hopeful" | "tired";
}

export interface FeedSections {
  similar: WaitingSession[];
  longest: WaitingSession[];
  funny: WaitingSession[];
  justFinished: WaitingSession[];
}

export interface ViewerSnapshot {
  activeSession: WaitingSession | null;
  history: WaitingSession[];
  feed: FeedSections;
}
