---
name: offensive-persistence
description: "Comprehensive persistence tradecraft for authorized red team engagements covering Windows and Linux mechanisms. Windows techniques include registry Run/RunOnce keys, scheduled tasks, WMI event subscriptions, DLL search order hijacking, COM object hijacking, Startup folder drops, service creation, Security Support Provider (SSP) DLL injection, and Active Directory persistence (AdminSDHolder abuse, DCShadow, Golden Ticket, Silver Ticket, Skeleton Key, SID History injection). Linux techniques include cron and at jobs, systemd timers and services, SSH authorized_keys injection, shell profile backdoors (.bashrc/.bash_profile), PAM module backdoors, LD_PRELOAD hijacking, kernel module rootkits, web shells, and Git hook abuse. Provides operator-ready command sequences for SharPersist, Impacket ticketer, schtasks, sc.exe, crontab, and systemctl with OPSEC considerations for each method. Maps to MITRE ATT&CK T1547 (Boot or Logon Autostart), T1053 (Scheduled Task/Job), T1546 (Event Triggered Execution), T1556 (Modify Authentication Process), and sub-techniques. Includes detection indicators and a rapid engagement cheatsheet."
---

## offensive-persistence

claude-red library skill — category: post-exploitation.

**Load the full skill** (methodology, copy-paste commands, detection view, cheatsheet, references):

- Tool: call `claude_red_show` with skill=`offensive-persistence`
- Or Read: `/app/data/sessions/conv-3/claude-red/Skills/post-exploitation/offensive-persistence/SKILL.md`
- Discover: `claude_red_list` (all 79 skills) · `claude_red_search` (keyword across all skills)

Authorized engagements, bug bounty, research, CTF use only. Trigger vocabulary: see description in frontmatter above.
