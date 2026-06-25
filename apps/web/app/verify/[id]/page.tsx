"use client";

import { CheckCircle2, FileCheck2, Landmark, ShieldCheck, TriangleAlert } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CopyableHash } from "@/components/copyable-hash";
import { EvidenceTrail } from "@/components/evidence-trail";
import { FallbackBanner } from "@/components/fallback-banner";
import { RiskPill } from "@/components/status-pill";
import { SkeletonRows, StatePanel } from "@/components/state-panel";
import { api } from "@/lib/api";
import { demoProjectDetail } from "@/lib/demo-data";
import { formatDate, suiTransactionUrl } from "@/lib/format";
import type { ProjectDetail } from "@/lib/types";

export default function PublicVerifyPage() {
  const params = useParams<{ id: string }>();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    api
      .getProject(params.id)
      .then(setProject)
      .catch(() => {
        setProject(demoProjectDetail);
        setFallback(true);
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return <main className="min-h-screen bg-canvas p-6 sm:p-12"><div className="mx-auto max-w-5xl"><SkeletonRows count={7} /></div></main>;
  }

  if (!project) {
    return <main className="min-h-screen bg-canvas p-6 sm:p-12"><div className="mx-auto max-w-4xl"><StatePanel state="error" title="Proof certificate unavailable" description="This project does not have a public verification record." /></div></main>;
  }

  const report = project.verificationReport;
  const primaryEvidence = project.evidences[0];
  const proofStages = [
    ["Evidence uploaded", project.evidences.length > 0, `${project.evidences.length} files in the project trail`],
    ["Stored on Walrus", project.evidences.some((item) => item.walrusBlobId), "Content-addressed storage references available"],
    ["Registered on Sui", project.evidences.some((item) => item.suiObjectId), "Evidence metadata anchored on testnet"],
    ["AI verification", Boolean(report), report ? `${report.riskScore} risk / ${report.confidenceScore}% confidence` : "Report pending"],
  ] as const;

  return (
    <main className="min-h-screen bg-canvas pb-20">
      <header className="bg-forest pb-36 pt-8 text-white">
        <div className="page-shell">
          <p className="font-display text-lg font-bold">CarbonProof AI Public Verify</p>
          <div className="mt-16">
            <p className="eyebrow text-cyan">Public proof certificate</p>
            <h1 className="mt-4 font-display text-4xl font-bold sm:text-5xl">Auditable impact evidence</h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-white/70">
              Readable verification trail for project owners, auditors, buyers, and hackathon judges.
            </p>
          </div>
        </div>
      </header>
      {fallback ? <FallbackBanner /> : null}

      <section className="page-shell -mt-24">
        <article className="border border-line bg-paper p-6 shadow-deep sm:p-10 lg:p-12" style={{ borderRadius: 8 }}>
          <div className="flex flex-wrap items-start justify-between gap-7 border-b border-line pb-8">
            <div className="max-w-3xl">
              <p className="eyebrow">CarbonProof certificate view</p>
              <h2 className="mt-5 font-display text-3xl font-bold leading-tight text-forest sm:text-4xl">{project.name}</h2>
              <p className="mt-4 text-sm text-muted">{project.location} / Updated {formatDate(project.updatedAt)}</p>
            </div>
            <div className="flex items-center gap-3">
              {report ? <RiskPill risk={report.riskScore} /> : null}
              <div className={`grid size-16 place-items-center rounded-full border-2 ${report ? "border-leaf text-moss" : "border-amber text-amber"}`}>
                {report ? <ShieldCheck className="size-7" /> : <TriangleAlert className="size-7" />}
              </div>
            </div>
          </div>

          <div className="grid gap-7 border-b border-line py-8 lg:grid-cols-[1fr_260px]">
            <div>
              <p className="text-[11px] font-semibold uppercase text-muted">Project claim</p>
              <p className="mt-3 font-display text-2xl font-bold text-ink">{project.claim}</p>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-muted">{project.description}</p>
            </div>
            <div className="border-l-4 border-teal bg-canvas p-5">
              <p className="text-xs font-semibold text-muted">AI confidence</p>
              <p className="mt-2 font-display text-4xl font-bold text-forest">{report?.confidenceScore ?? "--"}</p>
              <p className="mt-1 text-xs text-muted">percent evidence match</p>
            </div>
          </div>

          <div className="grid gap-3 py-8 md:grid-cols-2 xl:grid-cols-4">
            <CopyableHash label="Evidence SHA-256" value={primaryEvidence?.evidenceHash} />
            <CopyableHash label="Walrus Blob ID" value={primaryEvidence?.walrusBlobId} href={primaryEvidence?.walrusBlobUrl || undefined} />
            <CopyableHash label="Sui Object ID" value={primaryEvidence?.suiObjectId} />
            <CopyableHash
              label="Transaction digest"
              value={primaryEvidence?.transactionDigest}
              href={primaryEvidence?.transactionDigest ? suiTransactionUrl(primaryEvidence.transactionDigest) : undefined}
            />
          </div>

          <div className="border-y border-line py-8">
            <h3 className="font-display text-xl font-bold text-ink">Proof timeline</h3>
            <div className="mt-7 grid gap-6 md:grid-cols-4">
              {proofStages.map(([title, complete, detail], index) => (
                <div key={title} className="relative border-t border-line pt-6 md:border-l md:border-t-0 md:pl-6 md:pt-0">
                  <span className={`absolute -top-3 left-0 grid size-7 place-items-center rounded-full text-xs font-bold text-white md:-left-3 md:top-0 ${complete ? "bg-teal" : "bg-sand"}`}>
                    {complete ? <CheckCircle2 className="size-4" /> : index + 1}
                  </span>
                  <p className="text-sm font-semibold text-ink">{title}</p>
                  <p className="mt-2 text-xs leading-5 text-muted">{detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="py-8">
            <div className="flex items-center gap-2">
              <FileCheck2 className="size-5 text-teal" />
              <h3 className="font-display text-xl font-bold text-ink">Evidence register</h3>
            </div>
            <div className="mt-6">
              {project.evidences.length ? <EvidenceTrail evidences={project.evidences} compact /> : <StatePanel state="empty" title="No public evidence" description="Evidence records have not been attached to this project." />}
            </div>
          </div>

          <div className="flex items-start gap-3 border border-amber/45 bg-amber/10 p-4 text-xs leading-5 text-[#75540e]" style={{ borderRadius: 7 }}>
            <Landmark className="mt-0.5 size-4 shrink-0" />
            <p>
              AI verification is not a legal carbon certification. CarbonProof summarizes evidence consistency, storage references, and on-chain metadata for review.
            </p>
          </div>
        </article>
      </section>
    </main>
  );
}
