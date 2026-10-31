# ホストのツール

[English](../../../skills/pandora-tools/SKILL.md) · [한국어](../../ko/skills/pandora-tools.md) · [简体中文](../../zh-Hans/skills/pandora-tools.md) · [繁體中文](../../zh-Hant/skills/pandora-tools.md) · 日本語 · [Español](../../es/skills/pandora-tools.md)

ホストのツール群はここにバインドマウントされています。ホストの「バイナリ」はほぼ shim、シンボリックリンク、venv のエントリで、shebang や参照先は絶対ホストパスです。そのため各ディレクトリは**元のパス**にマウントします。コピーや移動をすると壊れます。

## 1. ツールの場所

```sh
ls /host/bin                 # 約 276 個のホスト shim。PATH の先頭
ls /home/neocyan/.local/bin  # 約 305 個のユーザー側 shim
ls /opt                      # 約 36 個のツリー(burpsuite、ghidra、ZAP、metasploit、beef、recon-ng など)
ls /mnt/Pandora/Hack         # 攻撃ツールツリー
command -v <tool>            # すでに 470 件以上が PATH で解決します。判断の前に確認を
```

`PATH` はホストの shim ディレクトリが先頭で、その後ろにイメージ自身のパスが続きます。`/mnt/Pandora` に無いからといって、このコンテナに無いとは限りません。

## 2. venv ベースのツールを正しく実行する

ホストの venv は 3.12、3.11、3.10、3.14 です。venv の `bin/python` は `/usr/bin/python3` を経由するため、**バージョン付きのエントリ**を使ってください。そうしないとインタプリタが venv の site-packages と一致しません:

```sh
/mnt/Pandora/Hack/BruteForceAI/.venv/bin/python tool.py      # 3.12 venv:通常のエントリで可
/mnt/Pandora/Open-Webui-data/.venv/bin/python3.11 tool.py    # 他バージョン:bin/python<版>
```

相対パスでファイルを読むツールでは先にそのディレクトリへ移動します。`gophish` は `./VERSION` を開けないと終了します。それでもインポートできない場合はエントリを迂回します:

```sh
PYTHONPATH=<venv>/lib/python<版>/site-packages /usr/local/bin/python3.12 tool.py
```

ホスト全体の pip モジュールは `/usr/local/lib/python3.12/dist-packages` から読めます(`sys.path` の末尾に追加され、イメージ側が優先されます)。

## 3. ローカルパスが厄介なときは MCP ゲートウェイを優先

ホストの `/usr/bin` と `/usr/sbin` のバイナリは既定で `PATH` にありません。このイメージより新しい glibc 向けにビルドされているためです。多くはすでに `bolt` MCP ツールとして公開されています:

```
mcp__bolt__masscan_*  mcp__bolt__hydra_hydra  mcp__bolt__john_*  mcp__bolt__hashcat_crack
mcp__bolt__gobuster_dir  mcp__bolt__sslscan_*  mcp__bolt__sqlmap_*  mcp__bolt__wpscan_*
mcp__bolt__dnsx_dnsx_resolve  mcp__bolt__httpx  mcp__bolt__ffuf  mcp__bolt__impacket_kerberoast
```

ローカルに無いが上表にある名前は、バイナリを探さず `mcp__bolt__*` を呼びます。

## 4. ランタイムがまだ必要なもの

- `docker` CLI と Docker ソケットなし → ホストの約 24 個の Dockerfile と 18 個の compose スタック(`Workshop/HexSecTempest`、`Web_image/*` など)は中から起動できません。
- `java` なし → ghidra、ZAP、burpsuite。`ruby` なし → metasploit、beef、evil-winrm、wpscan。
- これらのランタイムを包む wrapper はインタプリタ不在で失敗します。報告し、闇雲に再試行しないこと。

## 5. 落とし穴

- root で動くため、`/mnt/Pandora` への書き込みはホスト側で root 所有になります。出力は `/mnt/Pandora/Hack/results/` か `/app/data` へ。
- `/mnt/Pandora/docker-lib` はホストの Docker データルートです。検索範囲を狭めてください。
- `/mnt/Pandora` 以外は読み取り専用です。
- `error while loading shared libraries` は未マウントのホストライブラリ不足です。MCP の同等ツールを使うか報告してください。
