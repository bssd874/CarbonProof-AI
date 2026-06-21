import { FolderOpen } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function EmptyState({ title, description, action, icon: Icon = FolderOpen, className = "" }: { title: string; description: string; action?: ReactNode; icon?: LucideIcon; className?: string }) {
  return <section className={`panel flex min-h-64 flex-col items-center justify-center px-6 py-12 text-center ${className}`}><Icon className="size-9 text-teal" /><h2 className="mt-5 font-display text-xl font-bold text-forest">{title}</h2><p className="mt-2 max-w-md text-sm leading-6 text-muted">{description}</p>{action ? <div className="mt-6">{action}</div> : null}</section>;
}
