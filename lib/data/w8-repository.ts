"use client";

import { buildMockSessions } from "@/lib/data/mock-sessions";
import type {
  FeedSections,
  ViewerSnapshot,
  WaitingSession
} from "@/lib/types/w8";

const STORAGE_KEY = "w8-viewer-state";
const MAX_MESSAGE_LENGTH = 140;
const MAX_FINAL_LENGTH = 120;

type PersistedState = {
  activeSession: WaitingSession | null;
  history: WaitingSession[];
};

export interface W8Repository {
  getSnapshot(): ViewerSnapshot;
  createSession(message: string): ViewerSnapshot;
  finishSession(finalMessage: string): ViewerSnapshot;
}

const STOP_WORDS = new Set([
  "и",
  "в",
  "во",
  "не",
  "на",
  "но",
  "а",
  "что",
  "как",
  "я",
  "ты",
  "он",
  "она",
  "мы",
  "они",
  "это",
  "же",
  "ли",
  "то",
  "уже",
  "просто"
]);

const TAG_RULES: Array<{ tag: string; includes: string[] }> = [
  { tag: "отношения", includes: ["он", "она", "бывш", "люб", "парень", "девушк"] },
  { tag: "работа", includes: ["оффер", "собесед", "резюме", "работ", "HR", "эйчар"] },
  { tag: "ответ", includes: ["ответ", "напиш", "сообщ", "письмо", "уведомл", "звонок"] },
  { tag: "учёба", includes: ["экзам", "зачет", "универ", "курс", "препод"] },
  { tag: "доставка", includes: ["курьер", "достав", "заказ"] },
  { tag: "дом", includes: ["квартир", "дом", "мастер", "ремонт", "сосед"] },
  { tag: "здоровье", includes: ["врач", "анализ", "больниц", "стомат"] },
  { tag: "дорога", includes: ["поезд", "самолет", "рейс", "метро", "автобус"] },
  { tag: "семья", includes: ["мам", "пап", "сем", "бабуш"] },
  { tag: "друзья", includes: ["подруг", "друг"] },
  { tag: "кот", includes: ["кот", "кошка"] },
  { tag: "тревога", includes: ["трев", "боюсь", "страш", "паник", "нерв"] },
  { tag: "надежда", includes: ["наде", "может", "вдруг", "верю"] },
  { tag: "усталость", includes: ["устал", "сил", "надоело"] },
  { tag: "смешно", includes: ["смеш", "лол", "ха", "ирони"] },
  { tag: "ночь", includes: ["ноч", "вечер", "утро"] }
];

function safeStorage(): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage;
}

function normalizeText(input: string) {
  return input.replace(/\s+/g, " ").trim();
}

function ensureShortText(input: string, maxLength: number) {
  const normalized = normalizeText(input);

  if (normalized.length < 6) {
    throw new Error("Нужно хотя бы несколько слов.");
  }

  if (normalized.length > maxLength) {
    throw new Error(`Слишком длинно. До ${maxLength} символов.`);
  }

  if (/(https?:\/\/|www\.|t\.me|@\w+)/i.test(normalized)) {
    throw new Error("Без ссылок и явных контактов. Здесь только короткая запись.");
  }

  return normalized;
}

