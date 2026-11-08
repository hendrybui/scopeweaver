---
name: offensive-shellcode
description: "Shellcode development reference for offensive security engagements. Use when writing custom x86/x64 shellcode, implementing position-independent code (PIC), building shellcode loaders, evading AV/EDR detection, or converting PE files to shellcode. Covers null byte avoidance, API hashing, encoder/decoder patterns, staged vs stageless payloads, Windows PEB traversal, and cross-platform shellcode techniques. Use when: shellcode encoder, shellcode loader, syscall stubs, egg hunting, shellcode obfuscation, null-byte avoidance, msfvenom payloads, execve shellcode, reverse shell shellcode"---

## Shellcode Development Workflow

1. Define concept and target platform (x86/x64, Windows/Linux/macOS)
2. Write assembly using position-independent techniques
3. Extract binary and test in controlled environment
4. Apply null byte avoidance and optimizations
5. Encode/encrypt to evade static detection
6. Package with loader and choose delivery method

---

## offensive-shellcode

claude-red library skill — category: infrastructure.

**Load the full skill** (methodology, copy-paste commands, detection view, cheatsheet, references):

- Tool: call `claude_red_show` with skill=`offensive-shellcode`
- Or Read: `/app/data/sessions/conv-3/claude-red/Skills/infrastructure/offensive-shellcode/SKILL.md`
- Discover: `claude_red_list` (all 79 skills) · `claude_red_search` (keyword across all skills)

Authorized engagements, bug bounty, research, CTF use only. Trigger vocabulary: see description in frontmatter above.
