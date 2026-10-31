---
name: pandora-tools
description: Use when a task needs a tool that lives on the host tool tree under /mnt/Pandora (host-installed scanners, venv-based Python tools, gophish, evilginx) or on the host MCP gateway (mcp__bolt__*). Covers what is mounted, how to run it, and the traps.
---

# Host tool tree

English · [한국어](../../docs/ko/skills/pandora-tools.md) · [简体中文](../../docs/zh-Hans/skills/pandora-tools.md) · [繁體中文](../../docs/zh-Hant/skills/pandora-tools.md) · [日本語](../../docs/ja/skills/pandora-tools.md) · [Español](../../docs/es/skills/pandora-tools.md)

The host tool disk is bind-mounted into this container at the **same absolute path** (`/mnt/Pandora`), so absolute paths written on the host — venv shebangs, config files, script arguments — keep working here. If `/mnt/Pandora` does not exist, this deployment does not export a host tool disk; use `$PATH` tools only.

## 1. Start here

```sh
ls /mnt/Pandora          # host tool areas
ls /mnt/Pandora/Hack     # offensive toolkit tree, if present
```

Areas seen under `/mnt/Pandora/Hack` in this style of deployment: `Alien`, `BruteForceAI`, `DARKFLY`, `Hackagent`, `Hexsec`, `Red`, `scanner`, `wifi`, `evilginx2`, `gophish` (binary), `gophish.db`, `hexscan.py`, `results/`.

## 2. Run a venv-based tool correctly

Use the venv's own interpreter. Its entry point resolves to a matching 3.12 inside this container, so the venv's site-packages import:

```sh
/mnt/Pandora/Hack/BruteForceAI/.venv/bin/python /mnt/Pandora/Hack/BruteForceAI/BruteForceAI.py --help
```

`cd` into the tool's directory first when it loads data by relative path — `gophish` opens `./VERSION` and dies otherwise:

```sh
cd /mnt/Pandora/Hack && ./gophish
```

If a venv still cannot import (a venv built for another minor version), bypass its entry point:

```sh
PYTHONPATH=<venv>/lib/python3.12/site-packages /usr/local/bin/python3.12 tool.py
```

Available here: python3.12, node 20, nmap, dig, whois, curl, wget, jq, git, ripgrep, telnet, netcat. Host-wide pip packages are readable at `/usr/local/lib/python3.12/dist-packages` (read-only mount). **Not** available: the host's `/usr/local/bin` Go scanners, the `docker` CLI and the Docker socket — a `docker ...` call inside this container fails.

## 3. Prefer the MCP gateway when the binary is not local

Tool binaries that exist only on the host run inside the `bolt` MCP gateway; call the `mcp__bolt__*` tools instead of shelling out:

```
mcp__bolt__dnsx_dnsx_resolve   mcp__bolt__httpx        mcp__bolt__ffuf
mcp__bolt__masscan_*           mcp__bolt__sqlmap_*     mcp__bolt__hydra_hydra
mcp__bolt__rustscan_*          mcp__bolt__wpscan_*     mcp__bolt__hashcat_crack
mcp__bolt__impacket_kerberoast mcp__bolt__gobuster_dir mcp__bolt__scoutsuite_*
```

## 4. Traps

- Writes land **root-owned** on the host: this container runs as root. Prefer `/mnt/Pandora/Hack/results/` or `/app/data` for output, and say so when a tool writes beside itself.
- `/mnt/Pandora/docker-lib` is the host's **Docker data root** (every overlay layer). Keep searches scoped to `/mnt/Pandora/<area>` instead of the whole tree.
- The mount is read-write. Do not delete or move host tools; report instead.
- Nothing is copied into the image — the mount is the only reason these paths exist. Files a tool writes beside itself survive the container.
