import type { ReactNode } from "react";

export interface HeaderProps {
  title: string;
  description?: string;
  eyebrow?: string;
  actions?: ReactNode;
  leading?: ReactNode;
  className?: string;
}

export function Header({ title, description, eyebrow, actions, leading, className = "" }: HeaderProps) {
  return (
    <header className={`border-b border-line bg-paper/95 px-5 py-5 backdrop-blur sm:px-8 ${className}`}>
      <div className="flex min-h-14 flex-wrap items-center justify-between gap-5">
        <div className="flex min-w-0 items-center gap-4">
          {leading}
          <div className="min-w-0">
            {eyebrow ? <p className="eyebrow mb-1">{eyebrow}</p> : null}
            <h1 className="truncate font-display text-xl font-bold text-forest sm:text-2xl">{title}</h1>
            {description ? <p className="mt-1 max-w-2xl text-sm leading-5 text-muted">{description}</p> : null}
          </div>
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
    </header>
  );
}
