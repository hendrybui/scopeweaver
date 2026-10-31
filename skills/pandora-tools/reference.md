# Host inventory (vantage: inside the agent container)

Snapshot of what the host exposes to this container. Regenerate the counts with:

```sh
ls /host/bin /home/neocyan/.local/bin /host/usrbin /host/usrsbin /opt/*/ 2>/dev/null \
  | grep -v / | sort -u | wc -l                                    # names offered
for n in $(...); do command -v "$n" >/dev/null && echo "$n"; done   # names that resolve
```

## Mounted host paths

| Path | What | Mode |
| --- | --- | --- |
| `/mnt/Pandora` | host tool tree, venvs, projects | rw |
| `/host/bin` | ~276 shims from the host `/usr/local/bin` (leads PATH) | ro |
| `/home/neocyan/.local/bin` | ~305 user-level shims | ro |
| `/opt` | ~36 tool trees (burpsuite, ghidra, ZAP, metasploit, beef, recon-ng, theHarvester, testssl.sh, spiderfoot …) | ro |
| `/home/neocyan/.local/share/uv` | interpreter homes for the 3.11/3.10/3.14 venvs | ro |
| `/home/neocyan/.local/share/pipx` | pipx venvs behind several shims | ro |
| `/host/usrbin`, `/host/usrsbin` | host system binaries (trail the image's own paths) | ro |
| `/host/lib`, `/host/share` | targets of *relative* symlinks in the two bin dirs | ro |
| `/usr/lib/{go-1.22,llvm-16..20}`, `/usr/share/sqlmap`, `/usr/lib/jvm/java-8-*` | targets of *absolute* symlinks, at parity | ro |
| `/usr/local/lib/python3.12/dist-packages` | host pip modules (appended via `.pth`) | ro |
| `/usr/lib/x86_64-linux-gnu/libfbclient.so.2`, `libidn.so.12`, `/usr/local/lib/libaircrack-*.so`, `/etc/john` | files/libs the image lacks | ro |
| `/var/run/docker.sock` | host Docker daemon | rw |

## Counts (measured here)

- ~5 500 host names offered on PATH, ~5 090 resolve.
- 610 dangling symlinks before the relative-link mirror mounts, 238 after; the rest go through `/etc/alternatives`, which the container resolves against its own packages.
- 118 host venvs: 103 on 3.12 (plain `bin/python` works), 12 on 3.11, 2 on 3.10, 1 on 3.14 (use `bin/python<ver>`).
- 42 stack files (24 Dockerfiles, 18 compose) drivable behind the mounted socket.
- Host `/usr/local/bin` alone holds ~276 entries and host `/usr/bin` ~2 000.

## Known-broken here (and why)

| Symptom | Cause | Do instead |
| --- | --- | --- |
| `error while loading shared libraries: libmysqlclient.so.21` | hydra's lib chain is not fully mounted | `mcp__bolt__hydra_hydra` |
| `tshark` missing `libwiretap` | the host itself lacks them | `tcpdump`, `nmap` |
| `sqlmap` → `No module named 'sqlmap'` | the wrapper expects its package on `sys.path` | `mcp__bolt__sqlmap_*` |
| `java`/`javac`/`jar` fine, but host `javac` shadow | image JRE/JDK chosen over the host JDK 8 tree | use the image's `javac` |
| A name missing entirely | lives only inside another container | check `mcp__bolt__*` first |

## Rules

- Mounts are at parity because the entries are shims: never copy or relocate one.
- Only `/mnt/Pandora` and the Docker socket are writable.
- `docker` here talks to the **host** daemon: every path passed on the command line must be a host path.
- Writes under `/mnt/Pandora` are root-owned on the host.
