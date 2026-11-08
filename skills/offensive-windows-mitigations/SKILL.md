---
name: offensive-windows-mitigations
description: "Deep-dive on Windows exploit mitigations: ASLR, DEP/NX, CFG, CET/Shadow Stack, SEHOP, Heap Guard, ACG, Arbitrary Code Guard. Covers both the protection mechanism and known bypass techniques. Use when researching Windows exploit mitigations, planning bypass strategies, or understanding protection depth. Use when: Windows mitigations, ASLR, DEP, NX, CFG, CET, shadow stack, SEHOP, heap guard, ACG, mitigation bypass, exploit mitigation, Windows hardening"---

# Week 6: Understanding Windows Mitigations
Use this skill when the conversation involves any of:
`Windows mitigations, ASLR, DEP, NX, CFG, CET, shadow stack, SEHOP, heap guard, ACG, mitigation bypass, exploit mitigation, Windows hardening`

## Instructions for Claude

When this skill is active:
1. Load and apply the full methodology below as your operational checklist
2. Follow steps in order unless the user specifies otherwise
3. For each technique, consider applicability to the current target/context
4. Track which checklist items have been completed
5. Suggest next steps based on findings

---

## offensive-windows-mitigations

claude-red library skill — category: infrastructure.

**Load the full skill** (methodology, copy-paste commands, detection view, cheatsheet, references):

- Tool: call `claude_red_show` with skill=`offensive-windows-mitigations`
- Or Read: `/app/data/sessions/conv-3/claude-red/Skills/infrastructure/offensive-windows-mitigations/SKILL.md`
- Discover: `claude_red_list` (all 79 skills) · `claude_red_search` (keyword across all skills)

Authorized engagements, bug bounty, research, CTF use only. Trigger vocabulary: see description in frontmatter above.
