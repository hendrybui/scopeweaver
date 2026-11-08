---
name: offensive-edr-evasion
description: "EDR evasion offensive checklist: hook unhooking (user/kernel), direct syscalls, PPID spoofing, process injection variants, AMSI bypass, ETW patching, memory encryption, and behavior-based evasion. Use when planning EDR bypass during red team engagements or researching AV/EDR evasion techniques. Use when: EDR evasion, EDR bypass, hook unhooking, direct syscalls, PPID spoofing, process injection, AMSI bypass, ETW patch, memory encryption, AV evasion, behavioral evasion, red team evasion"---

# Endpoint Detection and Response
Use this skill when the conversation involves any of:
`EDR evasion, EDR bypass, hook unhooking, direct syscalls, PPID spoofing, process injection, AMSI bypass, ETW patch, memory encryption, AV evasion, behavioral evasion, red team evasion`

## Instructions for Claude

When this skill is active:
1. Load and apply the full methodology below as your operational checklist
2. Follow steps in order unless the user specifies otherwise
3. For each technique, consider applicability to the current target/context
4. Track which checklist items have been completed
5. Suggest next steps based on findings

---

## offensive-edr-evasion

claude-red library skill — category: infrastructure.

**Load the full skill** (methodology, copy-paste commands, detection view, cheatsheet, references):

- Tool: call `claude_red_show` with skill=`offensive-edr-evasion`
- Or Read: `/app/data/sessions/conv-3/claude-red/Skills/infrastructure/offensive-edr-evasion/SKILL.md`
- Discover: `claude_red_list` (all 79 skills) · `claude_red_search` (keyword across all skills)

Authorized engagements, bug bounty, research, CTF use only. Trigger vocabulary: see description in frontmatter above.
