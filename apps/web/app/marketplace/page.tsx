"use client";

import { CheckCircle2, ExternalLink, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { ActionButton } from "@/components/action-button";
import { FallbackBanner } from "@/components/fallback-banner";
import { MarketplaceOrderBook } from "@/components/marketplace-order-book";
import { SiteHeader } from "@/components/site-header";
import { ProjectStatusPill, RiskPill } from "@/components/status-pill";
import { SkeletonRows } from "@/components/state-panel";
import { api } from "@/lib/api";
import { demoProjectDetail, demoProjects } from "@/lib/demo-data";
import type { ProjectDetail } from "@/lib/types";

const asks = [
  { price: 0.47, quantity: 1200 },
  { price: 0.46, quantity: 1060 },
  { price: 0.45, quantity: 920 },
  { price: 0.44, quantity: 780 },
  { price: 0.43, quantity: 640 },
];
const bids = [
  { price: 0.41, quantity: 980 },
  { price: 0.4, quantity: 1190 },
  { price: 0.39, quantity: 1400 },
  { price: 0.38, quantity: 1610 },
  { price: 0.37, quantity: 1820 },
];

export default function MarketplacePage() {
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [fallback, setFallback] = useState(false);
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState(250);
  const [price, setPrice] = useState(0.42);
  const [placed, setPlaced] = useState(false);

  useEffect(() => {
    api
      .getProjects()
      .then(async (projects) => {
        const selected = projects.find((item) => ["ai_reviewed", "verified", "credit_issued"].includes(item.status)) || projects[0];
        if (!selected) {
          setProject(null);
          return;
        }
        setProject(await api.getProject(selected.id));
      })
      .catch(() => {
        setProject(demoProjectDetail);
        setFallback(true);
      })
      .finally(() => setLoading(false));
  }, []);

  const total = useMemo(() => Math.max(0, amount * price), [amount, price]);

  function placeOrder(event: FormEvent) {
    event.preventDefault();
    setPlaced(true);
  }

  const selected = project || { ...demoProjects[0], evidences: [], verificationReport: null };

  return (
    <main className="min-h-screen bg-canvas">
      <SiteHeader />
      {fallback ? <FallbackBanner /> : null}
      <div className="page-shell py-10 lg:py-14">
        <p className="eyebrow">DeepBook-ready simulation</p>
        <h1 className="display-title mt-3 text-3xl sm:text-4xl">Impact credit marketplace</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
          Simulated liquidity layer that keeps the verified project proof trail attached to every order.
        </p>

        {loading ? (
          <div className="mt-9"><SkeletonRows count={6} /></div>
        ) : (
          <div className="mt-9 grid gap-6 xl:grid-cols-[350px_minmax(0,1fr)_350px]">
            <section className="rounded-lg border border-white/10 bg-navy p-6 text-white shadow-deep">
              <p className="eyebrow text-cyan">Verified impact credit</p>
              <h2 className="mt-6 break-words font-display text-2xl font-bold uppercase">MANGROVE-BEKASI-2026</h2>
              <p className="mt-4 text-sm leading-6 text-white/65">Backed by {selected.name}.</p>

              <div className="mt-7 grid grid-cols-2 gap-3">
                <div className="border-l-4 border-leaf bg-paper p-4 text-ink">
                  <p className="text-xs font-semibold text-muted">Supply</p>
                  <p className="mt-2 font-display text-3xl font-bold">10,000</p>
                  <p className="mt-1 text-xs text-muted">impact units</p>
                </div>
                <div className="border-l-4 border-amber bg-paper p-4 text-ink">
                  <p className="text-xs font-semibold text-muted">Risk</p>
                  <p className="mt-2 font-display text-2xl font-bold">{selected.verificationReport?.riskScore || "Pending"}</p>
                  <p className="mt-1 text-xs text-muted">AI reviewed</p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <span className="rounded-full bg-cyan/15 px-3 py-1 text-xs font-semibold text-cyan">DeepBook-ready</span>
                <ProjectStatusPill status={selected.status} />
                {selected.verificationReport ? <RiskPill risk={selected.verificationReport.riskScore} /> : null}
              </div>

              <Link href={`/verify/${selected.id}`} className="mt-7 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border border-teal text-sm font-semibold text-cyan">
                Open linked proof trail <ExternalLink className="size-4" />
              </Link>
            </section>

            <MarketplaceOrderBook bids={bids} asks={asks} midPrice={0.42} symbol="MANGROVE-BEKASI" />

            <form onSubmit={placeOrder} className="panel p-6">
              <h2 className="font-display text-xl font-bold text-ink">Buy / sell simulation</h2>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <button type="button" onClick={() => setSide("buy")} className={`h-10 rounded-md border text-sm font-semibold ${side === "buy" ? "border-forest bg-forest text-white" : "border-line text-forest"}`}>Buy</button>
                <button type="button" onClick={() => setSide("sell")} className={`h-10 rounded-md border text-sm font-semibold ${side === "sell" ? "border-coral bg-coral text-white" : "border-line text-forest"}`}>Sell</button>
              </div>
              <label className="mt-6 block">
                <span className="field-label">Amount</span>
                <input type="number" min={1} className="field-input" value={amount} onChange={(event) => { setAmount(Number(event.target.value)); setPlaced(false); }} />
              </label>
              <label className="mt-5 block">
                <span className="field-label">Limit price (SUI)</span>
                <input type="number" min={0.01} step={0.01} className="field-input" value={price} onChange={(event) => { setPrice(Number(event.target.value)); setPlaced(false); }} />
              </label>

              <div className="mt-7 border border-line bg-canvas p-5" style={{ borderRadius: 8 }}>
                <p className="text-xs font-semibold text-muted">Estimated total</p>
                <p className="mt-2 font-display text-3xl font-bold text-forest">{total.toFixed(2)} SUI</p>
                <p className="mt-3 text-xs leading-5 text-muted">Order references the project public proof and AI report status.</p>
              </div>

              {placed ? (
                <div className="mt-5 flex items-start gap-2 bg-leaf/15 p-3 text-xs leading-5 text-moss">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0" /> Simulated {side} order placed. No on-chain transaction was submitted.
                </div>
              ) : null}

              <ActionButton type="submit" className="mt-6 w-full">
                <ShoppingCart className="size-4" /> Place simulated {side} order
              </ActionButton>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}
