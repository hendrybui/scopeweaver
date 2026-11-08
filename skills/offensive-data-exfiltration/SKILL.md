---
name: offensive-data-exfiltration
description: "Dense methodology covering DNS exfiltration (dnscat2, iodine, dns2tcp), HTTPS tunneling (domain fronting, CDN abuse, legitimate service channels), ICMP tunneling (icmpsh, ptunnel-ng), cloud storage dead drops (S3 presigned URLs, Azure Blob SAS tokens, GCS signed URLs), email-based exfil (SMTP, EWS, draft method), steganography (image, audio, document metadata), encoding/encryption (base64 chunking, XOR, AES), covert channels (custom protocol tunneling, HTTP header encoding, timing channels), and data staging (compression, splitting, encryption). Tools: dnscat2, iodine, dns2tcp, PacketWhisper, chisel, stunnel, icmpsh, ptunnel-ng, steghide, zsteg, OpenStego. MITRE ATT&CK: T1048 (Exfiltration Over Alternative Protocol), T1041 (Exfiltration Over C2 Channel), T1567 (Exfiltration Over Web Service), T1029 (Scheduled Transfer), T1030 (Data Transfer Size Limits), T1132 (Data Encoding), T1001 (Data Obfuscation). Use when planning or executing data exfiltration during authorized red team engagements or post-exploitation."
---

## offensive-data-exfiltration

claude-red library skill — category: post-exploitation.

**Load the full skill** (methodology, copy-paste commands, detection view, cheatsheet, references):

- Tool: call `claude_red_show` with skill=`offensive-data-exfiltration`
- Or Read: `/app/data/sessions/conv-3/claude-red/Skills/post-exploitation/offensive-data-exfiltration/SKILL.md`
- Discover: `claude_red_list` (all 79 skills) · `claude_red_search` (keyword across all skills)

Authorized engagements, bug bounty, research, CTF use only. Trigger vocabulary: see description in frontmatter above.
