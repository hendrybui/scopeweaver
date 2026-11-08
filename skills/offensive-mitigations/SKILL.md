---
name: offensive-mitigations
description: "Security mitigation reference and bypass catalog: ASLR, DEP/NX, RELRO, stack canaries, CFI, sandboxing, seccomp. Covers both detection of enabled mitigations and known bypass techniques. Use when assessing target hardening or planning exploit mitigation bypasses. Use when: mitigations, ASLR bypass, DEP bypass, NX bypass, RELRO, stack canary bypass, CFI bypass, sandbox bypass, seccomp bypass, mitigation detection, checksec"---

# Modern Kernel Exploit Mitigations
Use this skill when the conversation involves any of:
`mitigations, ASLR bypass, DEP bypass, NX bypass, RELRO, stack canary bypass, CFI bypass, sandbox bypass, seccomp bypass, mitigation detection, checksec`

## Instructions for Claude

When this skill is active:
1. Load and apply the full methodology below as your operational checklist
2. Follow steps in order unless the user specifies otherwise
3. For each technique, consider applicability to the current target/context
4. Track which checklist items have been completed
5. Suggest next steps based on findings

---

## offensive-mitigations

claude-red library skill — category: exploit-dev.

**Load the full skill** (methodology, copy-paste commands, detection view, cheatsheet, references):

- Tool: call `claude_red_show` with skill=`offensive-mitigations`
- Or Read: `/app/data/sessions/conv-3/claude-red/Skills/exploit-dev/offensive-mitigations/SKILL.md`
- Discover: `claude_red_list` (all 79 skills) · `claude_red_search` (keyword across all skills)

Authorized engagements, bug bounty, research, CTF use only. Trigger vocabulary: see description in frontmatter above.
