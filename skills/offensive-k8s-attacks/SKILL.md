---
name: offensive-k8s-attacks
description: "Kubernetes cluster attack techniques covering the full attack lifecycle from initial foothold in a pod to cluster-wide compromise. Covers service account token theft and impersonation, RBAC misconfiguration exploitation including wildcard permissions and privilege escalation via role binding, direct etcd access for secret extraction, kubelet API abuse on port 10250 and read-only port 10255, pod escape via hostPID hostNetwork and hostPath volume mounts, Kubernetes secrets enumeration and decoding, admission controller bypass techniques, network policy bypass and lateral movement, cloud metadata service access from pods for credential theft on AWS EKS GCP GKE and Azure AKS, CRD and operator abuse for persistence, and node compromise via DaemonSet deployment. Tools include kubectl, kube-hunter, peirates, kubeaudit, kdigger, kubeletctl. Maps to MITRE ATT&CK T1609 Container Administration Command, T1610 Deploy Container, T1613 Container and Resource Discovery. Use this skill when assessing Kubernetes clusters, attacking from within a compromised pod, exploiting RBAC or kubelet misconfigurations, or performing cloud-native lateral movement."
---

## offensive-k8s-attacks

claude-red library skill — category: container.

**Load the full skill** (methodology, copy-paste commands, detection view, cheatsheet, references):

- Tool: call `claude_red_show` with skill=`offensive-k8s-attacks`
- Or Read: `/app/data/sessions/conv-3/claude-red/Skills/container/offensive-k8s-attacks/SKILL.md`
- Discover: `claude_red_list` (all 79 skills) · `claude_red_search` (keyword across all skills)

Authorized engagements, bug bounty, research, CTF use only. Trigger vocabulary: see description in frontmatter above.
