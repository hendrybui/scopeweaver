# 主機工具

[English](../../../skills/pandora-tools/SKILL.md) · [한국어](../../ko/skills/pandora-tools.md) · [简体中文](../../zh-Hans/skills/pandora-tools.md) · 繁體中文 · [日本語](../../ja/skills/pandora-tools.md) · [Español](../../es/skills/pandora-tools.md)

主機的工具集已掛載到此處。主機的「二進位」幾乎都是 shim、符號連結或 venv 入口,其 shebang 或目標為絕對主機路徑,因此每個目錄都按**原始路徑**掛載:不要複製或移動。

## 1. 工具在哪裡

```sh
ls /host/bin                 # 約 276 個主機 shim,位於 PATH 最前
ls /home/neocyan/.local/bin  # 約 305 個使用者層級工具 shim
ls /opt                      # 約 36 個工具目錄(burpsuite、ghidra、ZAP、metasploit、beef、recon-ng 等)
ls /mnt/Pandora/Hack         # 攻擊工具目錄樹
command -v <tool>            # 已有 470 多個名稱可在 PATH 解析,先確認再下結論
```

`PATH` 以主機 shim 目錄開頭,其後是映像檔自身路徑。某工具不在 `/mnt/Pandora` 裡,並不表示本容器沒有。

## 2. 正確執行 venv 工具

主機 venv 基於 3.12、3.11、3.10、3.14。venv 的 `bin/python` 會經過 `/usr/bin/python3`,所以**要使用帶版本的入口**,否則解譯器與 venv 的 site-packages 不符:

```sh
/mnt/Pandora/Hack/BruteForceAI/.venv/bin/python tool.py      # 3.12 venv:一般入口即可
/mnt/Pandora/Open-Webui-data/.venv/bin/python3.11 tool.py    # 其他版本:bin/python<版本>
```

當工具以相對路徑讀取檔案時先進入其目錄;否則 `gophish` 打不開 `./VERSION` 會結束。若仍無法匯入,繞過其入口:

```sh
PYTHONPATH=<venv>/lib/python<版本>/site-packages /usr/local/bin/python3.12 tool.py
```

主機層級 pip 模組可在 `/usr/local/lib/python3.12/dist-packages` 讀取(附加到 `sys.path` 末尾,映像檔套件優先)。

## 3. 本機路徑難用時優先使用 MCP 閘道

主機的 `/usr/bin` 與 `/usr/sbin` 二進位預設不在 `PATH` 上——它們是針對比本映像檔更新的 glibc 建置的。其中多數已作為 `bolt` MCP 工具暴露:

```
mcp__bolt__masscan_*  mcp__bolt__hydra_hydra  mcp__bolt__john_*  mcp__bolt__hashcat_crack
mcp__bolt__gobuster_dir  mcp__bolt__sslscan_*  mcp__bolt__sqlmap_*  mcp__bolt__wpscan_*
mcp__bolt__dnsx_dnsx_resolve  mcp__bolt__httpx  mcp__bolt__ffuf  mcp__bolt__impacket_kerberoast
```

本機缺少但上表已有的名稱,直接呼叫 `mcp__bolt__*` 工具,不要再去翻二進位。

## 4. 仍需執行環境的部分

- 沒有 `docker` CLI 與 Docker socket → 主機的約 24 個 Dockerfile 與 18 個 compose 堆疊(`Workshop/HexSecTempest`、`Web_image/*` 等)無法在容器內啟動。
- 沒有 `java` → ghidra、ZAP、burpsuite。沒有 `ruby` → metasploit、beef、evil-winrm、wpscan。
- 包在這些執行環境之上的 wrapper 會以解譯器缺少失敗:先回報,不要盲目重試。

## 5. 陷阱

- 本容器以 root 執行,寫入 `/mnt/Pandora` 的檔案在主機上屬 root。輸出請用 `/mnt/Pandora/Hack/results/` 或 `/app/data`。
- `/mnt/Pandora/docker-lib` 是主機的 Docker 資料根目錄:檢索請限定子目錄。
- 除 `/mnt/Pandora` 外均為唯讀。
- `error while loading shared libraries` 表示缺少未掛載的主機函式庫:改用 MCP 等價工具或回報。
