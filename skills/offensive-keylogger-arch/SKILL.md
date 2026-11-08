---
name: offensive-keylogger-arch
description: "Low-level keylogger architecture design: kernel driver hooks (WH_KEYBOARD_LL, SetWindowsHookEx), ETW-based input capture, user-mode vs kernel-mode approaches, stealth techniques, and data exfiltration. Use for understanding input capture mechanisms, EDR evasion research, or malware architecture analysis. Use when: keylogger, keyboard hook, WH_KEYBOARD_LL, SetWindowsHookEx, ETW, kernel driver, input capture, low-level keylogger, malware architecture, stealth, exfiltration"---

# Novel research
Use this skill when the conversation involves any of:
`keylogger, keyboard hook, WH_KEYBOARD_LL, SetWindowsHookEx, ETW, kernel driver, input capture, low-level keylogger, malware architecture, stealth, exfiltration`

## Instructions for Claude

When this skill is active:
1. Load and apply the full methodology below as your operational checklist
2. Follow steps in order unless the user specifies otherwise
3. For each technique, consider applicability to the current target/context
4. Track which checklist items have been completed
5. Suggest next steps based on findings

---

## offensive-keylogger-arch

claude-red library skill — category: infrastructure.

**Load the full skill** (methodology, copy-paste commands, detection view, cheatsheet, references):

- Tool: call `claude_red_show` with skill=`offensive-keylogger-arch`
- Or Read: `/app/data/sessions/conv-3/claude-red/Skills/infrastructure/offensive-keylogger-arch/SKILL.md`
- Discover: `claude_red_list` (all 79 skills) · `claude_red_search` (keyword across all skills)

Authorized engagements, bug bounty, research, CTF use only. Trigger vocabulary: see description in frontmatter above.
