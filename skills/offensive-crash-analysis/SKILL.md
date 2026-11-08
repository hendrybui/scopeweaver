---
name: offensive-crash-analysis
description: "Week 4 exploit development curriculum. Crash triage and analysis methodology: WinDbg/GDB analysis, ASAN/MSAN output interpretation, exploitability assessment, register/stack trace reading, root cause identification. Use when analyzing crash dumps, assessing exploitability, or understanding fuzzer-generated crashes. Use when: crash analysis, crash triage, WinDbg, GDB, ASAN, MSAN, exploitability, stack trace, register dump, segfault, null deref, access violation, week 4"---

# Week 4: Crash Analysis and Exploitability Assessment
Use this skill when the conversation involves any of:
`crash analysis, crash triage, WinDbg, GDB, ASAN, MSAN, exploitability, stack trace, register dump, segfault, null deref, access violation, week 4`

## Instructions for Claude

When this skill is active:
1. Load and apply the full methodology below as your operational checklist
2. Follow steps in order unless the user specifies otherwise
3. For each technique, consider applicability to the current target/context
4. Track which checklist items have been completed
5. Suggest next steps based on findings

---

## offensive-crash-analysis

claude-red library skill — category: exploit-dev.

**Load the full skill** (methodology, copy-paste commands, detection view, cheatsheet, references):

- Tool: call `claude_red_show` with skill=`offensive-crash-analysis`
- Or Read: `/app/data/sessions/conv-3/claude-red/Skills/exploit-dev/offensive-crash-analysis/SKILL.md`
- Discover: `claude_red_list` (all 79 skills) · `claude_red_search` (keyword across all skills)

Authorized engagements, bug bounty, research, CTF use only. Trigger vocabulary: see description in frontmatter above.
