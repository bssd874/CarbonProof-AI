import { Database, FileCheck2 } from "lucide-react";
import type { ReactNode } from "react";
import { BlockchainLink } from "@/components/blockchain-link";
import { CopyableValue } from "@/components/copyable-value";
import { evidenceTypeLabels, formatBytes, formatDate, suiTransactionUrl } from "@/lib/format";
import type { Evidence } from "@/lib/types";

export interface EvidenceCardProps {
  evidence: Evidence;
  actions?: ReactNode;
  compact?: boolean;
  className?: string;
}

export function EvidenceCard({ evidence, actions, compact = false, className = "" }: EvidenceCardProps) {
  const proofReady = Boolean(evidence.walrusBlobId && evidence.suiObjectId);
  return (
    <article className={`border border-line bg-paper shadow-panel ${compact ? "p-4" : "p-5 sm:p-6"} ${className}`} style={{ borderRadius: 8 }}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <span className={`grid size-10 shrink-0 place-items-center rounded-md ${proofReady ? "bg-teal text-white" : "bg-sand text-forest"}`}>
            {proofReady ? <Database className="size-4" /> : <FileCheck2 className="size-4" />}
          </span>
          <div className="min-w-0">
            <h3 className="font-display text-base font-bold text-ink">{evidenceTypeLabels[evidence.evidenceType]}</h3>
            <p className="mt-1 truncate text-xs text-muted" title={evidence.originalName}>{evidence.originalName} / {formatBytes(evidence.fileSize)} / {formatDate(evidence.createdAt)}</p>
          </div>
        </div>
        {actions}
      </div>

      <div className={`mt-5 grid gap-3 ${compact ? "" : "md:grid-cols-2"}`}>
        <CopyableValue label="SHA-256" value={evidence.evidenceHash} />
        <BlockchainLink label="Walrus Blob ID" value={evidence.walrusBlobId} href={evidence.walrusBlobUrl} chain="walrus" />
        {!compact ? <CopyableValue label="Sui Object ID" value={evidence.suiObjectId} /> : null}
        {!compact ? <BlockchainLink label="Transaction digest" value={evidence.transactionDigest} href={evidence.transactionDigest ? suiTransactionUrl(evidence.transactionDigest) : null} chain="sui" network="testnet" /> : null}
      </div>
    </article>
  );
}
