"use client";

import type { JSX, ReactNode } from "react";

import { cn } from "@/lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps): JSX.Element {
  return (
    <div className={cn("rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900", className)}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: CardProps): JSX.Element {
  return (
    <div className={cn("flex flex-col space-y-1.5 p-6", className)}>
      {children}
    </div>
  );
}

export function CardContent({ children, className }: CardProps): JSX.Element {
  return <div className={cn("p-6 pt-0", className)}>{children}</div>;
}

export function CardTitle({ children, className }: CardProps): JSX.Element {
  return (
    <h3 className={cn("text-lg font-semibold leading-none tracking-tight", className)}>
      {children}
    </h3>
  );
}

export function CardDescription({
  children,
  className,
}: CardProps): JSX.Element {
  return (
    <p className={cn("text-sm text-neutral-500 dark:text-neutral-400", className)}>
      {children}
    </p>
  );
}
