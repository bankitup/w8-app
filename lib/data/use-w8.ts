"use client";

import { useCallback, useEffect, useState } from "react";

import { getW8Repository } from "@/lib/data/w8-repository";
import type { ViewerSnapshot } from "@/lib/types/w8";

export function useW8() {
  const [snapshot, setSnapshot] = useState<ViewerSnapshot | null>(null);

  const refresh = useCallback(() => {
    setSnapshot(getW8Repository().getSnapshot());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createSession = useCallback((message: string) => {
    const next = getW8Repository().createSession(message);
    setSnapshot(next);
    return next;
  }, []);

  const finishSession = useCallback((message: string) => {
    const next = getW8Repository().finishSession(message);
    setSnapshot(next);
    return next;
  }, []);

  return {
    snapshot,
    isLoading: snapshot === null,
    refresh,
    createSession,
    finishSession
  };
}
