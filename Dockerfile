# syntax=docker/dockerfile:1
# Build the frontend and binary from this checkout; no published image is required.
FROM --platform=$BUILDPLATFORM node:22-bookworm-slim AS frontend
WORKDIR /src/web
COPY web/package*.json ./
RUN npm ci
COPY web/ ./
COPY locale/definitions.json /src/locale/definitions.json
RUN npm run build:static

FROM --platform=$BUILDPLATFORM golang:1.26.3-bookworm AS backend
ARG TARGETOS=linux
ARG TARGETARCH
ARG VERSION=dev
WORKDIR /src
COPY go.mod go.sum ./
COPY third_party/norma/ ./third_party/norma/
RUN go mod download
COPY . .
COPY --from=frontend /src/web/out/ ./server/webui/dist/
RUN CGO_ENABLED=0 GOOS=${TARGETOS} GOARCH=${TARGETARCH} go build -tags embedui -trimpath \
    -ldflags "-s -w -X main.version=${VERSION}" -o /scopeweaver ./cmd/artex

# CLI only; the daemon stays on the host and is reached through the socket.
FROM docker:27-cli AS dockercli

# Trixie (glibc 2.41) rather than bookworm (2.36): the mounted host binaries are
# built for glibc 2.39, and on bookworm even the host's own `ls` fails with
# "version `GLIBC_2.38' not found".
FROM python:3.12-slim-trixie
# Runtime tools and Node 20 for Playwright. Browser installation occurs at build time.
# java and ruby exist because host tool trees wrap them (ghidra, ZAP, burpsuite,
# metasploit, beef, evil-winrm); the lib* entries are host binaries that failed
# with "error while loading shared libraries" when resolved through the mounts.
# trixie carries the t64 package renames.
RUN apt-get update && apt-get install -y --no-install-recommends \
      ca-certificates ripgrep curl wget vim git jq unzip \
      dnsutils iputils-ping netcat-openbsd inetutils-telnet whois nmap \
      iproute2 procps psmisc lsof \
      openjdk-21-jdk-headless ruby-full \
      libgomp1 libminizip1t64 libpcap0.8t64 liblua5.4-0 \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && rm -rf /var/lib/apt/lists/*
# Docker CLI + compose plugin, so host stacks can be driven from inside.
COPY --from=dockercli /usr/local/bin/docker /usr/local/bin/docker
COPY --from=dockercli /usr/local/libexec/docker/cli-plugins/ /usr/local/libexec/docker/cli-plugins/
RUN npm install -g @playwright/mcp@latest @playwright/cli@latest playwright@latest \
    && playwright-cli --help \
    && playwright install --with-deps chromium \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=backend /scopeweaver /app/scopeweaver
# The supervisor forwards SIGTERM and restarts after a self-update.
COPY start.sh /app/start.sh
RUN chmod +x /app/scopeweaver /app/start.sh
COPY skills/ /app/skills/
COPY LICENSE /app/LICENSE
COPY THIRD_PARTY_NOTICES.txt /app/THIRD_PARTY_NOTICES.txt
# Host tool trees are bind-mounted at their own path. Their venv entry points are
# symlinks through /usr/bin/python3, which Debian slim points at 3.11 while those
# venvs (and this image's /usr/local/bin/python3.12) are 3.12 — a version mismatch
# makes every mounted site-packages unimportable. Repoint it so mounted venvs
# resolve to the image's matching interpreter, and append the mounted host
# dist-packages via .pth so host-only modules stay importable without shadowing
# the image's own site-packages.
RUN ln -sf /usr/local/bin/python3.12 /usr/bin/python3 \
 && printf '%s\n' /usr/local/lib/python3.12/dist-packages \
      > /usr/local/lib/python3.12/site-packages/host-dist-packages.pth
VOLUME ["/app/data"]
EXPOSE 8787 8788
ENTRYPOINT ["/app/start.sh"]
CMD ["-addr", ":8787", "-proxy", ":8788"]
