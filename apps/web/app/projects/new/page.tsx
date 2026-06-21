"use client";

import { ArrowRight, CheckCircle2, FileCheck2, MapPin, WalletCards } from "lucide-react";
import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { ActionButton } from "@/components/action-button";
import { SiteHeader } from "@/components/site-header";
import { api } from "@/lib/api";
import type { CarbonProject, CreateProjectInput } from "@/lib/types";

const checklist = [
  "Audit report PDF",
  "Drone image",
  "GPS metadata JSON",
  "Sensor readings CSV",
  "Survival-rate report",
  "Auditor attestation",
];

const initial: CreateProjectInput = {
  name: "",
  location: "",
  claim: "",
  description: "",
  ownerWallet: "",
};

export default function CreateProjectPage() {
  const [form, setForm] = useState(initial);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState<CarbonProject | null>(null);

  const preview = useMemo(
    () => ({
      name: form.name || "Untitled carbon project",
      location: form.location || "Location will appear here",
      claim: form.claim || "Define a measurable environmental claim",
    }),
    [form],
  );

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const project = await api.createProject({
        ...form,
        ownerWallet: form.ownerWallet || undefined,
      });
      setCreated(project);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Project could not be created.");
    } finally {
      setSubmitting(false);
    }
  }

  if (created) {
    return (
      <main className="min-h-screen bg-canvas">
        <SiteHeader />
        <div className="page-shell grid min-h-[calc(100vh-72px)] place-items-center py-12">
          <section className="panel max-w-xl p-8 text-center">
            <CheckCircle2 className="mx-auto size-11 text-leaf" />
            <p className="eyebrow mt-5">Project created</p>
            <h1 className="display-title mt-3 text-3xl">{created.name}</h1>
            <p className="mt-4 text-sm leading-6 text-muted">
              The carbon passport is ready. Continue with audit, drone, sensor, GPS, survival, or attestation evidence.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link href={`/projects/${created.id}/upload`} className="inline-flex h-11 items-center gap-2 rounded-md bg-forest px-5 text-sm font-semibold text-white">
                Upload evidence <ArrowRight className="size-4" />
              </Link>
              <Link href={`/projects/${created.id}`} className="inline-flex h-11 items-center rounded-md border border-line bg-paper px-5 text-sm font-semibold text-forest">
                View project
              </Link>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-canvas">
      <SiteHeader />
      <div className="page-shell py-10 lg:py-14">
        <p className="eyebrow">Carbon passport setup</p>
        <h1 className="display-title mt-3 text-3xl sm:text-4xl">Create carbon project</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
          Capture the claim and expected evidence before the proof generation workflow starts.
        </p>

        {error ? (
          <div className="mt-7 border border-coral/30 bg-coral/10 px-4 py-3 text-sm text-coral" role="alert">
            {error}
          </div>
        ) : null}

        <div className="mt-9 grid gap-8 lg:grid-cols-[minmax(0,1fr)_430px]">
          <form onSubmit={submit} className="panel p-6 sm:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Project name" className="sm:col-span-2">
                <input required minLength={3} className="field-input" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Mangrove Restoration - Bekasi Coastal Area" />
              </Field>
              <Field label="Location">
                <input required minLength={3} className="field-input" value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} placeholder="Bekasi Coastal Area, Indonesia" />
              </Field>
              <Field label="Impact claim">
                <input required minLength={5} className="field-input" value={form.claim} onChange={(event) => setForm({ ...form, claim: event.target.value })} placeholder="10,000 mangrove trees planted" />
              </Field>
              <Field label="Owner wallet" className="sm:col-span-2">
                <div className="relative">
                  <WalletCards className="absolute left-4 top-4 size-4 text-muted" />
                  <input className="field-input pl-11 font-mono text-xs" value={form.ownerWallet} onChange={(event) => setForm({ ...form, ownerWallet: event.target.value })} placeholder="0x..." />
                </div>
              </Field>
              <Field label="Description" className="sm:col-span-2">
                <textarea required minLength={10} rows={5} className="field-input resize-y py-3" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Describe project scope, monitoring methodology, project owner, and expected impact evidence." />
              </Field>
            </div>

            <div className="mt-8 border-t border-line pt-6">
              <p className="text-xs font-semibold text-muted">Expected evidence checklist</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {checklist.map((item, index) => (
                  <div key={item} className="flex min-h-10 items-center gap-2 border border-line bg-canvas px-3 text-xs font-medium text-ink" style={{ borderRadius: 7 }}>
                    <span className={`size-2 rounded-full ${index < 4 ? "bg-leaf" : "bg-sand"}`} /> {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <ActionButton type="submit" disabled={submitting}>
                {submitting ? "Creating passport..." : "Create project"} <ArrowRight className="size-4" />
              </ActionButton>
              <ActionButton type="button" variant="secondary" onClick={() => setForm(initial)}>
                Clear form
              </ActionButton>
            </div>
          </form>

          <aside className="rounded-lg border border-white/10 bg-navy p-7 text-white shadow-deep lg:sticky lg:top-24 lg:self-start">
            <p className="eyebrow text-cyan">Live project preview</p>
            <h2 className="mt-6 break-words font-display text-3xl font-bold">{preview.name}</h2>
            <p className="mt-4 flex items-start gap-2 text-sm text-white/60">
              <MapPin className="mt-0.5 size-4 shrink-0 text-cyan" /> {preview.location}
            </p>
            <div className="mt-8 border-y border-white/10 py-6">
              <p className="text-xs font-semibold uppercase text-white/45">Claim</p>
              <p className="mt-3 text-lg font-semibold leading-7 text-white">{preview.claim}</p>
            </div>
            <div className="mt-7 grid grid-cols-2 gap-3">
              <div className="border-l-4 border-leaf bg-paper p-4 text-ink">
                <p className="font-display text-3xl font-bold">6</p>
                <p className="mt-1 text-xs text-muted">required evidence types</p>
              </div>
              <div className="border-l-4 border-teal bg-paper p-4 text-ink">
                <p className="font-display text-3xl font-bold">0</p>
                <p className="mt-1 text-xs text-muted">proof records synced</p>
              </div>
            </div>
            <div className="mt-7 flex items-start gap-3 border border-white/10 bg-white/[0.05] p-4">
              <FileCheck2 className="mt-0.5 size-5 shrink-0 text-cyan" />
              <p className="text-xs leading-5 text-white/60">
                Walrus Blob IDs, SHA-256 fingerprints, Sui objects, and transaction digests will appear after evidence upload.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={className}>
      <span className="field-label">{label}</span>
      {children}
    </label>
  );
}
