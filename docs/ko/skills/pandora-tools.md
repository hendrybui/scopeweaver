# 호스트 도구 안내

[English](../../../skills/pandora-tools/SKILL.md) · 한국어 · [简体中文](../../zh-Hans/skills/pandora-tools.md) · [繁體中文](../../zh-Hant/skills/pandora-tools.md) · [日本語](../../ja/skills/pandora-tools.md) · [Español](../../es/skills/pandora-tools.md)

호스트의 도구 모음이 이 컨테이너에 바인드 마운트되어 있습니다. 호스트의 "바이너리"는 대부분 shim, 심볼릭 링크, venv 진입점이며 shebang이나 대상이 절대 호스트 경로입니다. 그래서 각 디렉터리를 **원래 경로**에 마운트합니다. 복사하거나 옮기면 깨집니다.

## 1. 도구가 있는 위치

```sh
ls /host/bin                 # 호스트 shim 약 276개, PATH 선두
ls /home/neocyan/.local/bin  # 사용자 수준 도구 shim 약 305개
ls /opt                      # 도구 트리 약 36개 (burpsuite, ghidra, ZAP, metasploit, beef, recon-ng 등)
ls /mnt/Pandora/Hack         # 공격 도구 트리
command -v <tool>            # 이미 PATH에서 470개 이상이 해석됩니다. 없다고 단정하기 전에 확인하세요
```

`PATH`는 호스트 shim 디렉터리들로 시작하고 그 뒤에 이미지 자체 경로가 옵니다. `/mnt/Pandora`에 없다고 해서 이 컨테이너에 없다는 뜻은 아닙니다.

## 2. venv 기반 도구를 올바르게 실행

호스트 venv는 3.12, 3.11, 3.10, 3.14로 만들어졌습니다. venv의 `bin/python`은 `/usr/bin/python3`을 거치므로 **버전이 붙은 진입점**을 사용하세요. 그렇지 않으면 인터프리터가 venv의 site-packages와 맞지 않습니다:

```sh
/mnt/Pandora/Hack/BruteForceAI/.venv/bin/python tool.py      # 3.12 venv: 일반 진입점으로 충분
/mnt/Pandora/Open-Webui-data/.venv/bin/python3.11 tool.py    # 다른 버전: bin/python<버전>
```

도구가 상대 경로로 파일을 읽으면 해당 디렉터리로 이동하세요. `gophish`는 `./VERSION`을 열지 못하면 종료합니다. 그래도 임포트가 안 되면 진입점을 우회합니다:

```sh
PYTHONPATH=<venv>/lib/python<버전>/site-packages /usr/local/bin/python3.12 tool.py
```

호스트 전역 pip 모듈은 `/usr/local/lib/python3.12/dist-packages`에서 읽을 수 있습니다(`sys.path` 뒤에 추가되므로 이미지 패키지가 우선합니다).

## 3. 로컬 경로가 까다로우면 MCP 게이트웨이를 우선

호스트의 `/usr/bin`과 `/usr/sbin` 바이너리는 기본 PATH에 없습니다. 이 이미지보다 최신 glibc로 빌드되었기 때문입니다. 대부분은 이미 `bolt` MCP 도구로 노출되어 있습니다:

```
mcp__bolt__masscan_*  mcp__bolt__hydra_hydra  mcp__bolt__john_*  mcp__bolt__hashcat_crack
mcp__bolt__gobuster_dir  mcp__bolt__sslscan_*  mcp__bolt__sqlmap_*  mcp__bolt__wpscan_*
mcp__bolt__dnsx_dnsx_resolve  mcp__bolt__httpx  mcp__bolt__ffuf  mcp__bolt__impacket_kerberoast
```

로컬에 없지만 위에 있는 이름은 바이너리를 찾지 말고 `mcp__bolt__*` 도구를 호출하세요.

## 4. 아직 런타임이 필요한 것

- `docker` CLI와 Docker 소켓이 없습니다 → 호스트의 Dockerfile 약 24개와 compose 스택 18개(`Workshop/HexSecTempest`, `Web_image/*` 등)는 안에서 시작할 수 없습니다.
- `java` 없음 → ghidra, ZAP, burpsuite. `ruby` 없음 → metasploit, beef, evil-winrm, wpscan.
- 위 런타임을 감싼 래퍼는 인터프리터 없음으로 실패합니다. 보고하고 무작정 재시도하지 마세요.

## 5. 함정

- 이 컨테이너는 root로 실행되므로 `/mnt/Pandora`에 쓴 파일은 호스트에서 root 소유가 됩니다. 출력은 `/mnt/Pandora/Hack/results/` 또는 `/app/data`를 사용하세요.
- `/mnt/Pandora/docker-lib`는 호스트의 Docker 데이터 루트입니다. 검색 범위를 하위 디렉터리로 좁히세요.
- `/mnt/Pandora`를 제외하면 모두 읽기 전용입니다.
- `error while loading shared libraries`는 마운트되지 않은 호스트 라이브러리가 필요하다는 뜻입니다. MCP 대응 도구를 쓰거나 보고하세요.
