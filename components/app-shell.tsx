import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-4 pb-[calc(env(safe-area-inset-bottom)+104px)] pt-[calc(env(safe-area-inset-top)+12px)]">
        {children}
      </div>
    </main>
  );
}
