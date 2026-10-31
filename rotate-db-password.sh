#!/usr/bin/env bash
# Rotate the PostgreSQL role password that .env and ARTEX_PG_DSN use, in the only
# order that cannot strand the stack: ALTER ROLE first, then .env, then recreate.
# The postgres healthcheck authenticates with the .env credentials, so updating
# .env last (or not at all) leaves compose refusing to start the app with
# "dependency postgres failed to start", because the app waits for service_healthy.
# Docker mode: the ALTER runs over the container's trusted local socket.
# Usage: rotate-db-password.sh [-p PASSWORD] [--user USER] [--db DB] [--container NAME]
set -euo pipefail
# Interface language only; keep command tokens and operator input unchanged.
normalize_language() (
  set -f
  tag=$(printf '%s' "$1" | tr '[:upper:]_' '[:lower:]-' | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
  case "$tag" in
    ko|ko-*) printf ko; return ;;
    en|en-*) printf en; return ;;
    ''|*-|*--*|*' '*|*';'*) printf en; return ;;
    ja|ja-*) printf ja; return ;;
    es|es-*) printf es; return ;;
    zh|zh-cn|zh-sg) printf zh-Hans; return ;;
    zh-tw|zh-hk|zh-mo) printf zh-Hant; return ;;
    zh-*)
      script=''
      IFS=-
      set -- $tag
      shift
      for part do
        case "$part" in
          ????) [ -z "$script" ] || [ "$script" = "$part" ] || { printf en; return; }; script="$part" ;;
        esac
      done
      case "$script" in hans) printf zh-Hans ;; hant) printf zh-Hant ;; *) printf en ;; esac
      ;;
    *) printf en ;;
  esac
)
LANG_SEL=$(normalize_language "${SCOPEWEAVER_LANGUAGE:-${ARTEX_LANGUAGE:-en}}")
# msg EN KO HANS HANT JA ES; no runtime catalog or extra packaging dependency.
msg() {
  case "$LANG_SEL" in
    ko) printf '%s' "$2" ;;
    zh-Hans) printf '%s' "$3" ;;
    zh-Hant) printf '%s' "$4" ;;
    ja) printf '%s' "$5" ;;
    es) printf '%s' "$6" ;;
    *) printf '%s' "$1" ;;
  esac
}


PASS_KEY="auth.password_hash"
BCRYPT_COST=10

MODE=""            # local | docker (empty = automatic)
DSN=""
HOST="" PORT="" USER="" DBPASS="" DBNAME="" SSLMODE=""
CONFIG=""
CONTAINER=""       # PostgreSQL service/container name (default postgres)
EXEC_KIND=""       # compose | docker (empty = automatic)
NEWPASS=""
ASSUME_YES=0

die() { echo "$(msg "Error: $*" "오류: $*" "错误：$*" "錯誤：$*" "エラー: $*" "Error: $*")" >&2; exit 1; }
info() { echo "· $*" >&2; }

usage() {
  echo "$(msg 'Reset ScopeWeaver administrator password (legacy username ARTEX).' 'ScopeWeaver 관리자 비밀번호 재설정 (기존 사용자 이름 ARTEX).' "重置 ScopeWeaver 管理员密码（旧用户名为 ARTEX）。" "重設 ScopeWeaver 管理員密碼（原使用者名稱為 ARTEX）。" "ScopeWeaver の管理者パスワードをリセットします（従来のユーザー名は ARTEX）。" "Restablece la contraseña de administrador de ScopeWeaver (nombre de usuario heredado: ARTEX).")"
  echo "$(msg 'Usage: ./reset-password.sh [options]; prompts for a password when omitted.' '사용법: ./reset-password.sh [옵션]; 비밀번호 생략 시 입력을 요청합니다.' "用法：./reset-password.sh [options]；省略密码时将提示输入。" "用法：./reset-password.sh [options]；未提供密碼時會提示輸入。" "使用法: ./reset-password.sh [options]。パスワードを省略すると入力を求めます。" "Uso: ./reset-password.sh [options]; se pedirá la contraseña si se omite.")"
  echo '-m/--mode local|docker; --dsn DSN; --config PATH; --sslmode MODE'
  echo '-H/--host HOST; -P/--port PORT; -U/--user USER; -W/--db-password PASSWORD'
  echo '-d/--dbname DATABASE; -c/--container NAME; --exec compose|docker'
  echo '-p/--new-password PASSWORD; -y/--yes; -h/--help'
  exit 0
}

ROOT=$(cd "$(dirname "$0")" && pwd)
cd "$ROOT"
[ -f .env ] || die ".env not found in $ROOT"

