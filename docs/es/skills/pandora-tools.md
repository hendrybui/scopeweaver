# Herramientas del host

[English](../../../skills/pandora-tools/SKILL.md) · [한국어](../../ko/skills/pandora-tools.md) · [简体中文](../../zh-Hans/skills/pandora-tools.md) · [繁體中文](../../zh-Hant/skills/pandora-tools.md) · [日本語](../../ja/skills/pandora-tools.md) · Español

Las herramientas del host están montadas aquí. Casi todo "binario" del host es un shim, un enlace simbólico o el punto de entrada de un venv cuyo shebang o destino es una ruta absoluta del host, así que cada directorio se monta en su **ruta original**: no copie ni mueva ninguno.

## 1. Dónde están las herramientas

```sh
ls /host/bin                 # ~276 shims del host; encabeza PATH
ls /home/neocyan/.local/bin  # ~305 shims de usuario
ls /opt                      # ~36 árboles (burpsuite, ghidra, ZAP, metasploit, beef, recon-ng, …)
ls /mnt/Pandora/Hack         # árbol de herramientas ofensivas
command -v <tool>            # 470+ nombres ya resuelven en PATH: compruebe antes de asumir
```

`PATH` empieza por los directorios de shims del host y luego las rutas de la imagen. Que algo no esté en `/mnt/Pandora` no significa que falte en este contenedor.

## 2. Ejecutar correctamente una herramienta basada en venv

Los venv del host son 3.12, 3.11, 3.10 y 3.14. El `bin/python` de un venv pasa por `/usr/bin/python3`, así que **use el punto de entrada con versión** cuando exista; si no, el intérprete no coincidirá con los site-packages del venv:

```sh
/mnt/Pandora/Hack/BruteForceAI/.venv/bin/python tool.py      # venv 3.12: la entrada simple sirve
/mnt/Pandora/Open-Webui-data/.venv/bin/python3.11 tool.py    # otras versiones: bin/python<ver>
```

Entre al directorio de la herramienta cuando lea archivos por ruta relativa: `gophish` abre `./VERSION` y termina si no. Si un venv sigue sin importar, evite su punto de entrada:

```sh
PYTHONPATH=<venv>/lib/python<ver>/site-packages /usr/local/bin/python3.12 tool.py
```

Los módulos pip del host son legibles en `/usr/local/lib/python3.12/dist-packages` (se añade al final de `sys.path`, así que los paquetes de la imagen ganan).

## 3. Prefiera la puerta de enlace MCP si la ruta local es hostil

Los binarios de `/usr/bin` y `/usr/sbin` del host no están en `PATH` por defecto: están compilados contra una glibc más nueva que esta imagen. La mayoría ya se expone como herramientas MCP de `bolt`:

```
mcp__bolt__masscan_*  mcp__bolt__hydra_hydra  mcp__bolt__john_*  mcp__bolt__hashcat_crack
mcp__bolt__gobuster_dir  mcp__bolt__sslscan_*  mcp__bolt__sqlmap_*  mcp__bolt__wpscan_*
mcp__bolt__dnsx_dnsx_resolve  mcp__bolt__httpx  mcp__bolt__ffuf  mcp__bolt__impacket_kerberoast
```

Si un nombre falta localmente pero está arriba, llame a la herramienta `mcp__bolt__*` en lugar de buscar el binario.

## 4. Lo que aún necesita un runtime

- Sin CLI `docker` ni socket de Docker → los ~24 Dockerfiles y 18 stacks compose del host (`Workshop/HexSecTempest`, `Web_image/*`, …) no se pueden iniciar desde dentro.
- Sin `java` → ghidra, ZAP, burpsuite. Sin `ruby` → metasploit, beef, evil-winrm, wpscan.
- Un envoltorio sobre esos runtimes falla por intérprete ausente: repórtelo, no reintente a ciegas.

## 5. Trampas

- El contenedor corre como root: lo que escriba en `/mnt/Pandora` queda con propietario root en el host. Use `/mnt/Pandora/Hack/results/` o `/app/data`.
- `/mnt/Pandora/docker-lib` es el directorio de datos de Docker del host: limite las búsquedas.
- Todo salvo `/mnt/Pandora` es de solo lectura.
- `error while loading shared libraries` significa que falta una biblioteca del host no montada: use el equivalente MCP o repórtelo.
