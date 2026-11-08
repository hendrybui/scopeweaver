# ARTHEX-CLI — standalone headless engine

The ARTHEX engine (same as ScopeWeaver platform) decoupled: no UI, no postgres,
no scopeweaver/scopesentry. Runs like UnRealStrike — one process, one mission,
one report. Built from `cmd/artex-cli` in this repo.

## Build
    ARTEX_SKIP_FRONTEND=1 ARTEX_OUTPUT=$PWD/bin/artex ./build.sh   # platform binary
    CGO_ENABLED=0 go build -trimpath -ldflags='-s -w' -o bin/artex-cli ./cmd/artex-cli

## Config — artex-cli.yaml (repo root, chmod 600)
    base_url: http://127.0.0.1:20129/v1     # 9Router relay
    api_key: "<ARTEX_LLM_API_KEY from .env>"
    model: glm/glm-5.3-flash
    window_k: 128
    stream: true
    max_minutes: 15
    work_dir: ./cli-work
API key env override: ARTEX_CLI_API_KEY.

## Run
    ./bin/artex-cli -config artex-cli.yaml -mission MISSION.md
    ./bin/artex-cli -config artex-cli.yaml -m "inline mission"
    ./bin/artex-cli ... -session cli-123       # continue a session
    -q hides step lines (never use for audited runs — fabrication detection
    needs the [RUN] lines: model must SHOW its tool calls)
    -max-turns N step budget (0 = unlimited)

## Output
- Final report -> stdout AND cli-work/REPORT-<session>.md
- Per-session artifacts -> cli-work/sessions/<session>/ (evidence/, recon/, report.md)
- Transcript -> cli-work/transcripts/ (resumable)

## Canary harness integration (audit runs)
    Terminal A: ./us-canary-run.sh            (in UnrealStrike Labs/canary-harness)
    Terminal B: ./bin/artex-cli -config artex-cli.yaml -mission MISSION.md -max-turns 80
    Ctrl-D in A, claims.txt, python3 verdict.py — see BENCHMARK.md

## Known behaviors
- Bash tool = plain host exec (permission.ModeBypass), no sandbox. Scope-lock
  missions manually; the catastrophic-command floor (rm -rf /, fork bomb, disk
  writes) is hard-denied by norma.
- A model can fabricate tool output when it skips the tool call — the proof-file
  trick caught it: always verify disk/network effects for audited runs.
- Language: stock pentest prompt + English output by default in CLI missions.