function extractTokens(text: string): string[] {
  return normalizeText(text)
    .toLowerCase()
    .replace(/[.,!?;:()«»"]/g, " ")
    .split(" ")
    .map((token) => token.trim())
    .filter((token) => token.length > 2 && !STOP_WORDS.has(token));
}

function deriveMoodTags(text: string): string[] {
  const lower = text.toLowerCase();
  const matched = TAG_RULES.filter((rule) =>
    rule.includes.some((token) => lower.includes(token.toLowerCase()))
  ).map((rule) => rule.tag);

  return matched.length > 0 ? matched : ["ожидание"];
}

function inferTone(tags: string[]): WaitingSession["tone"] {
  if (tags.includes("смешно")) {
    return "funny";
  }

  if (tags.includes("тревога")) {
    return "anxious";
  }

  if (tags.includes("надежда")) {
    return "hopeful";
  }

  if (tags.includes("усталость")) {
    return "tired";
  }

  return "soft";
}

function loadState(): PersistedState {
  const storage = safeStorage();

  if (!storage) {
    return { activeSession: null, history: [] };
  }

  const raw = storage.getItem(STORAGE_KEY);

  if (!raw) {
    return { activeSession: null, history: [] };
  }

  try {
    const parsed = JSON.parse(raw) as PersistedState;
    return {
      activeSession: parsed.activeSession ?? null,
      history: Array.isArray(parsed.history) ? parsed.history : []
    };
  } catch {
    return { activeSession: null, history: [] };
  }
}

function saveState(state: PersistedState) {
  const storage = safeStorage();

  if (!storage) {
    return;
  }

  storage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function sessionScore(candidate: WaitingSession, active: WaitingSession | null) {
  if (!active) {
    return 0;
  }

  let score = 0;

  for (const tag of candidate.moodTags) {
    if (active.moodTags.includes(tag)) {
      score += 3;
    }
  }

  const activeTokens = new Set(extractTokens(active.message));

  for (const token of extractTokens(candidate.message)) {
    if (activeTokens.has(token)) {
      score += 2;
    }
  }

  return score;
}

function buildFeed(active: WaitingSession | null, now = Date.now()): FeedSections {
  const mockSessions = buildMockSessions(now);
  const activeMocks = mockSessions.filter((session) => session.status === "active");
  const finishedMocks = mockSessions.filter((session) => session.status === "finished");

  const similar = [...activeMocks]
    .sort((left, right) => sessionScore(right, active) - sessionScore(left, active))
    .slice(0, 4);

  const longest = [...activeMocks]
    .sort(
      (left, right) =>
        new Date(left.startedAt).getTime() - new Date(right.startedAt).getTime()
    )
    .slice(0, 4);

  const funny = [...mockSessions]
    .filter(
      (session) =>
        session.tone === "funny" ||
        session.moodTags.includes("смешно") ||
        session.message.includes("кот")
    )
    .slice(0, 4);

  const justFinished = [...finishedMocks]
    .sort(
      (left, right) =>
        new Date(right.finishedAt ?? 0).getTime() - new Date(left.finishedAt ?? 0).getTime()
    )
    .slice(0, 4);

  return {
    similar,
    longest,
    funny,
    justFinished
  };
}

function buildSnapshot(state: PersistedState): ViewerSnapshot {
  return {
    activeSession: state.activeSession,
    history: [...state.history].sort(
      (left, right) =>
        new Date(right.finishedAt ?? right.startedAt).getTime() -
        new Date(left.finishedAt ?? left.startedAt).getTime()
    ),
    feed: buildFeed(state.activeSession)
  };
}

function createLocalRepository(): W8Repository {
  return {
    getSnapshot() {
      return buildSnapshot(loadState());
    },
    createSession(message) {
      const current = loadState();

      if (current.activeSession) {
        throw new Error("Сначала закончи текущее ожидание.");
      }

      const safeMessage = ensureShortText(message, MAX_MESSAGE_LENGTH);
      const moodTags = deriveMoodTags(safeMessage);

      const nextState: PersistedState = {
        ...current,
        activeSession: {
          id: `viewer-${Date.now()}`,
          source: "viewer",
          status: "active",
          message: safeMessage,
          startedAt: new Date().toISOString(),
          moodTags,
          tone: inferTone(moodTags)
        }
      };

      saveState(nextState);
      return buildSnapshot(nextState);
    },
    finishSession(finalMessage) {
      const current = loadState();

      if (!current.activeSession) {
        throw new Error("Сейчас нет активного ожидания.");
      }

      const safeMessage = ensureShortText(finalMessage, MAX_FINAL_LENGTH);

      const finishedSession: WaitingSession = {
        ...current.activeSession,
        status: "finished",
        finalMessage: safeMessage,
        finishedAt: new Date().toISOString()
      };

      const nextState: PersistedState = {
        activeSession: null,
        history: [finishedSession, ...current.history].slice(0, 12)
      };

      saveState(nextState);
      return buildSnapshot(nextState);
    }
  };
}

let repository: W8Repository | null = null;

export function getW8Repository(): W8Repository {
  if (!repository) {
    repository = createLocalRepository();
  }

  return repository;
}
