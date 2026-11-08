---
name: hexstrike-mcp-chains
description: Tool chains for the HexStrike AI MCP server (platform MCP entry id=8, stdio to backend http://host.docker.internal:8889). VERIFIED LIVE 2026-11-01 — 150 mcp__hexstrike__* tools, v6.1.0-unified.p4, 124/127 backend tools. Maps pentest objectives to HexStrike chains (recon, web, network, AD, cracking, pwn/binary, forensics, cloud, AI workflows) with bolt MCP fallbacks. Loading this skill UNLOCKS the mcp__hexstrike__* tools for ExecuteExtraTool.
mcps: ScopeSentry, bolt, hexstrike, browser
---
# HexStrike MCP tool chains

## 0. Unlock + status (do this every session)
1. Load THIS skill first — `mcp__hexstrike__*` execute only when it is loaded. Otherwise `ExecuteExtraTool` returns `tool ... is not unlocked in this session`. `SearchExtraTools` shows schemas regardless.
2. Verify: `ExecuteExtraTool("mcp__hexstrike__server_health", {})` — expect `status=healthy`, `all_essential_tools_available=true`. Last verified 2026-11-01 03:20: v6.1.0-unified.p4, 124/127 backend tools, uptime 3469s, 100% exec success. Note: `server_health` was transiently `RemoteDisconnected` at 02:24 while `execute_command` still worked; it recovered after the MCP child restarted (PID 4319).
3. Backend health is `http://host.docker.internal:8889/health` (port 8889). Direct probes from this container need `curl --noproxy '*'`; the `localhost:8888` route is the gateway side and can return a proxy 502.
4. On `server_health` failure or tool-not-found → bolt fallback (skill `pandora-bolt-toolchain`).
5. MCP entry: id=8 `hexstrike`, transport sse, url `http://localhost:8888/sse` (switch to http `/mcp` for streamable builds via `update_mcp`). SSE drops on server restart — re-run health.

## 1. Tool names (verified from live server, 150 total; full list: hexstrike_tools.txt in task workdir)
- Net recon: `nmap_scan`, `nmap_advanced_scan`, `masscan_high_speed`, `rustscan_fast_scan`, `arp_scan_discovery`, `autorecon_comprehensive`/`autorecon_scan`, `netexec_scan`, `enum4linux_scan`, `enum4linux_ng_advanced`, `smbmap_scan`, `nbtscan_netbios`, `rpcclient_enumeration`, `responder_credential_harvest`
- DNS/domain: `subfinder_scan`, `amass_scan`, `dnsenum_scan`, `fierce_scan`, `gau_discovery`, `waybackurls_discovery`, `anew_data_processing` (no assetfinder/crtsh/dnsx endpoints — bolt covers those)
- Web probe/fuzz: `httpx_probe`, `gobuster_scan`, `ffuf_scan`, `dirsearch_scan`, `dirb_scan`, `feroxbuster_scan`, `wfuzz_scan`, `katana_crawl`, `hakrawler_crawl`, `arjun_parameter_discovery`/`arjun_scan`, `paramspider_discovery`/`paramspider_mining`, `x8_parameter_discovery`, `uro_url_filtering`, `qsreplace_parameter_replacement`, `wafw00f_scan`
- Vuln/exploit web: `nuclei_scan`, `nikto_scan`, `jaeles_vulnerability_scan`, `dalfox_xss_scan`, `xsser_scan`, `graphql_scanner`, `jwt_analyzer`, `sqlmap_scan`, `wpscan_analyze`, `zap_scan`, `burpsuite_scan`, `burpsuite_alternative_scan`, `http_framework_test`/`http_intruder`/`http_repeater`/`http_set_rules`/`http_set_scope`, `hashpump_attack`, `api_fuzzer`, `api_schema_analyzer`, `comprehensive_api_audit`, `browser_agent_inspect`
- Network pwn: `metasploit_run`, `msfvenom_generate`, `evil-winrm` backend (via `execute_command`)
- Creds/crack: `hydra_attack`, `hashcat_crack`, `john_crack`. GAPS: no medusa/patator endpoint (bolt `medusa_medusa`); no `*_show`/potfile-read (bolt `hashcat_hashcat_show`/`john_john_show`)
- Binary/pwn: `pwntools_exploit`, `pwninit_setup`, `radare2_analyze`, `gdb_analyze`, `gdb_peda_debug`, `checksec_analyze`, `angr_symbolic_execution`, `ropgadget_search`, `ropper_gadget_search`, `one_gadget_search`, `libc_database_lookup`, `objdump_analyze`, `strings_extract`, `xxd_hexdump`
- Forensics/stego: `binwalk_analyze`, `foremost_carving`, `exiftool_extract`, `steghide_analysis`, `volatility_analyze`, `volatility3_analyze`
- Cloud/k8s/containers: `scout_suite_assessment`, `pacu_exploitation`, `cloudmapper_analysis`, `prowler_scan`, `checkov_iac_scan`, `terrascan_iac_scan`, `kube_bench_cis`, `kube_hunter_scan`, `trivy_scan`, `clair_vulnerability_scan`, `docker_bench_security_scan`, `falco_runtime_monitoring`
- Utilities: `server_health`, `execute_command`, `execute_python_script`, `install_python_package`, file helpers (create/modify/list/remove), `get_telemetry`, `get_live_dashboard`, `display_system_metrics`, process mgmt (`list_active_processes`/`pause_process`/`resume_process`/`terminate_process`), `get_cache_stats`, `clear_cache`, `create_scan_summary`, `create_vulnerability_report`, `format_tool_output_visual`
- AI workflows: `ai_reconnaissance_workflow`, `ai_vulnerability_assessment`, `analyze_target_intelligence`, `detect_technologies_ai`, `intelligent_smart_scan`, `select_optimal_tools_ai`, `optimize_tool_parameters_ai`, `create_attack_chain_ai`, `discover_attack_chains`, `threat_hunting_assistant`, `correlate_threat_intelligence`, `vulnerability_intelligence_dashboard`, `monitor_cve_feeds`, `research_zero_day_opportunities`, `generate_exploit_from_cve`, `generate_payload`, `ai_generate_payload`, `advanced_payload_generation`, `ai_generate_attack_suite`, `ai_test_payload`, `bugbounty_*` (reconnaissance/osint/authentication_bypass/business_logic/file_upload/vulnerability_hunting/comprehensive_assessment)

## 2. Chains
- C1 web-surface: `subfinder_scan`/`amass_scan` → `dnsenum_scan` → `httpx_probe` → `katana_crawl`/`hakrawler_crawl`/`gau_discovery` → `gobuster_scan`/`ffuf_scan`/`dirsearch_scan` → `arjun_parameter_discovery`/`x8_parameter_discovery` → `nuclei_scan`/`nikto_scan` → `sqlmap_scan`/`dalfox_xss_scan`/`wpscan_analyze`
- C2 network: `rustscan_fast_scan` → `nmap_advanced_scan` (-sV/-sC) → `hydra_attack` → `hashcat_crack` → bolt `*_show`
- C3 AD: `enum4linux_ng_advanced`/`nbtscan_netbios`/`rpcclient_enumeration`/`smbmap_scan` → `netexec_scan` → `hydra_attack` → `metasploit_run`; AD roasting stays on bolt impacket_*
- C4 pwn/binary: `checksec_analyze` → `radare2_analyze`/`gdb_peda_debug` → `libc_database_lookup` → `one_gadget_search`/`ropgadget_search` → `pwntools_exploit`
- C5 forensics: `binwalk_analyze` → `foremost_carving`/`steghide_analysis`/`exiftool_extract`; memory: `volatility3_analyze`
- C6 cloud/k8s: `scout_suite_assessment`/`pacu_exploitation`/`prowler_scan` → `kube_hunter_scan`/`kube_bench_cis` → `trivy_scan`/`clair_vulnerability_scan`
- C7 AI-assisted: `ai_reconnaissance_workflow(target, depth)` → `ai_vulnerability_assessment` → `discover_attack_chains`/`create_attack_chain_ai` → payload suite; bugbounty flows for program-style targets
- C8 escape: `execute_command` (audit-logged; scoped commands only)

## 3. Rules
- One hexstrike call per chain step; on tool-not-found or timeout → immediate bolt fallback, note it in findings.
- Wordlists: HexStrike resolves its own; if a path param exists and you are unsure, request bolt `wordlist_recommend`/`wordlist_search` first.
- Never point chains at targets outside authorized scope. Record each finding with `report_finding` (command + raw output).
- If server restarts, re-run `server_health`; SSE connections drop on restart.
