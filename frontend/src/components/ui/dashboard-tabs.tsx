"use client";

import type { ReactNode } from "react";
import { useState } from "react";

import { cn } from "@/lib/utils";

interface DashboardTabPane {
  value: string;
  label: string;
  content: ReactNode;
}

interface DashboardTabsProps {
  panes: DashboardTabPane[];
}

export function DashboardTabs({ panes }: DashboardTabsProps): JSX.Element | null {
  if (panes.length === 0) {
    return null;
  }

  const [activePane, setActivePane] = useState(panes[0]?.value);
  const activeContent = panes.find((pane) => pane.value === activePane)?.content;

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex flex-wrap items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white p-1 dark:border-neutral-800 dark:bg-neutral-950/60">
        {panes.map((pane) => (
          <button
            key={pane.value}
            type="button"
            onClick={() => setActivePane(pane.value)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500",
              activePane === pane.value
                ? "bg-neutral-900 text-white shadow-sm dark:bg-white dark:text-neutral-900"
                : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100",
            )}
          >
            {pane.label}
          </button>
        ))}
      </div>
      <div className="w-full max-w-2xl rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
        {activeContent}
      </div>
    </div>
  );
}
