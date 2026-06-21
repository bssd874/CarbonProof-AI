import type { LucideIcon } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";

export function StatePanel({
  state,
  title,
  description,
  icon: Icon,
  action,
}: {
  state: "loading" | "empty" | "error";
  title: string;
  description: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
}) {
  if (state === "loading") return <LoadingState label={title} />;
  if (state === "error") return <ErrorState title={title} description={description} />;
  return <EmptyState title={title} description={description} icon={Icon} action={action} />;
}

export function SkeletonRows({ count = 4 }: { count?: number }) {
  return <LoadingState rows={count} />;
}
