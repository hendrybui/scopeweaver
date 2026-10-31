# 호스트 도구 트리 안내

[English](../../../skills/pandora-tools/SKILL.md) · 한국어 · [简体中文](../../zh-Hans/skills/pandora-tools.md) · [繁體中文](../../zh-Hant/skills/pandora-tools.md) · [日本語](../../ja/skills/pandora-tools.md) · [Español](../../es/skills/pandora-tools.md)

호스트 도구 디스크는 컨테이너 안에서 **동일한 절대 경로**(`/mnt/Pandora`)로 바인드 마운트됩니다. 따라서 호스트에서 작성한 절대 경로(venv shebang, 설정 파일, 스크립트 인자)가 그대로 동작합니다. `/mnt/Pandora`가 없으면 이 배포 환경이 호스트 도구 디스크를 내보내지 않는 것이므로 `$PATH` 도구만 사용합니다.

## 1. 먼저 확인

```sh
ls /mnt/Pandora          # 호스트 도구 영역
ls /mnt/Pandora/Hack     # 있다면 공격 도구 트리
```

이런 배포에서 `/mnt/Pandora/Hack` 아래에서 볼 수 있는 항목: `Alien`, `BruteForceAI`, `DARKFLY`, `Hackagent`, `Hexsec`, `Red`, `scanner`, `wifi`, `evilginx2`, `gophish`(바이너리), `gophish.db`, `hexscan.py`, `results/`.

## 2. venv 기반 도구를 올바르게 실행

venv 자체 인터프리터를 사용합니다. 이 컨테이너 안에서 진입점이 동일한 3.12로 해석되므로 venv의 site-packages가 임포트됩니다:

```sh
/mnt/Pandora/Hack/BruteForceAI/.venv/bin/python /mnt/Pandora/Hack/BruteForceAI/BruteForceAI.py --help
```

도구가 상대 경로로 데이터를 읽으면 먼저 해당 디렉터리로 이동합니다. `gophish`는 `./VERSION`을 열기 때문에 그렇지 않으면 종료됩니다:

```sh
cd /mnt/Pandora/Hack && ./gophish
```

다른 마이너 버전용으로 만들어진 venv라서 임포트가 계속 실패하면 진입점을 우회합니다:

```sh
PYTHONPATH=<venv>/lib/python3.12/site-packages /usr/local/bin/python3.12 tool.py
```

여기에서 사용 가능: python3.12, node 20, nmap, dig, whois, curl, wget, jq, git, ripgrep, telnet, netcat. 호스트 전역 pip 패키지는 `/usr/local/lib/python3.12/dist-packages`에서 읽을 수 있습니다(읽기 전용 마운트). 사용 **불가**: 호스트의 `/usr/local/bin` Go 스캐너, `docker` CLI, Docker 소켓 — 이 컨테이너 안에서 `docker ...`는 실패합니다.

## 3. 바이너리가 로컬에 없으면 MCP 게이트웨이를 우선

호스트에만 있는 도구 바이너리는 `bolt` MCP 게이트웨이 안에서 실행됩니다. 셸로 부르는 대신 `mcp__bolt__*` 도구를 호출합니다:

```
mcp__bolt__dnsx_dnsx_resolve   mcp__bolt__httpx        mcp__bolt__ffuf
mcp__bolt__masscan_*           mcp__bolt__sqlmap_*     mcp__bolt__hydra_hydra
mcp__bolt__rustscan_*          mcp__bolt__wpscan_*     mcp__bolt__hashcat_crack
mcp__bolt__impacket_kerberoast mcp__bolt__gobuster_dir mcp__bolt__scoutsuite_*
```

## 4. 함정

- 이 컨테이너는 root로 실행되므로 호스트에 쓰는 파일은 **root 소유**가 됩니다. 출력은 `/mnt/Pandora/Hack/results/` 또는 `/app/data`를 권장하고, 도구가 자기 옆에 파일을 쓰면 이를 알립니다.
- `/mnt/Pandora/docker-lib`는 호스트의 **Docker 데이터 루트**(모든 overlay 레이어)입니다. 전체 트리 대신 `/mnt/Pandora/<영역>`으로 검색 범위를 좁힙니다.
- 마운트는 읽기/쓰기입니다. 호스트 도구를 삭제하거나 옮기지 말고 보고합니다.
- 이미지에 복사된 것은 없습니다. 마운트가 이 경로들의 유일한 이유이며, 도구가 스스로 옆에 쓰는 파일은 컨테이너보다 오래 남습니다.
