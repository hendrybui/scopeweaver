---
name: offensive-oauth
description: "OAuth 2.0 attack checklist: authorization code interception, redirect_uri bypass, CSRF on OAuth flow, state parameter abuse, open redirector chaining, token leakage via Referer, PKCE bypass, and scope escalation. Use when testing OAuth implementations in web apps or bug bounty. Use when: OAuth, OAuth 2.0, authorization code, redirect_uri bypass, OAuth CSRF, state parameter, PKCE bypass, scope escalation, token leakage, open redirector, OAuth attack"---

# OAuth Security Testing
Use this skill when the conversation involves any of:
`OAuth, OAuth 2.0, authorization code, redirect_uri bypass, OAuth CSRF, state parameter, PKCE bypass, scope escalation, token leakage, open redirector, OAuth attack`

## Instructions for Claude

When this skill is active:
1. Load and apply the full methodology below as your operational checklist
2. Follow steps in order unless the user specifies otherwise
3. For each technique, consider applicability to the current target/context
4. Track which checklist items have been completed
5. Suggest next steps based on findings

---

## offensive-oauth

claude-red library skill — category: auth.

**Load the full skill** (methodology, copy-paste commands, detection view, cheatsheet, references):

- Tool: call `claude_red_show` with skill=`offensive-oauth`
- Or Read: `/app/data/sessions/conv-3/claude-red/Skills/auth/offensive-oauth/SKILL.md`
- Discover: `claude_red_list` (all 79 skills) · `claude_red_search` (keyword across all skills)

Authorized engagements, bug bounty, research, CTF use only. Trigger vocabulary: see description in frontmatter above.
