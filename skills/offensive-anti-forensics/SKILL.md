---
name: offensive-anti-forensics
description: "Anti-forensics and evidence destruction techniques for red team operators conducting authorized engagements. Covers log clearing on Windows (wevtutil, Clear-EventLog, ETW provider patching) and Linux (journal truncation, utmp/wtmp binary editing, syslog manipulation), timestamp manipulation via Timestomp and SetMACE to defeat timeline analysis, filesystem-level anti-forensics including NTFS Alternate Data Streams for payload hiding and secure deletion with sdelete/shred, memory artifact removal to counter live forensics, disk artifact manipulation targeting MFT entries and USN journal records, network forensics evasion through encrypted C2 channels and DNS-over-HTTPS tunneling, and anti-VM/sandbox detection to avoid dynamic analysis environments. Tools: Timestomp, wevtutil, sdelete, shred, MimiPenguin, Invoke-Phant0m. Aligns to MITRE ATT&CK T1070 (Indicator Removal), T1027 (Obfuscated Files or Information), T1497 (Virtualization/Sandbox Evasion). Each technique includes the forensic artifact it targets, the destruction or manipulation method, and the defender perspective so operators understand detection gaps they must account for."
---

## offensive-anti-forensics

claude-red library skill — category: forensics.

**Load the full skill** (methodology, copy-paste commands, detection view, cheatsheet, references):

- Tool: call `claude_red_show` with skill=`offensive-anti-forensics`
- Or Read: `/app/data/sessions/conv-3/claude-red/Skills/forensics/offensive-anti-forensics/SKILL.md`
- Discover: `claude_red_list` (all 79 skills) · `claude_red_search` (keyword across all skills)

Authorized engagements, bug bounty, research, CTF use only. Trigger vocabulary: see description in frontmatter above.
