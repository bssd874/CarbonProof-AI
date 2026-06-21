"use client";

import {
  ArrowRight,
  CheckCircle2,
  FileArchive,
  FileImage,
  FileJson,
  FileSpreadsheet,
  FileText,
  LoaderCircle,
  ShieldCheck,
  UploadCloud,
} from "lucide-react";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { ActionButton } from "@/components/action-button";
import { CopyableHash } from "@/components/copyable-hash";
import { FallbackBanner } from "@/components/fallback-banner";
import { SiteHeader } from "@/components/site-header";
import { SkeletonRows } from "@/components/state-panel";
import { UploadDropzone } from "@/components/upload-dropzone";
import { api } from "@/lib/api";
import { demoProjectDetail } from "@/lib/demo-data";
import { evidenceTypeLabels, suiTransactionUrl } from "@/lib/format";
import type { Evidence, EvidenceType, ProjectDetail } from "@/lib/types";
import { useParams } from "next/navigation";

const evidenceIcons: Record<EvidenceType, typeof FileText> = {
  audit_report_pdf: FileText,
  drone_image: FileImage,
  sensor_csv: FileSpreadsheet,
  gps_metadata_json: FileJson,
  survival_rate_report: FileArchive,
  auditor_signature: ShieldCheck,
};

const evidenceTypes = Object.keys(evidenceTypeLabels) as EvidenceType[];

