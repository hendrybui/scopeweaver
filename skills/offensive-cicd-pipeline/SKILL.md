---
name: offensive-cicd-pipeline
description: "Comprehensive CI/CD pipeline exploitation methodology covering GitHub Actions injection vectors (expression injection via PR titles and issue bodies, workflow_run event abuse, GITHUB_TOKEN over-scoping, composite action supply chain compromise), Jenkins attack paths (Groovy sandbox escapes, script console remote code execution, Java remoting deserialization, credential store dumping, shared library injection), GitLab CI exploitation (YAML anchor injection, runner registration token abuse, CI variable extraction, protected branch bypass via merge request pipelines), and Azure DevOps pipeline agent compromise with service connection theft. Includes artifact poisoning techniques across all platforms, tooling guidance for gato and jenkins-attack-framework, and maps to MITRE ATT&CK T1195.002 (Supply Chain Compromise: Compromise Software Supply Chain). Covers enumeration of pipeline configurations, privilege escalation from contributor to code execution, lateral movement through pipeline trust boundaries, and persistence via modified workflow definitions. Each technique section provides working exploitation code, detection indicators, and defensive countermeasures."
---

## offensive-cicd-pipeline

claude-red library skill — category: cicd.

**Load the full skill** (methodology, copy-paste commands, detection view, cheatsheet, references):

- Tool: call `claude_red_show` with skill=`offensive-cicd-pipeline`
- Or Read: `/app/data/sessions/conv-3/claude-red/Skills/cicd/offensive-cicd-pipeline/SKILL.md`
- Discover: `claude_red_list` (all 79 skills) · `claude_red_search` (keyword across all skills)

Authorized engagements, bug bounty, research, CTF use only. Trigger vocabulary: see description in frontmatter above.
