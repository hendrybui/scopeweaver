---
name: offensive-tls-attacks
description: "Comprehensive methodology for auditing and exploiting TLS/SSL implementations and misconfigurations across network services and mobile applications. Covers protocol downgrade attacks including POODLE (CVE-2014-3566) against SSLv3 CBC padding, DROWN (CVE-2016-0800) cross-protocol attack leveraging SSLv2 export ciphers to decrypt TLS sessions, and FREAK (CVE-2015-0204) forcing RSA export-grade key exchange. Addresses BEAST (CVE-2011-3389) exploiting CBC IV predictability in TLS 1.0, CRIME (CVE-2012-4929) and BREACH targeting TLS-level and HTTP-level compression oracles respectively, and Heartbleed (CVE-2014-0160) for OpenSSL memory disclosure. Covers certificate validation bypass techniques for applications with improper hostname verification or chain validation, certificate pinning bypass using Frida and Objection for mobile application interception, HSTS bypass via NTP manipulation and subdomain exploitation, TLS 1.3 0-RTT replay attacks against non-idempotent endpoints, mutual TLS (mTLS) authentication attacks including client certificate theft and relay, and Certificate Transparency log monitoring for reconnaissance. Primary tooling includes testssl.sh for comprehensive TLS auditing, sslyze for Python-integrated scanning, sslscan for quick cipher enumeration, and tlsx for high-speed TLS probing at scale. Maps to CWE-295 (Improper Certificate Validation), CWE-319 (Cleartext Transmission of Sensitive Information), and CWE-757 (Selection of Less-Secure Algorithm During Negotiation)."
---

## offensive-tls-attacks

claude-red library skill — category: crypto.

**Load the full skill** (methodology, copy-paste commands, detection view, cheatsheet, references):

- Tool: call `claude_red_show` with skill=`offensive-tls-attacks`
- Or Read: `/app/data/sessions/conv-3/claude-red/Skills/crypto/offensive-tls-attacks/SKILL.md`
- Discover: `claude_red_list` (all 79 skills) · `claude_red_search` (keyword across all skills)

Authorized engagements, bug bounty, research, CTF use only. Trigger vocabulary: see description in frontmatter above.
