# Guía del árbol de herramientas del host

[English](../../../skills/pandora-tools/SKILL.md) · [한국어](../../ko/skills/pandora-tools.md) · [简体中文](../../zh-Hans/skills/pandora-tools.md) · [繁體中文](../../zh-Hant/skills/pandora-tools.md) · [日本語](../../ja/skills/pandora-tools.md) · Español

El disco de herramientas del host se monta en este contenedor en la **misma ruta absoluta** (`/mnt/Pandora`), de modo que las rutas absolutas escritas en el host —shebangs de venv, archivos de configuración, argumentos de scripts— siguen funcionando aquí. Si `/mnt/Pandora` no existe, esta implementación no exporta un disco de herramientas; use solo las herramientas de `$PATH`.

## 1. Empiece aquí

```sh
ls /mnt/Pandora          # áreas de herramientas del host
ls /mnt/Pandora/Hack     # árbol de herramientas ofensivas, si existe
```

Áreas vistas en `/mnt/Pandora/Hack` en este tipo de implementación: `Alien`, `BruteForceAI`, `DARKFLY`, `Hackagent`, `Hexsec`, `Red`, `scanner`, `wifi`, `evilginx2`, `gophish` (binario), `gophish.db`, `hexscan.py`, `results/`.

## 2. Ejecutar correctamente una herramienta basada en venv

Use el intérprete propio del venv. Su punto de entrada se resuelve a un 3.12 coincidente dentro de este contenedor, así que los site-packages del venv se importan:

```sh
/mnt/Pandora/Hack/BruteForceAI/.venv/bin/python /mnt/Pandora/Hack/BruteForceAI/BruteForceAI.py --help
```

Entre al directorio de la herramienta cuando cargue datos por ruta relativa: `gophish` abre `./VERSION` y termina si no lo hace:

```sh
cd /mnt/Pandora/Hack && ./gophish
```

Si un venv sigue sin importar (venv creado para otra versión menor), evite su punto de entrada:

```sh
PYTHONPATH=<venv>/lib/python3.12/site-packages /usr/local/bin/python3.12 tool.py
```

Disponible aquí: python3.12, node 20, nmap, dig, whois, curl, wget, jq, git, ripgrep, telnet, netcat. Los paquetes pip del host son legibles en `/usr/local/lib/python3.12/dist-packages` (montaje de solo lectura). **No** disponible: los escáneres Go de `/usr/local/bin` del host, la CLI de `docker` ni el socket de Docker: dentro de este contenedor `docker ...` falla.

## 3. Prefiera la puerta de enlace MCP si el binario no es local

Los binarios que solo existen en el host se ejecutan dentro de la puerta de enlace MCP `bolt`; llame a las herramientas `mcp__bolt__*` en lugar de invocar el shell:

```
mcp__bolt__dnsx_dnsx_resolve   mcp__bolt__httpx        mcp__bolt__ffuf
mcp__bolt__masscan_*           mcp__bolt__sqlmap_*     mcp__bolt__hydra_hydra
mcp__bolt__rustscan_*          mcp__bolt__wpscan_*     mcp__bolt__hashcat_crack
mcp__bolt__impacket_kerberoast mcp__bolt__gobuster_dir mcp__bolt__scoutsuite_*
```

## 4. Trampas

- Las escrituras quedan con propietario **root** en el host: este contenedor corre como root. Prefiera `/mnt/Pandora/Hack/results/` o `/app/data` para la salida y avise cuando una herramienta escriba a su lado.
- `/mnt/Pandora/docker-lib` es el **directorio de datos de Docker** del host (todas las capas overlay). Limite las búsquedas a `/mnt/Pandora/<área>` en lugar de todo el árbol.
- El montaje es de lectura y escritura. No borre ni mueva herramientas del host; repórtelo.
- Nada se copia a la imagen: el montaje es la única razón de que estas rutas existan. Los archivos que una herramienta escribe a su lado sobreviven al contenedor.
