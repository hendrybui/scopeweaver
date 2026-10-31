# 主机工具目录指引

[English](../../../skills/pandora-tools/SKILL.md) · [한국어](../../ko/skills/pandora-tools.md) · 简体中文 · [繁體中文](../../zh-Hant/skills/pandora-tools.md) · [日本語](../../ja/skills/pandora-tools.md) · [Español](../../es/skills/pandora-tools.md)

主机工具磁盘以**相同的绝对路径**(`/mnt/Pandora`)绑定挂载到本容器中,因此在主机上写下的绝对路径(venv shebang、配置文件、脚本参数)在这里继续有效。若 `/mnt/Pandora` 不存在,说明本部署没有导出主机工具磁盘,请只使用 `$PATH` 中的工具。

## 1. 先看这里

```sh
ls /mnt/Pandora          # 主机工具区域
ls /mnt/Pandora/Hack     # 若存在,为攻击工具目录树
```

此类部署中 `/mnt/Pandora/Hack` 下可见的条目:`Alien`、`BruteForceAI`、`DARKFLY`、`Hackagent`、`Hexsec`、`Red`、`scanner`、`wifi`、`evilginx2`、`gophish`(二进制)、`gophish.db`、`hexscan.py`、`results/`。

## 2. 正确运行 venv 工具

使用 venv 自己的解释器:其入口在本容器内解析为同一 3.12,因此 venv 的 site-packages 可以导入:

```sh
/mnt/Pandora/Hack/BruteForceAI/.venv/bin/python /mnt/Pandora/Hack/BruteForceAI/BruteForceAI.py --help
```

当工具按相对路径读取数据时,先进入该目录;否则 `gophish` 打不开 `./VERSION` 并直接退出:

```sh
cd /mnt/Pandora/Hack && ./gophish
```

若 venv 仍无法导入(该 venv 是为其他小版本创建的),绕过其入口:

```sh
PYTHONPATH=<venv>/lib/python3.12/site-packages /usr/local/bin/python3.12 tool.py
```

本容器可用:python3.12、node 20、nmap、dig、whois、curl、wget、jq、git、ripgrep、telnet、netcat。主机级 pip 包可在 `/usr/local/lib/python3.12/dist-packages` 读取(只读挂载)。**不可用**:主机的 `/usr/local/bin` Go 扫描器、`docker` CLI 与 Docker socket——在容器内执行 `docker ...` 会失败。

## 3. 本地没有二进制时优先用 MCP 网关

只存在于主机的工具二进制运行在 `bolt` MCP 网关内;请调用 `mcp__bolt__*` 工具而不是走 shell:

```
mcp__bolt__dnsx_dnsx_resolve   mcp__bolt__httpx        mcp__bolt__ffuf
mcp__bolt__masscan_*           mcp__bolt__sqlmap_*     mcp__bolt__hydra_hydra
mcp__bolt__rustscan_*          mcp__bolt__wpscan_*     mcp__bolt__hashcat_crack
mcp__bolt__impacket_kerberoast mcp__bolt__gobuster_dir mcp__bolt__scoutsuite_*
```

## 4. 陷阱

- 本容器以 root 运行,写入主机的文件属主为 **root**。输出建议放在 `/mnt/Pandora/Hack/results/` 或 `/app/data`,并在工具就地写文件时说明。
- `/mnt/Pandora/docker-lib` 是主机的 **Docker 数据根目录**(包含全部 overlay 层)。检索请限定到 `/mnt/Pandora/<区域>`,不要扫整棵树。
- 挂载为读写。不要删除或移动主机工具,先报告。
- 镜像中没有复制任何内容——挂载是这些路径存在的唯一原因。工具就地写入的文件会长期留在主机上。
