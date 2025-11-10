import type { JSX } from "react";

import { FloatingNav } from "@/components/ui/floating-navbar";
import { DashboardTabs } from "@/components/ui/dashboard-tabs";

export default function DashboardPage(): JSX.Element {
  return (
    <>
      <FloatingNav
        navItems={[
          { name: "Home", link: "/" },
          { name: "About", link: "/#about" },
          { name: "Contact", link: "/#contact" },
        ]}
      />
      <main className="min-h-screen bg-white px-4 pb-16 pt-36 md:pt-40 dark:bg-neutral-900">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-12">
          <header className="space-y-4">
            <p className="text-sm font-medium uppercase tracking-widest text-blue-600 dark:text-blue-400">
              Dashboard
            </p>
          </header>

          <DashboardTabs
            panes={[
              {
                value: "inheritance",
                label: "Inheritance",
                content: (
                  <p className="text-base leading-relaxed text-neutral-600 dark:text-neutral-300">
                    Build your inheritance blueprint here. Define asset vaults,
                    guardian roles, and activation logic so every scenario
                    routes to the right heirs with clarity and compliance.
                  </p>
                ),
              },
              {
                value: "inheritance-vaults",
                label: "Inheritance Vaults",
                content: (
                  <p className="text-base leading-relaxed text-neutral-600 dark:text-neutral-300">
                    Track incoming inheritance events, confirm identity
                    requirements, and acknowledge readiness checkpoints to
                    unlock secured asset releases.
                  </p>
                ),
              },
            ]}
          />

          <footer className="rounded-2xl border border-dashed border-neutral-300 p-6 text-sm text-neutral-600 dark:border-neutral-700 dark:text-neutral-400">
            Future releases will surface live vault metrics, guardian
            acknowledgements, and automated readiness alerts—stay tuned.
          </footer>
        </div>
      </main>
    </>
  );
}
