---
name: offensive-crypto-attacks
description: "Systematic methodology for identifying and exploiting cryptographic implementation weaknesses in real-world applications. Covers padding oracle attacks against CBC-mode ciphers with PKCS7 padding (Vaudenay's original attack through modern padbuster automation), ECB mode exploitation including block cut-and-paste and byte-at-a-time decryption, hash length extension attacks against SHA1/SHA256/MD5-based MACs using HashPump, RSA vulnerabilities including small public exponent, common modulus, Bleichenbacher PKCS1v1.5 padding oracle, and Coppersmith's method for partial key recovery. Addresses weak PRNG exploitation targeting time-seeded generators and Mersenne Twister MT19937 state recovery from observed outputs, timing side-channel attacks against comparison operations, nonce reuse in AES-GCM leading to authentication key recovery, and key derivation weaknesses including insufficient iteration counts and missing salts. Primary tooling includes padbuster, RsaCtfTool, hashpump, and PyCryptodome for building custom exploit payloads. Maps to CWE-327 (Use of a Broken or Risky Cryptographic Algorithm), CWE-328 (Use of Weak Hash), and CWE-330 (Use of Insufficiently Random Values). Emphasizes black-box identification of vulnerable implementations before transitioning to targeted exploitation."
---

## offensive-crypto-attacks

claude-red library skill — category: crypto.

**Load the full skill** (methodology, copy-paste commands, detection view, cheatsheet, references):

- Tool: call `claude_red_show` with skill=`offensive-crypto-attacks`
- Or Read: `/app/data/sessions/conv-3/claude-red/Skills/crypto/offensive-crypto-attacks/SKILL.md`
- Discover: `claude_red_list` (all 79 skills) · `claude_red_search` (keyword across all skills)

Authorized engagements, bug bounty, research, CTF use only. Trigger vocabulary: see description in frontmatter above.
