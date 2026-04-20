---
description: IaC + container + Kubernetes scan — tfsec + terrascan + checkov + hadolint + dockle + kubesec
---

Invoke `insecure-defaults-hunter` for the IaC portion. Runs
`scripts/scan-iac.sh`. Output: `reports/iac-*.{sarif,json}`.
