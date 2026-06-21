"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="grid min-h-screen place-items-center bg-canvas p-6">
      <section className="panel max-w-lg p-8 text-center">
        <AlertTriangle className="mx-auto size-10 text-coral" />
        <h1 className="mt-5 font-display text-2xl font-bold text-forest">
          CarbonProof could not load this view
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          Your evidence remains unchanged. Retry the request or return to the dashboard.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 inline-flex h-11 items-center gap-2 rounded-md bg-forest px-5 text-sm font-semibold text-white"
        >
          <RotateCcw className="size-4" /> Retry
        </button>
      </section>
    </main>
  );
}
