import { cn } from "@/lib/utils";
import React from "react";

export function GridPatternContainer({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]",
        className,
      )}
    >
      <GridPattern />
    </div>
  );
}

export function GridPattern() {
  const columns = 30;
  const rows = 11;
  return (
    <div className="flex flex-shrink-0 scale-105 flex-wrap items-center justify-center gap-x-px gap-y-px bg-gray-200 dark:bg-neutral-700">
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: columns }).map((_, col) => {
          const index = row * columns + col;
          return (
            <div
              key={`${col}-${row}`}
              className={`flex h-10 w-10 flex-shrink-0 rounded-[1px] ${
                index % 2 === 0
                  ? "bg-gray-100 dark:bg-neutral-800"
                  : "bg-gray-200 dark:bg-neutral-900"
              }`}
            />
          );
        }),
      )}
    </div>
  );
}
