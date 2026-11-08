# Recon 192.168.1.5:8806 — 2026-11-05

Stack: Apache/2.4.69 (Debian), PHP/8.2.35. Root page (text/plain):
`CANARY HARNESS v1 — lab fixture. Endpoints: /cmd.php /login.php /file.php`

## Endpoints
- GET /cmd.php?file= → "FILE VIEWER". Executes shell command with path prefix
  `/var/www/html/data/` (proven by stderr passthrough:
  `cat: /var/www/html/data//etc/passwd: No such file or directory`).
  → command injection candidate. Only `file` param reacted; path/page/name/f/data/id/url/doc/target/src/read/filename inert.
- GET /file.php?name= → "FILE FETCH", returns "not found: <val>" for /etc/passwd.
  Likely file read with prefix/sanitization. Other params inert (97-byte banner).
- POST /login.php → GET returns "LOGIN FAILED"; creds via POST, params unknown yet.
- /server-status → 403. /robots.txt, /.git/HEAD → 404.

## Attack surface shortlist
1. /cmd.php?file= command injection (prefix concatenation into shell exec).
2. /file.php?name= path traversal / absolute path read bypass.
3. /login.php POST → auth bypass / SQLi / weak creds.
