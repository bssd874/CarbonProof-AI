import { ExternalLink } from "lucide-react";
import { CopyableValue } from "@/components/copyable-value";

export function CopyableHash({
  label,
  value,
  href,
  tone = "light",
}: {
  label: string;
  value?: string | null;
  href?: string;
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  return (
    <div className="relative">
      <CopyableValue label={label} value={value} tone={tone} className={href && value ? "pr-10" : ""} />
      {href && value ? <a href={href} target="_blank" rel="noreferrer" className={`absolute right-10 top-3 grid size-8 place-items-center rounded text-teal ${dark ? "hover:bg-white/10" : "hover:bg-teal/10"}`} aria-label={`Open ${label}`}><ExternalLink className="size-4" /></a> : null}
    </div>
  );
}
