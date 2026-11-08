// artex-cli — standalone headless ARTEX engine.
//
// The SAME engine that powers the ScopeWeaver platform (agent.ChatAgent +
// norma toolbelt + the stock "pentest" system prompt), decoupled:
//   - no HTTP server, no web UI
//   - no postgres / findings platform
//   - LLM from a YAML file or flags (openai-compatible, anthropic, ollama)
//
// Mission in (file or -m) -> autonomous tool loop (Bash/Read/Write/Edit/LS/
// Glob/Grep) -> final report to stdout + REPORT file in the work dir.
//
// ScopeWeaver / ScopeSentry are NOT involved. This binary runs like
// UnRealStrike: one process, one mission, one report.
//
// Examples:
//   artex-cli -config artex-cli.yaml -mission MISSION.md
//   artex-cli -config artex-cli.yaml -m "scan http://127.0.0.1:8806 and exploit"
//   artex-cli -config artex-cli.yaml -mission MISSION.md -session cli-1   # continue
package main

import (
	"context"
	"encoding/json"
	"flag"
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/Autumn-27/artex/agent"
	"github.com/Autumn-27/artex/db"
	"github.com/Autumn-27/norma/transcript"
	actool "github.com/Autumn-27/norma/tool"
	"gopkg.in/yaml.v3"
)

type cliCfg struct {
	BaseURL    string `yaml:"base_url"`
	APIKey     string `yaml:"api_key"`
	Model      string `yaml:"model"`
	WindowK    int    `yaml:"window_k"`
	Thinking   string `yaml:"thinking"`
	Stream     *bool  `yaml:"stream"`
	WorkDir    string `yaml:"work_dir"`
	MaxMinutes int    `yaml:"max_minutes"`
}

func die(format string, args ...any) {
	fmt.Fprintf(os.Stderr, "artex-cli: "+format+"\n", args...)
	os.Exit(1)
}

func main() {
	cfgPath := flag.String("config", "", "config YAML (base_url, api_key, model, window_k, work_dir, max_minutes)")
	missionFile := flag.String("mission", "", "mission markdown file")
	missionArg := flag.String("m", "", "inline mission text")
	session := flag.String("session", "", "session id to continue (default: new cli-<unix-ts>)")
	maxTurns := flag.Int("max-turns", 0, "agent step budget (0 = unlimited)")
	workdir := flag.String("workdir", "", "work dir override (beats config)")
	quiet := flag.Bool("q", false, "hide step progress lines")
	flag.Parse()

	if *cfgPath == "" {
		die("need -config (yaml). See artex-cli.yaml.example")
	}
	raw, err := os.ReadFile(*cfgPath)
	if err != nil {
		die("config: %v", err)
	}
	var cfg cliCfg
	if err := yaml.Unmarshal(raw, &cfg); err != nil {
		die("config yaml: %v", err)
	}
	if cfg.APIKey == "" {
		cfg.APIKey = os.Getenv("ARTEX_CLI_API_KEY")
	}
	if cfg.Model == "" {
		die("config: model required")
	}
	if cfg.MaxMinutes <= 0 {
		cfg.MaxMinutes = 60
	}

	mission := strings.TrimSpace(*missionArg)
	if *missionFile != "" {
		b, err := os.ReadFile(*missionFile)
		if err != nil {
			die("mission: %v", err)
		}
		mission = strings.TrimSpace(string(b))
	}
	if mission == "" {
		die("need -mission FILE or -m TEXT")
	}

	workDir := *workdir
	if workDir == "" {
		workDir = cfg.WorkDir
	}
	if workDir == "" {
		workDir = "./artex-work"
	}
	if err := os.MkdirAll(filepath.Join(workDir, "sessions"), 0o755); err != nil {
		die("workdir: %v", err)
	}

	acfg := agent.ConfigFrom("openai", cfg.Model, cfg.BaseURL, cfg.APIKey, "")
	acfg.ContextWindowK = cfg.WindowK
	if cfg.Thinking != "" {
		acfg.ThinkingType = cfg.Thinking
	}
	if cfg.Stream != nil {
		acfg.Stream = *cfg.Stream
	}
	prov, err := acfg.NewProvider()
	if err != nil {
		die("provider: %v", err)
	}

	tx := transcript.NewStore(filepath.Join(workDir, "transcripts"))
	ca := agent.NewChatAgent(prov, cfg.Model, workDir, tx, acfg.CompactionWindow())

	sid := *session
	if sid == "" {
		sid = fmt.Sprintf("cli-%d", time.Now().Unix())
	}
	reportPath := filepath.Join(workDir, "REPORT-"+sid+".md")

	step := func(kind, tool, text string) {
		if *quiet || text == "" {
			return
		}
		line := strings.ReplaceAll(text, "\n", " ")
		if len(line) > 220 {
			line = line[:220] + "…"
		}
		fmt.Printf("[%s] %s %s\n", kind, tool, line)
	}

	ctx, cancel := context.WithTimeout(context.Background(), time.Duration(cfg.MaxMinutes)*time.Minute)
	defer cancel()

	fmt.Printf("artex-cli %s | session %s | workdir %s | model %s\n", time.Now().Format("15:04:05"), sid, workDir, cfg.Model)
	start := time.Now()

	final, err := ca.Chat(ctx, "pentest", sid, mission, *maxTurns, 0, false, func(a db.Activity) {
		switch a.Kind {
		case "tool_use":
			step("RUN", a.Tool, activityText(a))
		case "tool_result":
			// raw output too noisy; only errors surface
		case "text", "assistant":
			step("SAY", "", activityText(a))
		default:
			step(a.Kind, a.Tool, activityText(a))
		}
	})
	wall := time.Since(start).Round(time.Second)

	if err != nil {
		fmt.Fprintf(os.Stderr, "\n[stopped] %v (after %s)\n", err, wall)
		if final != "" {
			fmt.Fprintln(os.Stderr, "[partial output below]")
		}
	}
	if final == "" {
		os.Exit(1)
	}

	if werr := os.WriteFile(reportPath, []byte(final), 0o644); werr != nil {
		die("write report: %v", werr)
	}
	fmt.Printf("\n===== REPORT (%s wall) =====\n%s\n===== end (%s) =====\n", wall, final, reportPath)
}

// activityText pulls the human-readable bit out of an activity without
// depending on fields that may be absent across upstream versions.
func activityText(a db.Activity) string {
	if b, err := json.Marshal(a); err == nil {
		var m map[string]any
		if json.Unmarshal(b, &m) == nil {
			if t, ok := m["text"].(string); ok && t != "" {
				return t
			}
			if t, ok := m["title"].(string); ok && t != "" {
				return t
			}
			if t, ok := m["description"].(string); ok && t != "" {
				return t
			}
		}
	}
	return ""
}

var _ = actool.DefaultTools // referenced by agent.Chat internally; keeps import graph honest