PASSWORD=""
USER_OVERRIDE=""
DB_OVERRIDE=""
CONTAINER=""
while [ $# -gt 0 ]; do
  case "$1" in
    -p|--password) PASSWORD=${2:?missing value}; shift 2 ;;
    --user) USER_OVERRIDE=${2:?missing value}; shift 2 ;;
    --db) DB_OVERRIDE=${2:?missing value}; shift 2 ;;
    --container) CONTAINER=${2:?missing value}; shift 2 ;;
    -h|--help)
      echo "$(msg 'Usage: rotate-db-password.sh [-p PASSWORD] [--user USER] [--db DB] [--container NAME]' '사용법: rotate-db-password.sh [-p 비밀번호] [--user 사용자] [--db DB] [--container 이름]' '用法：rotate-db-password.sh [-p 密码] [--user 用户] [--db 数据库] [--container 容器名]' '用法：rotate-db-password.sh [-p 密碼] [--user 使用者] [--db 資料庫] [--container 容器名稱]' '使い方: rotate-db-password.sh [-p パスワード] [--user ユーザー] [--db DB] [--container 名前]' 'Uso: rotate-db-password.sh [-p CONTRASEÑA] [--user USUARIO] [--db BASE] [--container NOMBRE]')"
      exit 0 ;;
    *) die "unknown argument: $1" ;;
  esac
done

DUSER=${USER_OVERRIDE:-$(sed -n 's/^POSTGRES_USER=//p' .env)}
DNAME=${DB_OVERRIDE:-$(sed -n 's/^POSTGRES_DB=//p' .env)}
DUSER=${DUSER:-artex}
DNAME=${DNAME:-artex}
[ -n "$PASSWORD" ] || PASSWORD=$(openssl rand -hex 32 2>/dev/null || od -An -tx1 -N32 /dev/urandom | tr -d ' \n')

# Local socket inside the container is trusted, so the current password is not needed here.
[ -n "$CONTAINER" ] || CONTAINER=$(docker inspect "$(docker compose ps -q postgres)" --format '{{.Name}}' | tr -d '/')
[ -n "$CONTAINER" ] || die "no running postgres service in $ROOT"
docker exec "$CONTAINER" psql -U "$DUSER" -d "$DNAME" -qc "alter role \"$DUSER\" with password '$PASSWORD'" >/dev/null

# .env before the recreate, otherwise the container starts holding the old secret.
awk -v pw="$PASSWORD" 'BEGIN{done=0} /^POSTGRES_PASSWORD=/{print "POSTGRES_PASSWORD=" pw; done=1; next} {print} END{if(!done) print "POSTGRES_PASSWORD=" pw}' .env > .env.rotate.tmp
mv .env.rotate.tmp .env

docker compose up -d --force-recreate postgres >/dev/null
CONTAINER=$(docker inspect "$(docker compose ps -q postgres)" --format '{{.Name}}' | tr -d '/')
i=0
st=unknown
while [ $i -lt 30 ]; do
  st=$(docker inspect "$CONTAINER" --format '{{.State.Health.Status}}' 2>/dev/null || echo unknown)
  [ "$st" = healthy ] && break
  sleep 3
  i=$((i+1))
done
[ "$st" = healthy ] || die "$(msg "postgres ($CONTAINER) did not become healthy in 90s; inspect: docker logs $CONTAINER" "postgres($CONTAINER)가 90초 안에 정상이 되지 않았습니다. 확인: docker logs $CONTAINER" "postgres（$CONTAINER）在 90 秒内未变为健康状态；请检查：docker logs $CONTAINER" "postgres（$CONTAINER）在 90 秒內未變成健康狀態；請檢查：docker logs $CONTAINER" "postgres（$CONTAINER）が 90 秒以内に healthy になりませんでした。確認: docker logs $CONTAINER" "postgres ($CONTAINER) no alcanzó el estado healthy en 90s; revise: docker logs $CONTAINER")"

docker compose up -d scopeweaver >/dev/null
echo "$(msg "Rotated the password for role $DUSER; .env updated and $CONTAINER recreated." "$DUSER 역할의 비밀번호를 변경했습니다. .env를 갱신하고 $CONTAINER를 다시 생성했습니다." "已轮换 $DUSER 角色的密码；已更新 .env 并重建 $CONTAINER。" "已輪換 $DUSER 角色的密碼；已更新 .env 並重建 $CONTAINER。" "$DUSER ロールのパスワードをローテーションしました。.env を更新し $CONTAINER を再作成しました。" "Se rotó la contraseña del rol $DUSER; .env actualizado y $CONTAINER recreado.")"
echo "$(msg "New password: ${PASSWORD:-}" "새 비밀번호: ${PASSWORD:-}" "新密码：${PASSWORD:-}" "新密碼：${PASSWORD:-}" "新しいパスワード: ${PASSWORD:-}" "Nueva contraseña: ${PASSWORD:-}")"
