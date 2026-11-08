---
name: offensive-toctou
description: "Time-of-Check / Time-of-Use (TOCTOU) race condition exploitation methodology across binary, kernel, filesystem, web, and container layers. Covers symbolic-link races (open/access/stat split), file-descriptor races, fopen/realpath traversal races, /proc and procfs races, FUSE-backed slow-fs races to widen the window, ptrace and signal races, kernel double-fetch / userspace pointer races, container/runc/symlink escape primitives, kubernetes admission/authz TOCTOU, web auth-vs-authz TOCTOU, JWT-claim TOCTOU at gateway vs service, payment/idempotency races, and modern race-amplification techniques (single-packet attack, slow loris, FUSE pause, cgroup freeze, scheduler shaping). Use when you've identified a 'check then act' pattern in code, when fuzzing for race conditions, or when exploiting concurrency bugs in privileged binaries / kernel / orchestrators."
---

## offensive-toctou

claude-red library skill — category: exploit-dev.

**Load the full skill** (methodology, copy-paste commands, detection view, cheatsheet, references):

- Tool: call `claude_red_show` with skill=`offensive-toctou`
- Or Read: `/app/data/sessions/conv-3/claude-red/Skills/exploit-dev/offensive-toctou/SKILL.md`
- Discover: `claude_red_list` (all 79 skills) · `claude_red_search` (keyword across all skills)

Authorized engagements, bug bounty, research, CTF use only. Trigger vocabulary: see description in frontmatter above.
