"use client";

import { LoaderCircle, Menu, Plus, Wifi, WifiOff, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const links = [
  ["Dashboard", "/dashboard"],
  ["Projects", "/projects/new"],
  ["Evidence", "/dashboard#evidence"],
  ["Verify", "/verify/demo-mangrove-restoration-bekasi"],
  ["Marketplace", "/marketplace"],
] as const;

export function SiteHeader({ dark = false }: { dark?: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [apiStatus, setApiStatus] = useState<"checking" | "connected" | "offline">("checking");
  const shell = dark ? "border-white/10 bg-navy text-white" : "border-line bg-paper text-ink";

  useEffect(() => {
    api.getHealth().then(() => setApiStatus("connected")).catch(() => setApiStatus("offline"));
  }, []);

  return (
    <header className={`relative z-50 border-b ${shell}`}>
      <div className="page-shell flex h-[72px] items-center justify-between">
        <Link href="/" className="font-display text-lg font-bold text-inherit">
          CarbonProof AI
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
          {links.map(([label, href]) => {
            const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href.split("#")[0]));
            return (
              <Link
                key={label}
                href={href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  active
                    ? dark
                      ? "border border-teal/60 bg-teal/10 text-cyan"
                      : "border border-line bg-canvas text-forest"
                    : dark
                      ? "text-white/65 hover:text-white"
                      : "text-muted hover:text-forest"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 sm:flex">
          <span
            className={`hidden h-9 items-center gap-2 rounded-full border px-3 text-[11px] font-semibold xl:inline-flex ${
              apiStatus === "connected"
                ? dark ? "border-leaf/30 bg-leaf/10 text-leaf" : "border-leaf/40 bg-leaf/15 text-moss"
                : apiStatus === "offline"
                  ? "border-coral/35 bg-coral/10 text-coral"
                  : dark ? "border-white/10 text-white/55" : "border-line text-muted"
            }`}
            role="status"
            aria-live="polite"
          >
            {apiStatus === "checking" ? <LoaderCircle className="size-3.5 animate-spin" /> : apiStatus === "connected" ? <Wifi className="size-3.5" /> : <WifiOff className="size-3.5" />}
            {apiStatus === "checking" ? "Checking API" : apiStatus === "connected" ? "API connected" : "API offline"}
          </span>
          <Link
            href="/projects/new"
            className={`hidden h-10 items-center gap-2 rounded-md border px-4 text-sm font-semibold sm:inline-flex ${
              dark ? "border-teal text-cyan" : "border-forest bg-forest text-white"
            }`}
          >
            <Plus className="size-4" /> New project
          </Link>
        </div>

        <button
          type="button"
          className="grid size-10 place-items-center lg:hidden"
          aria-label="Toggle navigation"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open ? (
        <nav className={`absolute inset-x-0 top-[72px] border-b p-4 shadow-panel lg:hidden ${shell}`}>
          {links.map(([label, href]) => (
            <Link
              key={label}
              href={href}
              onClick={() => setOpen(false)}
              className="block rounded-md px-4 py-3 text-sm font-semibold"
            >
              {label}
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
