---
name: offensive-cicd-secrets
description: "Comprehensive secrets extraction methodology targeting CI/CD environments across all major platforms. Covers environment variable extraction from build contexts, exploitation of vault and secrets-manager misconfigurations (HashiCorp Vault, AWS Secrets Manager, Azure Key Vault, GCP Secret Manager), runner and agent token abuse for lateral movement, OIDC federation attacks exploiting trust relationships between CI/CD providers and cloud platforms, build log leakage analysis for inadvertently exposed credentials, cache poisoning techniques for credential exfiltration, platform-specific credential store exploitation (GitHub Actions secrets, GitLab CI variables, Jenkins credential providers), service connection and service account abuse in Azure DevOps and GCP, and Docker registry credential theft from build environments. Maps to MITRE ATT&CK T1552 (Unsecured Credentials) and its sub-techniques. Each section provides enumeration procedures, extraction techniques, and post-exploitation pivoting guidance for using recovered secrets to expand access."
---

## offensive-cicd-secrets

claude-red library skill — category: cicd.

**Load the full skill** (methodology, copy-paste commands, detection view, cheatsheet, references):

- Tool: call `claude_red_show` with skill=`offensive-cicd-secrets`
- Or Read: `/app/data/sessions/conv-3/claude-red/Skills/cicd/offensive-cicd-secrets/SKILL.md`
- Discover: `claude_red_list` (all 79 skills) · `claude_red_search` (keyword across all skills)

Authorized engagements, bug bounty, research, CTF use only. Trigger vocabulary: see description in frontmatter above.
