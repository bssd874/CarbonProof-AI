"use client";

import {
  Activity,
  ArrowRight,
  Bot,
  FileCheck2,
  FolderKanban,
  Plus,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FallbackBanner } from "@/components/fallback-banner";
import { MetricCard } from "@/components/metric-card";
import { ProjectStatusPill } from "@/components/status-pill";
import { SiteHeader } from "@/components/site-header";
import { SkeletonRows, StatePanel } from "@/components/state-panel";
import { api } from "@/lib/api";
import { demoProjects } from "@/lib/demo-data";
import { formatDate } from "@/lib/format";
import type { CarbonProject } from "@/lib/types";

export default function DashboardPage() {
  const [projects, setProjects] = useState<CarbonProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    api
      .getProjects()
      .then(setProjects)
      .catch(() => {
        setProjects(demoProjects);
        setFallback(true);
      })
      .finally(() => setLoading(false));
  }, []);

  const metrics = useMemo(() => {
    const reviewed = projects.filter((item) => ["ai_reviewed", "verified", "credit_issued"].includes(item.status)).length;
    const issued = projects.filter((item) => item.status === "credit_issued").length;
    return [
      ["Projects", projects.length, "Active carbon claims", FolderKanban],
      ["Evidence files", projects.length * 6, "Across project proof trails", FileCheck2],
      ["AI reports", reviewed, "Reviewed evidence packages", Bot],
      ["Credits issued", issued, "Marketplace-ready assets", ShieldCheck],
    ] as const;
  }, [projects]);

  return (
    <main className="min-h-screen bg-canvas">
      <SiteHeader />
      {fallback ? <FallbackBanner /> : null}
      <div className="page-shell py-10 lg:py-14">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Verification command center</p>
            <h1 className="display-title mt-3 text-3xl sm:text-4xl">Carbon project overview</h1>
            <p className="mt-3 text-sm leading-6 text-muted">
              Track evidence readiness, AI review status, and public proof availability.
            </p>
          </div>
          <Link href="/projects/new" className="inline-flex h-11 items-center gap-2 rounded-md bg-forest px-5 text-sm font-semibold text-white">
            <Plus className="size-4" /> Create project
          </Link>
        </div>

        {loading ? (
          <div className="mt-10"><SkeletonRows count={6} /></div>
        ) : projects.length === 0 ? (
          <div className="mt-10">
            <StatePanel
              state="empty"
              title="No carbon projects yet"
              description="Create the first project passport before adding Walrus evidence and running AI verification."
              action={<Link className="inline-flex h-11 items-center rounded-md bg-forest px-5 text-sm font-semibold text-white" href="/projects/new">Create project</Link>}
            />
          </div>
        ) : (
          <>
            <section className="mt-10 grid border-y border-line sm:grid-cols-2 xl:grid-cols-4">
              {metrics.map(([label, value, detail, Icon], index) => (
                <MetricCard
                  key={label}
                  label={label}
                  value={value}
                  description={detail}
                  icon={Icon}
                  accent={index === 3 ? "amber" : index === 2 ? "green" : "teal"}
                  className="border-b border-r border-l-4 border-line shadow-none xl:border-b-0"
                />
              ))}
            </section>

            <div className="mt-10 grid gap-6 xl:grid-cols-[minmax(0,1fr)_330px]">
              <section className="panel overflow-hidden">
                <div className="flex items-center justify-between border-b border-line px-6 py-5">
                  <h2 className="font-display text-xl font-bold text-ink">Carbon projects</h2>
                  <span className="text-xs text-muted">{projects.length} total</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] border-collapse text-left">
                    <thead className="text-[11px] uppercase text-muted">
                      <tr>
                        <th className="px-6 py-4 font-semibold">Project</th>
                        <th className="px-4 py-4 font-semibold">Location</th>
                        <th className="px-4 py-4 font-semibold">Status</th>
                        <th className="px-4 py-4 font-semibold">Updated</th>
                        <th className="px-6 py-4 text-right font-semibold">Proof</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.map((project) => (
                        <tr key={project.id} className="border-t border-line text-sm transition hover:bg-canvas/70">
                          <td className="px-6 py-5">
                            <p className="max-w-xs font-semibold text-ink">{project.name}</p>
                            <p className="mt-1 max-w-sm truncate text-xs text-muted">{project.claim}</p>
                          </td>
                          <td className="px-4 py-5 text-xs text-muted">{project.location}</td>
                          <td className="px-4 py-5"><ProjectStatusPill status={project.status} /></td>
                          <td className="px-4 py-5 text-xs text-muted">{formatDate(project.updatedAt)}</td>
                          <td className="px-6 py-5 text-right">
                            <Link href={`/projects/${project.id}`} className="inline-flex items-center gap-1 text-xs font-semibold text-forest">
                              Inspect <ArrowRight className="size-3.5" />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <aside className="rounded-lg border border-white/10 bg-navy p-6 text-white shadow-deep">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-xl font-bold">Recent activity</h2>
                  <Activity className="size-5 text-cyan" />
                </div>
                <div className="relative mt-7 space-y-7">
                  <div className="absolute bottom-4 left-[15px] top-4 w-px bg-teal/35" />
                  {projects.slice(0, 4).map((project, index) => (
                    <div key={project.id} className="relative grid grid-cols-[32px_1fr] gap-3">
                      <div className={`relative z-10 grid size-8 place-items-center rounded-full ${index === 2 ? "bg-amber" : "bg-teal"}`}>
                        {index === 0 ? <Sparkles className="size-3.5" /> : <ShieldCheck className="size-3.5" />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {project.status === "ai_reviewed" ? "AI review completed" : "Project passport updated"}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-white/55">{project.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </aside>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
