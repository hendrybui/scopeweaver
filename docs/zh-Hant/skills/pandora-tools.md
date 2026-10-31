# 主機工具目錄指引

[English](../../../skills/pandora-tools/SKILL.md) · [한국어](../../ko/skills/pandora-tools.md) · [简体中文](../../zh-Hans/skills/pandora-tools.md) · 繁體中文 · [日本語](../../ja/skills/pandora-tools.md) · [Español](../../es/skills/pandora-tools.md)

主機工具磁碟以**相同的絕對路徑**(`/mnt/Pandora`)綁定掛載到本容器中,因此在主機上寫下的絕對路徑(venv shebang、設定檔、腳本參數)在這裡仍然有效。若 `/mnt/Pandora` 不存在,表示本部署沒有匯出主機工具磁碟,請只使用 `$PATH` 中的工具。

## 1. 先看這裡

```sh
ls /mnt/Pandora          # 主機工具區域
ls /mnt/Pandora/Hack     # 若存在,為攻擊工具目錄樹
```

此類部署中 `/mnt/Pandora/Hack` 下可見的項目:`Alien`、`BruteForceAI`、`DARKFLY`、`Hackagent`、`Hexsec`、`Red`、`scanner`、`wifi`、`evilginx2`、`gophish`(二進位)、`gophish.db`、`hexscan.py`、`results/`。

## 2. 正確執行 venv 工具

使用 venv 自己的解譯器:其入口在本容器內解析為同一個 3.12,因此 venv 的 site-packages 可以匯入:

```sh
/mnt/Pandora/Hack/BruteForceAI/.venv/bin/python /mnt/Pandora/Hack/BruteForceAI/BruteForceAI.py --help
```

當工具以相對路徑讀取資料時,先進入該目錄;否則 `gophish` 打不開 `./VERSION` 並直接結束:

```sh
cd /mnt/Pandora/Hack && ./gophish
```

若 venv 仍無法匯入(該 venv 是為其他小版本建立的),繞過其入口:

```sh
PYTHONPATH=<venv>/lib/python3.12/site-packages /usr/local/bin/python3.12 tool.py
```

主機層級 pip 套件可在 `/usr/local/lib/python3.12/dist-packages` 讀取(唯讀掛載)。**不可用**:主機的 `/usr/local/bin` Go 掃描器、`docker` CLI 與 Docker socket——在容器內執行 `docker ...` 會失敗。

## 3. 本機沒有二進位時優先使用 MCP 閘道

只存在於主機的工具二進位執行在 `bolt` MCP 閘道內;請呼叫 `mcp__bolt__*` 工具而不是走 shell:

```
mcp__bolt__dnsx_dnsx_resolve   mcp__bolt__httpx        mcp__bolt__ffuf
mcp__bolt__masscan_*           mcp__bolt__sqlmap_*     mcp__bolt__hydra_hydra
mcp__bolt__rustscan_*          mcp__bolt__wpscan_*     mcp__bolt__hashcat_crack
mcp__bolt__impacket_kerberoast mcp__bolt__gobuster_dir mcp__bolt__scoutsuite_*
```

## 4. 陷阱

- 本容器以 root 執行,寫入主機的檔案擁有者為 **root**。輸出建議放在 `/mnt/Pandora/Hack/results/` 或 `/app/data`,並在工具就地寫檔時說明。
- `/mnt/Pandora/docker-lib` 是主機的 **Docker 資料根目錄**(包含全部 overlay 層)。檢索請限定到 `/mnt/Pandora/<區域>`,不要掃整棵樹。
- 掛載為讀寫。不要刪除或移動主機工具,先回報。
- 映像檔中沒有複製任何內容——掛載是這些路徑存在的唯一原因。工具就地寫入的檔案會長期留在主機上。
