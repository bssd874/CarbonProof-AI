CarbonProof AI synthetic evidence package

All files in this folder are synthetic demo data created solely for backend, upload, hashing, database, and Gemini verification testing.

Suggested Postman mapping:
1. mangrove-audit-report-demo.pdf
   evidenceType: audit_report_pdf

2. mangrove-drone-image-demo.png
   evidenceType: drone_image

3. gps-evidence.json
   evidenceType: gps_metadata_json

4. sensor-data.csv
   evidenceType: sensor_csv

5. mangrove-survival-rate-report-demo.pdf
   evidenceType: survival_rate_report

6. auditor-attestation-demo.pdf
   evidenceType: auditor_signature

Use multipart/form-data:
- file: choose the file
- evidenceType: one of the values above
- uploadedBy: 0xproject_owner_dummy

These files are NOT real environmental evidence or certification.
