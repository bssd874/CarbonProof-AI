import {
  ArrowRight,
  Bot,
  Database,
  FileUp,
  Landmark,
  ShieldCheck,
  Store,
} from "lucide-react";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

const proofFlow = [
  { label: "Upload evidence", detail: "PDF, image, CSV, JSON", icon: FileUp },
  { label: "Store on Walrus", detail: "Blob ID + SHA-256", icon: Database },
  { label: "Register on Sui", detail: "Object metadata", icon: Landmark },
  { label: "AI risk report", detail: "Risk + confidence", icon: Bot },
  { label: "Public verify", detail: "Auditable proof trail", icon: ShieldCheck },
];

export default function LandingPage() {
  return (
    <main>
      <section className="overflow-hidden bg-navy text-white">
        <SiteHeader dark />
        <div className="page-shell grid min-h-[610px] items-center gap-14 py-20 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="eyebrow text-cyan">Walrus storage · Sui registry · AI risk review</p>
            <h1 className="mt-7 max-w-3xl font-display text-5xl font-bold leading-[1.04] tracking-normal sm:text-6xl lg:text-[68px]">
              Verifiable evidence for carbon and impact credits
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
              Upload environmental evidence, preserve it on Walrus, anchor metadata on Sui, and publish an AI-reviewed proof trail that buyers and auditors can inspect.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/projects/new" className="inline-flex h-12 items-center gap-2 rounded-md bg-forest px-6 text-sm font-semibold text-white transition hover:bg-[#214f3f]">
                Start verifying <ArrowRight className="size-4" />
              </Link>
              <Link href="/verify/demo-mangrove-restoration-bekasi" className="inline-flex h-12 items-center rounded-md border border-teal px-6 text-sm font-semibold text-cyan transition hover:bg-teal/10">
                View demo proof
              </Link>
            </div>
            <p className="mt-10 text-sm text-white/50">
              Demo: Mangrove Restoration - Bekasi Coastal Area
            </p>
          </div>

          <div className="relative border border-teal/30 bg-[#0e2a34] p-7 shadow-deep sm:p-9" style={{ borderRadius: 8 }}>
            <div className="absolute -left-16 top-6 hidden h-px w-20 bg-cyan/20 lg:block" />
            <p className="font-mono text-[11px] font-semibold uppercase text-cyan">Proof pipeline</p>
            <div className="mt-7 space-y-0">
              {proofFlow.map(({ label, detail, icon: Icon }, index) => (
                <div key={label} className="relative grid grid-cols-[42px_1fr] gap-4 pb-7 last:pb-0">
                  {index < proofFlow.length - 1 ? <div className="absolute left-5 top-10 h-[calc(100%-26px)] w-px bg-teal/50" /> : null}
                  <div className={`relative z-10 grid size-10 place-items-center rounded-full ${index === proofFlow.length - 1 ? "bg-leaf text-navy" : "bg-teal text-white"}`}>
                    <Icon className="size-4" />
                  </div>
                  <div>
                    <p className="font-semibold">{label}</p>
                    <p className="mt-1 text-xs text-white/50">{detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell py-20 sm:py-24">
        <div className="max-w-3xl">
          <p className="eyebrow">Proof-first climate infrastructure</p>
          <h2 className="display-title mt-4 text-3xl sm:text-4xl">
            One claim, five inspectable layers
          </h2>
          <p className="mt-4 text-base leading-7 text-muted">
            CarbonProof keeps storage, chain metadata, AI reasoning, and market readiness visible as one continuous evidence story rather than a stack of disconnected dashboards.
          </p>
        </div>

        <div className="mt-12 border-y border-line">
          <FeatureBand
            index="01"
            title="Walrus-native evidence storage"
            description="Audit PDFs, drone surveys, GPS records, sensor CSVs, survival reports, and attestations retain their content fingerprint and storage reference."
            icon={Database}
          />
          <FeatureBand
            index="02"
            title="Sui evidence registry"
            description="Object IDs and transaction digests connect off-chain files to an on-chain project trail without hiding the raw proof metadata."
            icon={Landmark}
            reverse
          />
          <FeatureBand
            index="03"
            title="AI verification and market readiness"
            description="Risk, confidence, missing evidence, and inconsistencies remain visible before a DeepBook-ready impact credit enters the simulation layer."
            icon={Store}
          />
        </div>
      </section>
    </main>
  );
}

function FeatureBand({
  index,
  title,
  description,
  icon: Icon,
  reverse = false,
}: {
  index: string;
  title: string;
  description: string;
  icon: typeof Database;
  reverse?: boolean;
}) {
  return (
    <article className={`grid gap-8 border-b border-line py-9 last:border-b-0 md:grid-cols-[180px_1fr_120px] md:items-center ${reverse ? "md:[&>*:first-child]:order-3 md:[&>*:last-child]:order-1" : ""}`}>
      <p className="font-mono text-sm font-semibold text-teal">{index}</p>
      <div>
        <h3 className="font-display text-2xl font-bold text-forest">{title}</h3>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">{description}</p>
      </div>
      <div className="grid size-16 place-items-center border border-line bg-paper text-teal shadow-panel" style={{ borderRadius: 8 }}>
        <Icon className="size-6" />
      </div>
    </article>
  );
}
