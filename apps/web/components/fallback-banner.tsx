import { CloudOff } from "lucide-react";

export function FallbackBanner() {
  return (
    <div className="flex items-start gap-3 border-y border-amber/35 bg-amber/10 px-4 py-3 text-sm text-[#75540e]">
      <CloudOff className="mt-0.5 size-4 shrink-0" />
      <p>
        Live API is temporarily unavailable. CarbonProof is showing the seeded Bekasi demo so the proof workflow remains reviewable.
      </p>
    </div>
  );
}
