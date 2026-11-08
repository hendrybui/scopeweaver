---
name: pandora-bolt-toolchain
description: Maps authorized pentest objectives to verified tool chains across three MCP surfaces 45 bolt gateway tools (recon DNS portscan web fuzz vulnscan AD attack cracking cloud) 150 hexstrike AI tools (live verified, includes metasploit/zap/burpsuite/ghidra/pwn/forensics/cloud remotely, requires loading skill hexstrike-mcp-chains to unlock) and 62 browser automation tools plus local host tool paths. Use when planning any recon/exploitation workflow, choosing between nmap/rustscan/masscan, subfinder/amass/crtsh, hydra/medusa, hashcat/john, or locating wordlists and tool binaries. Includes path configuration, venv execution rules, and known-dead local tools with MCP fallbacks.
mcps: browser, ScopeSentry, bolt, hexstrike
---
# Pandora bolt toolchain

1. Read DB and paths first:
   - Tool database + chains: `/app/data/sessions/conv-1/toolchain_db.json`
   - Path configuration: `/app/data/sessions/conv-1/paths.conf`
   - Chain details: `/app/data/sessions/conv-1/SKILL_CHAINS.md`
2. Bolt tools are deferred. Discover schema: `SearchExtraTools("select:mcp__bolt__<name>")`, then invoke with `ExecuteExtraTool`. 45 tools, full list in DB.
3. Hexstrike (150 tools) is LIVE and PRIMARY for its coverage — but requires loading skill `hexstrike-mcp-chains` first or ExecuteExtraTool refuses (`not unlocked`). It adds metasploit/zap/burpsuite/ghidra/nikto/dirsearch/feroxbuster/dalfox/netexec/pwn/forensics/k8s/AI workflows. Potfile reads and medusa stay on bolt.
4. Pick chain by objective:
   - Web surface: C1 (subfinder/amass -> dnsx -> alterx+shuffledns -> httpx -> katana/waybackurls -> gobuster/ffuf -> arjun -> nuclei -> sqlmap/smuggler/wpscan); hexstrike variant with dirsearch/feroxbuster/dalfox/nikto
   - Network: C2 (rustscan full-range -> nmap -sV -sC -> hydra/medusa)
   - Active Directory: C3 (kerbrute_userenum -> lookupsid/asreproast/kerberoast -> hashcat 13100/18200/1000 -> impacket_exec -> secretsdump)
   - Hashes: C4 (john auto-detect or hashcat -m; always follow crack with *_show)
   - AWS: C5 (scoutsuite); cloud/k8s extras via hexstrike (pacu/prowler/kube-hunter/trivy)
   - Missing tool: C6 `mcp__bolt__run_command` or hexstrike `execute_command`.
5. Wordlists: never hardcode paths. `wordlist_recommend(purpose, intensity)` or `wordlist_search(query)` return verified paths; feed result into wordlist params.
6. Port scanners: rustscan for full-range speed (auto-nmap), nmap for scripts/OS on known ports, masscan for /16+ ranges.
7. AD spray: kerbrute_passwordspray only with safe=true, 1 password per user per 30 min, after checking lockout threshold.
8. Local host tools (no bolt): see paths.conf. venv rule — use versioned entry point (`bin/python3.11` for non-3.12 venvs). Verified 2026-11-01: Java 21, Ruby 3.3.8 and Docker 29.1.3 are present; `zap.sh -version` (2.16.1) and `msfconsole --version` (6.5.9-dev) execute. Still broken shims: `sqlmap`, `enum4linux-ng`, `responder` — use `sqlmap-fixed`, `enum4linux-ng-fixed`, `responder-fixed` or the bolt/hexstrike equivalents. `error while loading shared libraries` = use MCP fallback, do not retry.
9. Writes: `/app/data/sessions/conv-1`, `/app/data/sessions/conv-6` or `/mnt/Pandora/Hack/results`. `/app/data`, `/app/skills`, `/mnt/Pandora` and the Docker socket are writable; `/host`, `/opt` and the shim homes are read-only.
10. Hash codes: 0 MD5, 100 SHA1, 1000 NTLM, 1400 SHA256, 1800 sha512crypt, 3200 bcrypt, 5600 NetNTLMv2, 13100 Kerberoast, 18200 AS-REP.
