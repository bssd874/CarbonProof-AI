"use client";

import { ArrowRight, Bot, FilePlus2, LoaderCircle, MapPin, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ActionButton } from "@/components/action-button";
import { EvidenceTrail } from "@/components/evidence-trail";
import { FallbackBanner } from "@/components/fallback-banner";
import { ProjectStatusPill } from "@/components/status-pill";
import { SiteHeader } from "@/components/site-header";
import { SkeletonRows, StatePanel } from "@/components/state-panel";
import { VerificationPanel } from "@/components/verification-panel";
import { api } from "@/lib/api";
import { demoProjectDetail } from "@/lib/demo-data";
import { formatDate, shorten } from "@/lib/format";
import type { ProjectDetail, VerificationReport } from "@/lib/types";

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const projectId = params.id;
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [fallback, setFallback] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState("");

  useEffect(() => {
    api
      .getProject(projectId)
      .then(setProject)
      .catch(() => {
        setProject(demoProjectDetail);
        setFallback(true);
      })
      .finally(() => setLoading(false));
  }, [projectId]);

  async function verify() {
    if (!project) return;
    setVerifying(true);
    setVerifyError("");
    try {
      const report = await api.verifyProject(project.id);
      setProject({ ...project, verificationReport: report });
    } catch (requestError) {
      setVerifyError(requestError instanceof Error ? requestError.message : "AI verification failed.");
    } finally {
      setVerifying(false);
    }
  }

  if (loading) {
    return <main className="min-h-screen bg-canvas"><SiteHeader /><div className="page-shell py-12"><SkeletonRows count={7} /></div></main>;
  }

  if (!project) {
    return <main className="min-h-screen bg-canvas"><SiteHeader /><div className="page-shell py-12"><StatePanel state="error" title="Project unavailable" description="The project could not be loaded from the API." /></div></main>;
  }

  return (
    <main className="min-h-screen bg-canvas">
      <SiteHeader />
      {fallback ? <FallbackBanner /> : null}
      <div className="page-shell py-10 lg:py-14">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-4xl">
            <p className="eyebrow">Carbon passport</p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <h1 className="display-title text-3xl sm:text-4xl">{project.name}</h1>
              <ProjectStatusPill status={project.status} />
            </div>
            <p className="mt-4 flex items-start gap-2 text-sm text-muted">
              <MapPin className="mt-0.5 size-4 shrink-0 text-teal" /> {project.location}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href={`/projects/${project.id}/upload`} className="inline-flex h-11 items-center gap-2 rounded-md border border-line bg-paper px-5 text-sm font-semibold text-forest">
              <FilePlus2 className="size-4" /> Add evidence
            </Link>
            <ActionButton onClick={verify} disabled={verifying || project.evidences.length === 0}>
              {verifying ? <LoaderCircle className="size-4 animate-spin" /> : <Bot className="size-4" />}
              {verifying ? "Running AI review..." : "Run AI verification"}
            </ActionButton>
          </div>
        </div>

        {verifyError ? (
          <div className="mt-6 border border-coral/30 bg-coral/10 px-4 py-3 text-sm text-coral" role="alert">
            AI verification could not complete: {verifyError}. Existing evidence and reports remain unchanged.
          </div>
        ) : null}

        <section className="mt-9 grid gap-px border-y border-line bg-line md:grid-cols-3">
          <ProjectFact label="Impact claim" value={project.claim} />
          <ProjectFact label="Evidence records" value={`${project.evidences.length} uploaded files`} />
          <ProjectFact label="Owner wallet" value={shorten(project.ownerWallet, 12, 8)} mono />
        </section>

        <div className="mt-9 grid gap-7 lg:grid-cols-[minmax(0,1fr)_480px]">
          <section className="panel p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line pb-6">
              <div>
                <h2 className="font-display text-2xl font-bold text-ink">Evidence and chain trail</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
                  Every row preserves the file fingerprint, Walrus storage reference, Sui object, and transaction proof.
                </p>
              </div>
              <span className="text-xs text-muted">Updated {formatDate(project.updatedAt)}</span>
            </div>

            <div className="mt-7">
              {project.evidences.length ? (
                <EvidenceTrail evidences={project.evidences} />
              ) : (
                <StatePanel
                  state="empty"
                  title="No evidence uploaded"
                  description="Start with an audit report, drone image, GPS JSON, or sensor CSV before running AI verification."
                  action={<Link href={`/projects/${project.id}/upload`} className="inline-flex h-10 items-center gap-2 rounded-md bg-forest px-4 text-xs font-semibold text-white">Upload evidence <ArrowRight className="size-3.5" /></Link>}
                />
              )}
            </div>
          </section>

          {verifying ? (
            <aside className="grid min-h-[560px] place-items-center rounded-lg bg-navy p-8 text-center text-white shadow-deep">
              <div>
                <LoaderCircle className="mx-auto size-10 animate-spin text-cyan" />
                <h2 className="mt-6 font-display text-2xl font-bold">Reviewing evidence package</h2>
                <p className="mt-3 text-sm leading-6 text-white/60">
                  CarbonProof is comparing file metadata, proof synchronization, extracted facts, and missing requirements.
                </p>
              </div>
            </aside>
          ) : project.verificationReport ? (
            <div>
              <VerificationPanel report={project.verificationReport} />
              <Link href={`/verify/${project.id}`} className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border border-forest bg-paper text-sm font-semibold text-forest">
                Open public proof certificate <ArrowRight className="size-4" />
              </Link>
            </div>
          ) : (
            <aside className="grid min-h-[560px] place-items-center rounded-lg bg-navy p-8 text-center text-white shadow-deep">
              <div>
                <ShieldCheck className="mx-auto size-10 text-cyan" />
                <h2 className="mt-6 font-display text-2xl font-bold">AI report not generated</h2>
                <p className="mt-3 text-sm leading-6 text-white/60">
                  Upload evidence first, then run verification to produce risk, confidence, missing evidence, and a recommendation.
                </p>
                <ActionButton onClick={verify} disabled={project.evidences.length === 0} variant="dark" className="mt-6">
                  Run AI verification
                </ActionButton>
              </div>
            </aside>
          )}
        </div>
      </div>
    </main>
  );
}

function ProjectFact({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="bg-paper px-5 py-6">
      <p className="text-[11px] font-semibold uppercase text-muted">{label}</p>
      <p className={`mt-2 break-words text-sm font-semibold text-ink ${mono ? "font-mono text-xs" : ""}`}>{value}</p>
    </div>
  );
}
