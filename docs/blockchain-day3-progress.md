# CarbonProof AI — Blockchain Day 3 Progress

## Role

Blockchain Engineer — Sui Move + Walrus Evidence Storage

---

## Summary

Today, the blockchain evidence flow was completed by connecting real Walrus-stored environmental evidence to Sui Move smart contract objects. CarbonProof AI now supports storing large environmental proof files on Walrus, registering their Blob IDs on Sui through `EvidenceRecord` objects, and issuing an `ImpactCredit` object that references the metadata Blob ID as its proof layer.

This proves the core CarbonProof architecture:

```txt
Walrus = decentralized evidence storage
Sui = on-chain registry and settlement layer
ImpactCredit = carbon credit object linked to verifiable proof
```

---

## Active Sui Package

### Package ID

```txt
0x78edf1935cd4298d8e28309be981e712db0c8f25e9ce29b25d5f4e04111e5725
```

### Modules

```txt
project_record
evidence_record
impact_credit
```

---

## Walrus Evidence Uploads

### 1. Google Environmental Report PDF

The Google 2024 Environmental Report was uploaded to Walrus and registered on-chain as a PDF evidence record.

#### File

```txt
google-2024-environmental-report.pdf
```

#### Walrus Blob ID

```txt
tGRNx6e9Jt60BJe8OSVUiRPnNJFe5HHj4udqDXkirPU
```

#### Walrus Object ID

```txt
0xfcad438a6d9b4b39c3dff327fa1b3b596664e7564abd745cc81594fdbe2fc138
```

#### Evidence Type

```txt
pdf_report
```

#### AI Score

```txt
90
```

#### Sui Evidence Object ID

```txt
0x1b730574eae0e27806ea3fe541079295e45d2ef4a71453009b6e460b20d7fba5
```

#### Transaction Digest

```txt
Ff6qKhswbo12wCUF5u5ASKpRcNBckyDJwnDmeFW31bD9
```

---

### 2. Environmental Image

An environmental image was uploaded to Walrus and registered on-chain as an image evidence record.

#### File

```txt
forest.jpg
```

#### Walrus Blob ID

```txt
Mlr4NuzOJYCiPaeqXZ52YPUmeCBjnOgoS30mr7OTwDo
```

#### Walrus Object ID

```txt
0xd72e2f8019a32cad318836949dc1fd4703288ab8b843426a96e0c7da0b9a074a
```

#### Evidence Type

```txt
environmental_image
```

#### AI Score

```txt
85
```

#### Sui Evidence Object ID

```txt
0x1eabce5377b9b8e19f313c1c9a0af364c1fa721832e1cd5861847f425b5f25e5
```

#### Transaction Digest

```txt
91dBqyu3kGrvoSjbV1QphFX66V41ocpWMvo5Wf8wyBeY
```

---

### 3. Metadata JSON

The metadata JSON file was uploaded to Walrus and registered on-chain as a metadata evidence record. This metadata file acts as the main proof index because it can reference the PDF report and environmental image.

#### File

```txt
metadata.json
```

#### Walrus Blob ID

```txt
AlBvUya7BMYTbVJ7v6HdkEbK0kQm94srK_Drew-u9rk
```

#### Walrus Object ID

```txt
0x2c45b171cf1d59b8881c8c3cb0ac7e692ba321a6c76c199fb86bd1a44955feb9
```

#### Evidence Type

```txt
metadata_json
```

#### AI Score

```txt
95
```

#### Sui Evidence Object ID

```txt
0x6bab0d479b5dfefeb56addeb21f509a3d066fa7ac30f22ca35de35de7d12d28e
```

#### Transaction Digest

```txt
GpennkqGqGpF4Z27CpANbpHQmuPSzPpKMPSM34Wqpzyr
```

---

## Issued Impact Credit

An `ImpactCredit` object was issued using the metadata Blob ID as its proof reference. This means the credit is linked to a Walrus-stored metadata file, which itself represents the evidence package.

### ImpactCredit Object ID

```txt
0xc9259eb79bd9852b67115d16437f0fd94ef592e83db0a1bf75675a7162e98bd1
```

### Transaction Digest

```txt
Roy15nW6oz5bW1EQiJdaQdeAS1H1CC9QwnCAQNW5E5J
```

### Credit ID

```txt
2
```

### Project ID

```txt
1
```

### Amount

```txt
100
```

### Proof Blob ID

```txt
AlBvUya7BMYTbVJ7v6HdkEbK0kQm94srK_Drew-u9rk
```

---

## Smart Contract Flow

### Evidence Registration

Each evidence file is first uploaded to Walrus. After upload, Walrus returns a Blob ID. That Blob ID is then stored on Sui through the `EvidenceRecord` object.

```txt
Evidence File
    ↓
Walrus Upload
    ↓
Blob ID Generated
    ↓
create_evidence()
    ↓
EvidenceRecord Created on Sui
```

### Impact Credit Issuance

After evidence is registered, an `ImpactCredit` is issued using the metadata Blob ID as the proof reference.

```txt
PDF Evidence
Image Evidence
Metadata JSON
    ↓
Walrus Blob IDs
    ↓
EvidenceRecord Objects
    ↓
ImpactCredit Issued
    ↓
Carbon Credit linked to proof
```

---

## Architecture

```txt
Environmental Evidence
        ↓
Walrus decentralized storage
        ↓
Blob ID generated
        ↓
EvidenceRecord registered on Sui
        ↓
ImpactCredit issued with metadata Blob ID as proof
```

---

## Why Walrus Is Used

Walrus is used to store large environmental evidence files such as PDF reports, images, and metadata files. These files are too large and inefficient to store directly on-chain. Instead, CarbonProof AI stores the actual files on Walrus and only stores their Blob IDs on Sui.

This keeps the system scalable while still allowing every carbon credit to be linked to verifiable evidence.

---

## Why Sui Is Used

Sui is used as the on-chain registry layer. It stores the important proof references and credit state, including:

```txt
Project records
Evidence records
Walrus Blob IDs
AI scores
Credit ownership
Credit verification status
Credit retirement status
```

---

## Carbon Credit Proof Model

In CarbonProof AI, a carbon credit should not be issued as a claim without proof. Each credit must be linked to evidence that supports the environmental impact claim.

```txt
Carbon Credit
    ↓
ImpactCredit Object
    ↓
Metadata Blob ID
    ↓
PDF Report + Image Evidence + Metadata JSON
    ↓
Walrus Storage
```

This makes the carbon credit more transparent and auditable.

---

## Day 3 Completion Status

### Completed

- Uploaded real PDF environmental report to Walrus
- Uploaded real environmental image to Walrus
- Uploaded metadata JSON to Walrus
- Registered PDF evidence as `EvidenceRecord` on Sui
- Registered image evidence as `EvidenceRecord` on Sui
- Registered metadata evidence as `EvidenceRecord` on Sui
- Issued `ImpactCredit` using metadata Blob ID as proof
- Connected real Walrus Blob IDs to Sui Move objects

### Result

CarbonProof AI now has a working Sui + Walrus evidence pipeline:

```txt
Real Evidence
    ↓
Walrus Storage
    ↓
Blob ID
    ↓
Sui EvidenceRecord
    ↓
ImpactCredit
```

---

## Notes

Raw evidence files are excluded from Git to keep the repository clean and production-ready. The actual evidence files are stored on Walrus, while Sui stores immutable references to those files.

This follows the intended architecture:

```txt
Walrus = evidence layer
Sui = registry and settlement layer
AI = verification layer
ImpactCredit = carbon credit asset layer
```