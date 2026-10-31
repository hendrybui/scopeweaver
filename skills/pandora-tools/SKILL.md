---
name: pandora-tools
description: Use when a task needs a tool that lives on the host — the host tool tree under /mnt/Pandora, the host shim homes (/host/bin, ~/.local/bin, /opt, pipx venvs) or the host MCP gateway (mcp__bolt__*). Covers where things are, how to run them, and what still needs a runtime.
---

# Host tooling

English · [한국어](../../docs/ko/skills/pandora-tools.md) · [简体中文](../../docs/zh-Hans/skills/pandora-tools.md) · [繁體中文](../../docs/zh-Hant/skills/pandora-tools.md) · [日本語](../../docs/ja/skills/pandora-tools.md) · [Español](../../docs/es/skills/pandora-tools.md)

The host's tooling is bind-mounted here. Almost every host "binary" is a shim, a symlink or a venv entry point whose shebang or target is an absolute host path, so each directory is mounted at its **original path**: never copy or relocate one.

## 1. Where tools are

```sh
ls /host/bin                 # ~276 host shims; leads PATH
ls /home/neocyan/.local/bin  # ~305 user-level tool shims
ls /opt                      # ~36 tool trees (burpsuite, ghidra, ZAP, metasploit, beef, recon-ng, …)
ls /mnt/Pandora/Hack         # offensive toolkit tree
command -v <tool>            # 470+ names already resolve on PATH — check before assuming
```

`PATH` leads with the host shim directories, then the image's own paths. A tool missing from `/mnt/Pandora` is not necessarily missing from this container.

## 2. Run a venv-based tool correctly

Host venvs are built on 3.12, 3.11, 3.10 and 3.14. A venv's `bin/python` goes through `/usr/bin/python3`, so **use the versioned entry point** when one exists, otherwise the interpreter will not match the venv's site-packages:

```sh
/mnt/Pandora/Hack/BruteForceAI/.venv/bin/python tool.py      # 3.12 venv: plain entry is fine
/mnt/Pandora/Open-Webui-data/.venv/bin/python3.11 tool.py    # other versions: bin/python<ver>
```

`cd` into a tool's directory when it reads files by relative path — `gophish` opens `./VERSION` and dies otherwise. If a venv still cannot import, bypass its entry point:

```sh
PYTHONPATH=<venv>/lib/python<ver>/site-packages /usr/local/bin/python3.12 tool.py
```

Host-wide pip modules are readable at `/usr/local/lib/python3.12/dist-packages` (appended to `sys.path`, so image packages win).

## 3. Prefer the MCP gateway when the local path is hostile

The host's `/usr/bin` and `/usr/sbin` binaries are not on `PATH` by default — they are built against a newer glibc than this image. Most of them are already exposed as `bolt` MCP tools:

```
mcp__bolt__masscan_*          mcp__bolt__hydra_hydra     mcp__bolt__john_*
mcp__bolt__hashcat_crack      mcp__bolt__gobuster_dir    mcp__bolt__sslscan_*
mcp__bolt__sqlmap_*           mcp__bolt__wpscan_*        mcp__bolt__rustscan_*
mcp__bolt__dnsx_dnsx_resolve  mcp__bolt__httpx           mcp__bolt__ffuf
mcp__bolt__impacket_kerberoast  mcp__bolt__scoutsuite_*  mcp__bolt__smuggler_*
```

If a name is missing locally but covered above, call the `mcp__bolt__*` tool instead of hunting a binary.

## 4. What still needs a runtime

- No `docker` CLI and no Docker socket → the ~24 host Dockerfiles and 18 compose stacks (`Workshop/HexSecTempest`, `Web_image/*`, …) cannot be started from inside.
- No `java` → ghidra, ZAP, burpsuite. No `ruby` → metasploit, beef, evil-winrm, wpscan.
- A wrapper around one of those fails with a missing interpreter: report it, do not retry blindly.

## 5. Traps

- This container runs as root, so writes under `/mnt/Pandora` land root-owned on the host. Prefer `/mnt/Pandora/Hack/results/` or `/app/data`.
- `/mnt/Pandora/docker-lib` is the host's Docker data root: keep searches scoped to a subdirectory.
- Everything except `/mnt/Pandora` is read-only.
- `error while loading shared libraries` means the binary needs a host library that is not mounted — use the MCP equivalent or report it.
