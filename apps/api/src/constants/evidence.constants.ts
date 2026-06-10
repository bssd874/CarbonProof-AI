import { EvidenceType } from "../types/evidence.types";

export const REQUIRED_EVIDENCE_TYPES: EvidenceType[] = [
    "audit_report_pdf",
    "drone_image",
    "sensor_csv",
    "gps_metadata_json",
    "survival_rate_report",
    "auditor_signature",
];

export const EVIDENCE_LABELS: Record<EvidenceType, string> = {
    audit_report_pdf: "Audit report",
    drone_image: "Drone image",
    sensor_csv: "Sensor data",
    gps_metadata_json: "GPS metadata",
    survival_rate_report: "Survival-rate report",
    auditor_signature: "Third-party auditor signature",
};