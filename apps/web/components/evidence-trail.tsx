import { Database, FileCheck2, Link2, ShieldCheck } from "lucide-react";
import { CopyableHash } from "@/components/copyable-hash";
import { evidenceTypeLabels, formatBytes, formatDate, suiTransactionUrl } from "@/lib/format";
import type { Evidence } from "@/lib/types";

export function EvidenceTrail({ evidences, compact = false }: { evidences: Evidence[]; compact?: boolean }) {
  return (
    <div className="relative">
      <div className="absolute bottom-8 left-[19px] top-8 hidden w-px bg-line sm:block" />
      <div className="space-y-4">
        {evidences.map((evidence, index) => (
          <article key={evidence.id} className="relative grid gap-4 sm:grid-cols-[40px_minmax(0,1fr)]">
            <div className="relative z-10 hidden size-10 place-items-center rounded-full bg-teal text-white sm:grid">
              {evidence.walrusBlobId && evidence.suiObjectId ? <ShieldCheck className="size-4" /> : <FileCheck2 className="size-4" />}
            </div>
            <div className={`border-b border-line pb-5 ${index === evidences.length - 1 ? "border-b-0" : ""}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-ink">{evidenceTypeLabels[evidence.evidenceType]}</p>
                  <p className="mt-1 text-xs text-muted">
                    {evidence.originalName} · {formatBytes(evidence.fileSize)} · {formatDate(evidence.createdAt)}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-leaf/15 px-3 py-1 text-[11px] font-semibold text-moss">
                  <Database className="size-3" /> {evidence.walrusBlobId ? "Walrus stored" : "Proof pending"}
                </span>
              </div>

              <div className={`mt-4 grid gap-2 ${compact ? "lg:grid-cols-2" : "xl:grid-cols-2"}`}>
                <CopyableHash label="SHA-256" value={evidence.evidenceHash} />
                <CopyableHash label="Walrus Blob ID" value={evidence.walrusBlobId} href={evidence.walrusBlobUrl || undefined} />
                {!compact ? <CopyableHash label="Sui Object ID" value={evidence.suiObjectId} /> : null}
                {!compact ? (
                  <CopyableHash
                    label="Sui transaction digest"
                    value={evidence.transactionDigest}
                    href={evidence.transactionDigest ? suiTransactionUrl(evidence.transactionDigest) : undefined}
                  />
                ) : null}
              </div>
              {evidence.walrusBlobUrl ? (
                <a href={evidence.walrusBlobUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-teal">
                  <Link2 className="size-3.5" /> Open Walrus blob
                </a>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