export default function UploadEvidencePage() {
  const params = useParams<{ id: string }>();
  const projectId = params.id;
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [projectLoading, setProjectLoading] = useState(true);
  const [fallback, setFallback] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [evidenceType, setEvidenceType] = useState<EvidenceType>("audit_report_pdf");
  const [uploadedBy, setUploadedBy] = useState("");
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<Evidence | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .getProject(projectId)
      .then((data) => {
        setProject(data);
        setUploadedBy(data.ownerWallet || "");
      })
      .catch(() => {
        setProject(demoProjectDetail);
        setUploadedBy(demoProjectDetail.ownerWallet || "");
        setFallback(true);
      })
      .finally(() => setProjectLoading(false));
  }, [projectId]);

  const activeStep = result ? 4 : uploading ? 3 : file ? 2 : 1;
  function selectFile(selected: File | null) {
    setFile(selected);
    setResult(null);
    setError("");
  }

  async function upload(event: FormEvent) {
    event.preventDefault();
    if (!file) {
      setError("Choose an evidence file before starting proof generation.");
      return;
    }
    setUploading(true);
    setError("");
    setResult(null);
    try {
      const evidence = await api.uploadEvidence(projectId, {
        file,
        evidenceType,
        uploadedBy: uploadedBy || undefined,
      });
      setResult(evidence);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Evidence upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <main className="min-h-screen bg-canvas">
      <SiteHeader />
      {fallback ? <FallbackBanner /> : null}
      <div className="page-shell py-10 lg:py-14">
        <p className="eyebrow">Walrus evidence workflow</p>
        <h1 className="display-title mt-3 text-3xl sm:text-4xl">Upload evidence package</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
          Turn field files into content-addressed evidence and attach the generated proof metadata to the project passport.
        </p>

        {projectLoading ? (
          <div className="mt-9"><SkeletonRows count={4} /></div>
        ) : (
          <>
            <ol className="mt-9 grid border border-line bg-paper shadow-panel sm:grid-cols-4" style={{ borderRadius: 8 }}>
              {["Select project", "Upload file", "Evidence metadata", "Proof generated"].map((label, index) => {
                const step = index + 1;
                const done = activeStep > step;
                const current = activeStep === step;
                return (
                  <li key={label} className="relative flex items-center gap-3 border-b border-line px-5 py-5 last:border-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
                    <span className={`grid size-8 shrink-0 place-items-center rounded-full text-xs font-bold ${done || current ? "bg-teal text-white" : "bg-sand text-white"}`}>
                      {done ? <CheckCircle2 className="size-4" /> : step}
                    </span>
                    <span className={`text-xs font-semibold ${current ? "text-forest" : "text-muted"}`}>{label}</span>
                  </li>
                );
              })}
            </ol>

            {error ? (
              <div className="mt-6 flex items-start gap-3 border border-coral/30 bg-coral/10 px-4 py-3 text-sm text-coral" role="alert">
                <FileArchive className="mt-0.5 size-4 shrink-0" /> {error}
              </div>
            ) : null}

            <form onSubmit={upload} className="mt-7 grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px_360px]">
              <section className="panel p-5 sm:p-7">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-muted">Selected project</p>
                    <p className="mt-1 text-sm font-semibold text-ink">{project?.name}</p>
                  </div>
                  <Link href="/dashboard" className="text-xs font-semibold text-teal">Change project</Link>
                </div>

                <UploadDropzone
                  file={file}
                  onFileSelect={selectFile}
                  accept=".pdf,.jpg,.jpeg,.png,.csv,.json,.txt"
                  description="PDF, JPG, PNG, CSV, JSON up to 5 MB"
                  disabled={uploading}
                />

                <label className="mt-6 block">
                  <span className="field-label">Uploaded by</span>
                  <input className="field-input font-mono text-xs" value={uploadedBy} onChange={(event) => setUploadedBy(event.target.value)} placeholder="Wallet address or auditor identifier" />
                </label>
              </section>

              <section className="panel p-5">
                <h2 className="font-display text-lg font-bold text-ink">Evidence type</h2>
                <div className="mt-5 space-y-2">
                  {evidenceTypes.map((type) => {
                    const Icon = evidenceIcons[type];
                    const selected = type === evidenceType;
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setEvidenceType(type)}
                        className={`flex min-h-11 w-full items-center gap-3 border px-3 text-left text-xs font-semibold transition ${selected ? "border-teal bg-teal/10 text-teal" : "border-line bg-canvas text-ink hover:border-teal/50"}`}
                        style={{ borderRadius: 7 }}
                      >
                        <Icon className="size-4 shrink-0" /> {evidenceTypeLabels[type]}
                      </button>
                    );
                  })}
                </div>
                <ActionButton type="submit" disabled={uploading || !file} className="mt-6 w-full">
                  {uploading ? <LoaderCircle className="size-4 animate-spin" /> : <UploadCloud className="size-4" />}
                  {uploading ? "Hashing and uploading..." : "Generate evidence proof"}
                </ActionButton>
              </section>

              <aside className="rounded-lg border border-white/10 bg-navy p-6 text-white shadow-deep">
                <p className="eyebrow text-cyan">Proof result</p>
                {uploading ? (
                  <div className="mt-8">
                    <LoaderCircle className="size-9 animate-spin text-cyan" />
                    <h2 className="mt-5 font-display text-2xl font-bold">Processing evidence</h2>
                    <p className="mt-3 text-sm leading-6 text-white/60">
                      The backend is hashing the file and preparing the evidence record. Walrus and Sui references appear when synced.
                    </p>
                  </div>
                ) : result ? (
                  <div className="mt-6">
                    <CheckCircle2 className="size-9 text-leaf" />
                    <h2 className="mt-4 font-display text-2xl font-bold">Evidence record created</h2>
                    <div className="mt-6 space-y-3">
                      <CopyableHash tone="dark" label="SHA-256" value={result.evidenceHash} />
                      <CopyableHash tone="dark" label="Walrus Blob ID" value={result.walrusBlobId} href={result.walrusBlobUrl || undefined} />
                      <CopyableHash tone="dark" label="Sui Object ID" value={result.suiObjectId} />
                      <CopyableHash tone="dark" label="Transaction digest" value={result.transactionDigest} href={result.transactionDigest ? suiTransactionUrl(result.transactionDigest) : undefined} />
                    </div>
                    {!result.walrusBlobId || !result.suiObjectId ? (
                      <p className="mt-5 border-l-2 border-amber pl-3 text-xs leading-5 text-white/55">
                        File hashing succeeded. Walrus or Sui proof metadata is still pending synchronization.
                      </p>
                    ) : null}
                    <Link href={`/projects/${projectId}`} className="mt-6 inline-flex h-10 items-center gap-2 rounded-md border border-teal px-4 text-xs font-semibold text-cyan">
                      Open project detail <ArrowRight className="size-3.5" />
                    </Link>
                  </div>
                ) : (
                  <div className="mt-8">
                    <ShieldCheck className="size-9 text-cyan" />
                    <h2 className="mt-5 font-display text-2xl font-bold">Proof metadata will appear here</h2>
                    <p className="mt-3 text-sm leading-6 text-white/60">
                      SHA-256 is created during upload. Walrus Blob ID, Sui Object ID, and transaction digest remain visibly separate for auditing.
                    </p>
                  </div>
                )}
              </aside>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
