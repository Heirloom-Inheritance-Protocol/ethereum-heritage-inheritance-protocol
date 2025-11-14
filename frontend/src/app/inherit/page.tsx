"use client";

import type { JSX } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";

import { FloatingNav } from "@/components/ui/floating-navbar";
import { InheritanceForm } from "@/components/dashboard/inheritance-form";
import { MAIN_NAV_ITEMS } from "@/lib/navigation";

export default function InheritPage(): JSX.Element {
  const router = useRouter();
  const { ready, authenticated } = usePrivy();

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/");
    }
  }, [ready, authenticated, router]);

  if (!ready || !authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-neutral-900">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-neutral-200 border-t-neutral-900 dark:border-neutral-700 dark:border-t-white" />
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Verifying wallet connection...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <FloatingNav navItems={MAIN_NAV_ITEMS} />
      <main className="min-h-screen bg-white px-4 pb-16 pt-36 md:pt-40 dark:bg-neutral-900">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-12">
          <section className="space-y-4">
            <header className="space-y-2">
              <h1 className="text-3xl font-semibold text-neutral-900 dark:text-white">
                Create an Inheritance Vault
              </h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-300">
                Encrypt knowledge assets and designate successors with on-chain
                guarantees.
              </p>
            </header>
            <InheritanceForm />
          </section>
        </div>
      </main>
    </>
  );
}
