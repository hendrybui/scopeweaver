---
name: offensive-ssti
description: "Dense description covering Server-Side Template Injection across Jinja2, Twig, Freemarker, Velocity, Pebble, Smarty, Mako, Handlebars, ERB, Thymeleaf, EJS, Pug. Engine fingerprinting, filter bypass, blind exploitation, WAF evasion, SSTI-to-RCE chains. Tools: tplmap. CWE-1336. MITRE T1190. Use when testing template rendering endpoints or exploiting template injection for code execution. Use when: SSTI detection, template injection payloads, Jinja2 SSTI, Twig SSTI, sandbox escape, template engine fingerprinting, tplmap, SSTI to RCE"---

# Server-Side Template Injection (SSTI) -- Offensive Methodology

SSTI exists wherever user-controlled input is concatenated into a server-side
template string and the engine evaluates it as code. The engine executes
attacker-supplied directives, granting access to the language runtime and, in
nearly every engine, remote code execution through the host language's object
model. You encounter SSTI in any application passing raw user input to functions
like `render_template_string()`, `Template()`, or `compile()`.

CWE-1336. MITRE ATT&CK T1190.

## Quick Workflow

1. Map injection surfaces: URL params, POST bodies, JSON values, path segments, headers, cookies.
2. Inject polyglot probes and engine-specific arithmetic expressions; note evaluation, errors, or blank output.
3. Fingerprint the engine via decision-tree probes, error signatures, and variable enumeration (section 1).
4. Confirm server-side execution -- rule out client-side template injection (AngularJS, Vue.js).
5. Escalate to information disclosure: dump config, env vars, secrets, internal paths.
6. Achieve code execution with the engine-specific chain; apply bypass techniques if blocked (section 6).
7. Chain for higher impact: file read, SSRF to cloud metadata, reverse shell, internal pivot.
8. Produce non-destructive PoC with unique marker and capture the full request/response chain.

---

## offensive-ssti

1. 
2. 
3. 
