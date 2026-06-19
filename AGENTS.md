# CarbonProof AI — Codex Design & Frontend Rules

## Product Context

CarbonProof AI is a Walrus-native verifiable evidence layer for carbon and impact credits.

Core layers:
- Walrus = evidence storage layer
- Sui = on-chain evidence registry
- AI = verification and risk analysis layer
- DeepBook = marketplace/liquidity simulation layer

Main user flow:
Landing → Dashboard → Create Project → Upload Evidence → Project Detail → Run AI Verification → Public Verify Page → Marketplace Simulation

## Visual Direction

Design style:
- Clean climate-tech
- Modern Web3
- Trustworthy, audit-friendly, data-rich
- Not childish, not generic crypto neon
- Professional enough for judges, simple enough for demo

Mood:
- Verifiable
- Transparent
- Environmental
- Technical
- Secure

## Color Direction

Use a restrained palette:
- Deep forest green for trust/environment
- Dark navy for technical/Web3 feel
- Cyan/teal accent for verification and data
- Soft off-white or slate background
- Warning colors only for risk states

Avoid:
- Overusing gradients
- Too much neon
- Random green everywhere
- Repetitive card blocks with identical layout

## UI Rules

Every screen must have a clear purpose and hierarchy.

Avoid repeating the same structure on every page.
Use varied layout patterns:
- Landing: hero + proof flow + feature cards
- Dashboard: metric cards + project table + activity timeline
- Upload: stepper + drag-drop + evidence checklist
- Project Detail: two-column layout with evidence trail and AI panel
- Public Verify: proof certificate style
- Marketplace: order book / asset cards / trade simulation

## Component Rules

Create reusable components:
- Button
- Card
- Badge
- StatusPill
- RiskScoreCard
- EvidenceCard
- ProjectCard
- ProofTrailItem
- UploadDropzone
- VerificationPanel
- CopyableHash
- BlockchainLink

## Anti-Repetition Rules

Do not create pages that are all just title + grid of identical cards.
Each page must have at least one unique layout element:
- timeline
- stepper
- split panel
- table
- proof certificate
- activity log
- order book
- verification trail

Use realistic content:
- Mangrove Restoration — Bekasi Coastal Area
- Audit report PDF
- Drone image
- Sensor CSV
- GPS metadata JSON
- Survival-rate report
- Auditor attestation

## UX Rules

The UI must show:
- loading state
- empty state
- success state
- error state
- copy buttons for Blob ID, hash, transaction digest
- links to Walrus blob and Sui explorer
- clear disclaimer that AI verification is not legal certification

## Frontend Tech

Use:
- Next.js or React + Vite
- TypeScript
- Tailwind CSS
- shadcn/ui if available
- lucide-react icons
- React Query or simple API client

Do not hardcode backend data except for fallback demo states.
Use environment variable:
NEXT_PUBLIC_API_URL

## API Endpoints

GET /api/health
GET /api/projects
POST /api/projects
GET /api/projects/:id
POST /api/projects/:id/evidence
POST /api/projects/:id/verify
GET /api/projects/:id/verification-report