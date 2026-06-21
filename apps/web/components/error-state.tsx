import { AlertTriangle, RotateCcw } from "lucide-react";

export function ErrorState({ title = "Unable to load data", description, onRetry, retryLabel = "Try again", className = "" }: { title?: string; description: string; onRetry?: () => void; retryLabel?: string; className?: string }) {
  return (
    <section className={`panel flex min-h-64 flex-col items-center justify-center px-6 py-12 text-center ${className}`} role="alert">
      <span className="grid size-12 place-items-center rounded-full bg-coral/10 text-coral"><AlertTriangle className="size-6" /></span>
      <h2 className="mt-5 font-display text-xl font-bold text-forest">{title}</h2><p className="mt-2 max-w-md text-sm leading-6 text-muted">{description}</p>
      {onRetry ? <button type="button" onClick={onRetry} className="mt-6 inline-flex h-10 items-center gap-2 rounded-md bg-forest px-4 text-sm font-semibold text-white"><RotateCcw className="size-4" /> {retryLabel}</button> : null}
    </section>
  );
}
