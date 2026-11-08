---
name: offensive-container-escape
description: "Container escape and breakout techniques targeting Docker, containerd, and Podman runtimes. Covers privileged container breakout via host filesystem mount and nsenter, Docker socket abuse through /var/run/docker.sock, Linux capability exploitation including CAP_SYS_ADMIN, CAP_SYS_PTRACE, and CAP_NET_ADMIN, cgroup v1 notify_on_release escape, runc CVEs such as CVE-2019-5736 and CVE-2024-21626 Leaky Vessels, kernel exploits from within containers, and Dockerfile misconfigurations like --privileged and host namespace sharing. Includes enumeration with capsh, amicontained, deepce, CDK, and nsenter. Maps to MITRE ATT&CK T1611 Escape to Host. Use this skill when the engagement scope includes container breakout, Docker escape, container privilege escalation, host access from container, or when you land inside a containerized environment and need to reach the underlying host."
---

## offensive-container-escape

claude-red library skill — category: container.

**Load the full skill** (methodology, copy-paste commands, detection view, cheatsheet, references):

- Tool: call `claude_red_show` with skill=`offensive-container-escape`
- Or Read: `/app/data/sessions/conv-3/claude-red/Skills/container/offensive-container-escape/SKILL.md`
- Discover: `claude_red_list` (all 79 skills) · `claude_red_search` (keyword across all skills)

Authorized engagements, bug bounty, research, CTF use only. Trigger vocabulary: see description in frontmatter above.
