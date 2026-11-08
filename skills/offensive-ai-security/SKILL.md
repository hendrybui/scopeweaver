---
name: offensive-ai-security
description: "AI/LLM security offensive checklist: prompt injection, jailbreaking, model extraction, training data poisoning, adversarial inputs, LLM-assisted attack automation, and AI system reconnaissance. Use when assessing AI/ML systems, red-teaming LLMs, or researching AI attack vectors. Use when: AI security, LLM security, prompt injection, jailbreak, model extraction, training data poisoning, adversarial input, AI red team, ML security, RAG poisoning, AI attack"---

# AI Pentest
Use this skill when the conversation involves any of:
`AI security, LLM security, prompt injection, jailbreak, model extraction, training data poisoning, adversarial input, AI red team, ML security, RAG poisoning, AI attack`

## Instructions for Claude

When this skill is active:
1. Load and apply the full methodology below as your operational checklist
2. Follow steps in order unless the user specifies otherwise
3. For each technique, consider applicability to the current target/context
4. Track which checklist items have been completed
5. Suggest next steps based on findings

---

## offensive-ai-security

claude-red library skill — category: ai.

**Load the full skill** (methodology, copy-paste commands, detection view, cheatsheet, references):

- Tool: call `claude_red_show` with skill=`offensive-ai-security`
- Or Read: `/app/data/sessions/conv-3/claude-red/Skills/ai/offensive-ai-security/SKILL.md`
- Discover: `claude_red_list` (all 79 skills) · `claude_red_search` (keyword across all skills)

Authorized engagements, bug bounty, research, CTF use only. Trigger vocabulary: see description in frontmatter above.

---

## Testing AI Threat Analysis Endpoints (Storm-Breaker Pattern)

**Overview**: Storm-Breaker is a Flask-based security panel accessible at `127.0.0.1:2525` (or via Docker internal IP). It exposes AI threat analysis endpoints under `/api/ai-threat/*` that can be used to assess input validation, authentication, and output handling in AI/LLM-integrated web services.

### Discovery
- Access `http://HOST:2525/` to enumerate public routes and blueprints
- Blueprint registration includes: `auth`, `capture_rx`, `capture_sessions`, `capture_c2`, `capture_mobile`, `intel`, `credentials`, `payloads`, `obfuscation`, `reports`, `lures`, `campaigns`, `evasion`, `threat_intel`, `session_hijack`, `pivot`, `rat`, `ai_threat`
- Key endpoint pattern: `/api/ai-threat/{landscape,analyze,behavioral,anomalies,predict,response-plan}`

### Authentication Testing
- Default credentials (from config.php): `admin` / `RINA@ngoh`
- Login POST to `/login` with `username=admin&password=RINA@ngoh` sets `storm_csrf` cookie
- AI threat endpoints require valid session cookie (`Cookie: storm_csrf=<token>`)
- Test: Missing auth → `401 Unauthorized`; Valid auth → `200 OK`

### Endpoint-Specific Testing

| Endpoint | Method | Parameters | Purpose |
|----------|--------|-----------|---------|
| `/api/ai-threat/landscape` | GET | None | Retrieve threat landscape data; validate auth and input |
| `/api/ai-threat/analyze` | POST | `payload=<string>` | Submit payload for AI threat analysis; test for injection |
| `/api/ai-threat/behavioral` | GET | `ip=<ip>` | Behavioral analysis per IP; test IP-based filtering |
| `/api/ai-threat/anomalies` | GET | None | Detect anomalies; check for data leakage |
| `/api/ai-threat/predict` | GET | None | Predictive model output; test for sensitive info disclosure |
| `/api/ai-threat/response-plan` | GET | `type=<string>`, `severity=<string>` | Generate response plan; test for SSRF or unauthorized API calls |

### Injection Testing
- **Prompt Injection**: POST crafted payloads to `/api/ai-threat/analyze` to test for prompt injection or instruction extraction
- **Input Length/Complexity**: Test with oversized or recursive payloads to check for DoS
- **Special Characters**: Test with Base64, Hex, URL-encoded payloads to bypass filters
- **Indirect Injection**: Attempt to inject via IP parameter on `/api/ai-threat/behavioral`

### Insecure Output Handling
- Verify if AI threat output is rendered in HTML without sanitization (potential XSS)
- Check if output can form database queries or shell commands (SQLi/Command injection risks)
- Test if output is passed to external APIs without validation (SSRF risk)
- Enforce JSON schema validation on all tool arguments and model outputs

### Defenses to Validate
- Strict JSON Schema enforcement on all tool args and outputs
- Per-domain allow-lists for any outbound HTTP from AI tools
- Human-in-the-loop for high-impact actions based on AI threat data
- Content provenance tags to distinguish AI-generated data from user input
- Rate limiting on AI endpoint calls (observed: 1200/min from Settings.json)
