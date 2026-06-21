"use client";

import type { LucideIcon } from "lucide-react";
import { Menu, ShieldCheck, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useState } from "react";

export interface SidebarItem {
  label: string;
  href: string;
  icon?: LucideIcon;
  badge?: string | number;
  exact?: boolean;
}

export interface SidebarProps {
  items: SidebarItem[];
  brand?: ReactNode;
  footer?: ReactNode;
  mobileLabel?: string;
  className?: string;
}

export function Sidebar({ items, brand, footer, mobileLabel = "Open navigation", className = "" }: SidebarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const content = (
    <>
      <div className="flex h-[76px] items-center justify-between border-b border-white/10 px-5">
        {brand || (
          <Link href="/" className="flex items-center gap-3 font-display font-bold text-white">
            <span className="grid size-9 place-items-center rounded-md bg-teal text-navy"><ShieldCheck className="size-5" /></span>
            CarbonProof AI
          </Link>
        )}
        <button type="button" onClick={() => setOpen(false)} className="grid size-9 place-items-center text-white/70 lg:hidden" aria-label="Close navigation">
          <X className="size-5" />
        </button>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-6" aria-label="Application navigation">
        {items.map((item) => {
          const active = item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={`${item.href}-${item.label}`}
              href={item.href}
              onClick={() => setOpen(false)}
              aria-current={active ? "page" : undefined}
              className={`flex min-h-11 items-center gap-3 rounded-md border px-3 text-sm font-semibold transition ${
                active ? "border-teal/45 bg-teal/15 text-cyan" : "border-transparent text-white/65 hover:bg-white/[0.06] hover:text-white"
              }`}
            >
              {Icon ? <Icon className="size-[18px] shrink-0" /> : <span className="size-1.5 rounded-full bg-current" />}
              <span className="min-w-0 flex-1 truncate">{item.label}</span>
              {item.badge !== undefined ? <span className="rounded-full bg-white/10 px-2 py-0.5 font-mono text-[10px]">{item.badge}</span> : null}
            </Link>
          );
        })}
      </nav>
      {footer ? <div className="border-t border-white/10 p-4">{footer}</div> : null}
    </>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 left-5 z-40 grid size-11 place-items-center rounded-md bg-navy text-white shadow-deep lg:hidden"
        aria-label={mobileLabel}
        aria-expanded={open}
      >
        <Menu className="size-5" />
      </button>
      {open ? <button type="button" className="fixed inset-0 z-40 bg-navy/55 lg:hidden" onClick={() => setOpen(false)} aria-label="Close navigation overlay" /> : null}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col bg-navy transition-transform lg:sticky lg:top-0 lg:h-screen ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} ${className}`}>
        {content}
      </aside>
    </>
  );
}
