import { Database, ExternalLink, Link2 } from "lucide-react";
import type { ReactNode } from "react";
import { shorten } from "@/lib/format";

export interface BlockchainLinkProps {
  label: string;
  value?: string | null;
  href?: string | null;
  network?: string;
  chain?: "walrus" | "sui" | "other";
  children?: ReactNode;
  className?: string;
}

export function BlockchainLink({ label, value, href, network, chain = "other", children, className = "" }: BlockchainLinkProps) {
  const Icon = chain === "walrus" ? Database : chain === "sui" ? Link2 : ExternalLink;
  const content = (
    <>
      <span className="grid size-9 shrink-0 place-items-center rounded-md bg-teal/10 text-teal"><Icon className="size-4" aria-hidden="true" /></span>
      <span className="min-w-0 flex-1">
        <span className="block text-[10px] font-semibold uppercase text-muted">{label}{network ? ` / ${network}` : ""}</span>
        <span className="mt-0.5 block truncate font-mono text-[11px] font-semibold text-forest" title={value || undefined}>{children || shorten(value)}</span>
      </span>
      {href ? <ExternalLink className="size-4 shrink-0 text-teal" aria-hidden="true" /> : null}
    </>
  );

  if (!href) return <div className={`flex min-w-0 items-center gap-3 border border-line bg-paper p-3 ${className}`}>{content}</div>;
  return (
    <a href={href} target="_blank" rel="noreferrer" className={`flex min-w-0 items-center gap-3 border border-line bg-paper p-3 transition hover:border-teal ${className}`} aria-label={`Open ${label} in a new tab`}>
      {content}
    </a>
  );
}
