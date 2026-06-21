import { LoaderCircle } from "lucide-react";

export default function Loading() {
  return (
    <main className="grid min-h-screen place-items-center bg-canvas px-6">
      <div className="flex items-center gap-3 text-sm font-semibold text-forest">
        <LoaderCircle className="size-5 animate-spin text-teal" />
        Loading verifiable evidence...
      </div>
    </main>
  );
}
