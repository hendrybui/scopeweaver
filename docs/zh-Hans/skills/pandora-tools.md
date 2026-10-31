# 主机工具

[English](../../../skills/pandora-tools/SKILL.md) · [한국어](../../ko/skills/pandora-tools.md) · 简体中文 · [繁體中文](../../zh-Hant/skills/pandora-tools.md) · [日本語](../../ja/skills/pandora-tools.md) · [Español](../../es/skills/pandora-tools.md)

主机的工具集已挂载到这里。主机的“二进制”几乎都是 shim、符号链接或 venv 入口,其 shebang 或目标为绝对主机路径,因此每个目录都按**原始路径**挂载:不要复制或移动。

## 1. 工具在哪里

```sh
ls /host/bin                 # 约 276 个主机 shim,位于 PATH 最前
ls /home/neocyan/.local/bin  # 约 305 个用户级工具 shim
ls /opt                      # 约 36 个工具目录(burpsuite、ghidra、ZAP、metasploit、beef、recon-ng 等)
ls /mnt/Pandora/Hack         # 攻击工具目录树
command -v <tool>            # 已有 470 多个名称可在 PATH 解析,先确认再下结论
```

`PATH` 以主机 shim 目录开头,其后是镜像自身路径。某工具不在 `/mnt/Pandora` 里,并不表示本容器没有。

## 2. 正确运行 venv 工具

主机 venv 基于 3.12、3.11、3.10、3.14。venv 的 `bin/python` 会经过 `/usr/bin/python3`,所以**要使用带版本的入口**,否则解释器与 venv 的 site-packages 不匹配:

```sh
/mnt/Pandora/Hack/BruteForceAI/.venv/bin/python tool.py      # 3.12 venv:普通入口即可
/mnt/Pandora/Open-Webui-data/.venv/bin/python3.11 tool.py    # 其他版本:bin/python<版本>
```

当工具按相对路径读取文件时先进入其目录;否则 `gophish` 打不开 `./VERSION` 会退出。若仍无法导入,绕过其入口:

```sh
PYTHONPATH=<venv>/lib/python<版本>/site-packages /usr/local/bin/python3.12 tool.py
```

主机级 pip 模块可在 `/usr/local/lib/python3.12/dist-packages` 读取(追加到 `sys.path` 末尾,镜像包优先)。

## 3. 本地路径难用时优先用 MCP 网关

主机的 `/usr/bin` 与 `/usr/sbin` 二进制默认不在 `PATH` 上——它们是针对比本镜像更新的 glibc 构建的。其中多数已作为 `bolt` MCP 工具暴露:

```
mcp__bolt__masscan_*  mcp__bolt__hydra_hydra  mcp__bolt__john_*  mcp__bolt__hashcat_crack
mcp__bolt__gobuster_dir  mcp__bolt__sslscan_*  mcp__bolt__sqlmap_*  mcp__bolt__wpscan_*
mcp__bolt__dnsx_dnsx_resolve  mcp__bolt__httpx  mcp__bolt__ffuf  mcp__bolt__impacket_kerberoast
```

本地缺失但上表已有的名称,直接调用 `mcp__bolt__*` 工具,不要再去翻二进制。

## 4. 仍需运行时的部分

- 没有 `docker` CLI 与 Docker socket → 主机的约 24 个 Dockerfile 与 18 个 compose 栈(`Workshop/HexSecTempest`、`Web_image/*` 等)无法在容器内启动。
- 没有 `java` → ghidra、ZAP、burpsuite。没有 `ruby` → metasploit、beef、evil-winrm、wpscan。
- 包在这些运行时之上的 wrapper 会以解释器缺失失败:先报告,不要盲目重试。

## 5. 陷阱

- 本容器以 root 运行,写入 `/mnt/Pandora` 的文件在主机上属 root。输出请用 `/mnt/Pandora/Hack/results/` 或 `/app/data`。
- `/mnt/Pandora/docker-lib` 是主机的 Docker 数据根目录:检索请限定子目录。
- 除 `/mnt/Pandora` 外均为只读。
- `error while loading shared libraries` 表示缺少未挂载的主机库:改用 MCP 等价工具或报告。
