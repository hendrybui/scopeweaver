# ホストツールツリーの手引き

[English](../../../skills/pandora-tools/SKILL.md) · [한국어](../../ko/skills/pandora-tools.md) · [简体中文](../../zh-Hans/skills/pandora-tools.md) · [繁體中文](../../zh-Hant/skills/pandora-tools.md) · 日本語 · [Español](../../es/skills/pandora-tools.md)

ホストのツールディスクは**同じ絶対パス**(`/mnt/Pandora`)でこのコンテナにバインドマウントされています。そのため、ホスト側で書かれた絶対パス(venv の shebang、設定ファイル、スクリプト引数)はここでもそのまま機能します。`/mnt/Pandora` が無い場合、この配備はホストのツールディスクを公開していないので `$PATH` のツールだけを使います。

## 1. まず確認する

```sh
ls /mnt/Pandora          # ホストのツール領域
ls /mnt/Pandora/Hack     # 存在すれば攻撃ツールツリー
```

この種の配備で `/mnt/Pandora/Hack` 配下に見られるもの: `Alien`、`BruteForceAI`、`DARKFLY`、`Hackagent`、`Hexsec`、`Red`、`scanner`、`wifi`、`evilginx2`、`gophish`(バイナリ)、`gophish.db`、`hexscan.py`、`results/`。

## 2. venv ベースのツールを正しく実行する

venv 自身のインタプリタを使います。このコンテナ内ではエントリが同じ 3.12 に解決されるため、venv の site-packages がインポートされます:

```sh
/mnt/Pandora/Hack/BruteForceAI/.venv/bin/python /mnt/Pandora/Hack/BruteForceAI/BruteForceAI.py --help
```

相対パスでデータを読むツールでは、先にそのディレクトリへ移動します。`gophish` は `./VERSION` を開くため、移動しないと終了します:

```sh
cd /mnt/Pandora/Hack && ./gophish
```

別のマイナーバージョン向けに作られた venv でインポートが失敗し続ける場合は、そのエントリを迂回します:

```sh
PYTHONPATH=<venv>/lib/python3.12/site-packages /usr/local/bin/python3.12 tool.py
```

ここで利用可能: python3.12、node 20、nmap、dig、whois、curl、wget、jq、git、ripgrep、telnet、netcat。ホスト全体の pip パッケージは `/usr/local/lib/python3.12/dist-packages` から読めます(読み取り専用マウント)。**利用不可**: ホストの `/usr/local/bin` の Go スキャナ、`docker` CLI、Docker ソケット — コンテナ内で `docker ...` は失敗します。

## 3. バイナリがローカルに無い場合は MCP ゲートウェイを優先する

ホストにのみ存在するツールバイナリは `bolt` MCP ゲートウェイの中で動きます。シェルで呼ぶ代わりに `mcp__bolt__*` ツールを呼びます:

```
mcp__bolt__dnsx_dnsx_resolve   mcp__bolt__httpx        mcp__bolt__ffuf
mcp__bolt__masscan_*           mcp__bolt__sqlmap_*     mcp__bolt__hydra_hydra
mcp__bolt__rustscan_*          mcp__bolt__wpscan_*     mcp__bolt__hashcat_crack
mcp__bolt__impacket_kerberoast mcp__bolt__gobuster_dir mcp__bolt__scoutsuite_*
```

## 4. 落とし穴

- このコンテナは root で動くため、ホストに書いたファイルは **root 所有**になります。出力は `/mnt/Pandora/Hack/results/` か `/app/data` を優先し、ツールが自分の隣に書く場合はその旨を伝えます。
- `/mnt/Pandora/docker-lib` はホストの **Docker データルート**(全 overlay レイヤー)です。ツリー全体ではなく `/mnt/Pandora/<領域>` に検索を絞ります。
- マウントは読み書き可です。ホストのツールを削除・移動せず、まず報告します。
- イメージには何もコピーされていません。マウントだけがこれらのパスの理由であり、ツールが隣に書いたファイルはコンテナより長く残ります。
