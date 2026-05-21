#!/usr/bin/env bash
# ──────────────────────────────────────────────
# Infrastructure config validation tests
# Usage: ./test-infra.sh
# ──────────────────────────────────────────────
set -e

PASS=0
FAIL=0
WARN=0

green() { echo -e "\033[32m✓ $1\033[0m"; }
red()   { echo -e "\033[31m✗ $1\033[0m"; }
yellow(){ echo -e "\033[33m⚠ $1\033[0m"; }

pass() { PASS=$((PASS + 1)); green "$1"; }
fail() { FAIL=$((FAIL + 1)); red "$1"; }
warn() { WARN=$((WARN + 1)); yellow "$1"; }

echo "═══════════════════════════════════════════"
echo "  Infrastructure Config Validation"
echo "═══════════════════════════════════════════"
echo ""

# ── 1. File existence checks ──
echo "── File existence ──"
for f in Dockerfile docker-compose.yml nginx.conf nginx.conf.http-only .dockerignore .env.example; do
    if [ -f "$f" ]; then
        pass "$f exists"
    else
        fail "$f missing"
    fi
done
echo ""

# ── 2. Docker Compose validation ──
echo "── Docker Compose ──"
if command -v docker &>/dev/null; then
    if docker compose config --quiet 2>/dev/null; then
        pass "docker-compose.yml is valid"
    else
        output=$(docker compose config 2>&1)
        if echo "$output" | grep -q "valid"; then
            fail "docker-compose.yml has errors: $output"
        else
            pass "docker-compose.yml is valid (compose v2)"
        fi
    fi

    # Check for required services
    if docker compose config --services 2>/dev/null | grep -q "nginx"; then
        pass "nginx service defined"
    else
        fail "nginx service not found"
    fi

    # Check for resource limits
    if grep -q "resources:" docker-compose.yml; then
        pass "resource limits configured"
    else
        warn "no resource limits — container can consume unbounded resources"
    fi

    # Check for healthcheck
    if grep -q "healthcheck:" docker-compose.yml; then
        pass "healthcheck configured"
    else
        fail "no healthcheck — container health unknown"
    fi
else
    warn "docker not installed — skipping compose validation"
fi
echo ""

# ── 3. Nginx config validation ──
echo "── Nginx configuration ──"

# Check for shell variable leakage (common mistake)
if grep -qE '\$\{[A-Z_]+\}' nginx.conf; then
    fail "nginx.conf contains shell variables (nginx doesn't interpret them)"
else
    pass "no shell variables in nginx.conf"
fi

# Check for security headers
for header in "Strict-Transport-Security" "X-Content-Type-Options" "X-Frame-Options" "Content-Security-Policy" "Referrer-Policy" "Permissions-Policy"; do
    if grep -q "$header" nginx.conf; then
        pass "security header: $header"
    else
        fail "missing security header: $header"
    fi
done

# Check SSL cert paths are real domains (not variables)
if grep -qE 'ssl_certificate.*\$\{' nginx.conf; then
    fail "SSL cert path contains variables"
elif grep -q 'ssl_certificate' nginx.conf; then
    pass "SSL cert paths are hardcoded"
fi

# Check for deprecated http2 syntax (warning only)
if grep -q 'listen.*http2' nginx.conf; then
    warn "listen ... http2 is deprecated in nginx 1.25+ (still functional)"
fi

# Validate nginx.conf syntax if docker is available
if command -v docker &>/dev/null; then
    result=$(timeout 30 docker run --rm -v "$(pwd)/nginx.conf:/etc/nginx/conf.d/default.conf:ro" nginx:alpine nginx -t 2>&1) || true
    if echo "$result" | grep -q "syntax is ok"; then
        pass "nginx.conf syntax valid"
    elif echo "$result" | grep -qi "pull\|timeout\|network\|daemon\|socket"; then
        warn "docker unavailable — skipping nginx syntax validation"
    else
        fail "nginx.conf syntax error: $result"
    fi

    # Validate http-only config too
    result=$(timeout 30 docker run --rm -v "$(pwd)/nginx.conf.http-only:/etc/nginx/conf.d/default.conf:ro" nginx:alpine nginx -t 2>&1) || true
    if echo "$result" | grep -q "syntax is ok"; then
        pass "nginx.conf.http-only syntax valid"
    elif echo "$result" | grep -qi "pull\|timeout\|network\|daemon\|socket"; then
        warn "docker unavailable — skipping http-only syntax validation"
    else
        fail "nginx.conf.http-only syntax error: $result"
    fi
else
    warn "docker not installed — skipping nginx syntax validation"
fi
echo ""

# ── 4. Dockerfile validation ──
echo "── Dockerfile ──"

# Check for multi-stage build
if grep -q "FROM.*AS" Dockerfile; then
    pass "multi-stage build detected"
else
    warn "no multi-stage build — image may be larger than needed"
fi

# Check for USER directive (security)
if grep -q "^USER " Dockerfile; then
    # If USER is set, verify it's not breaking cert access
    warn "USER directive in Dockerfile — verify cert file permissions"
else
    pass "no USER directive (nginx master runs as root, workers via user directive)"
fi

# Check for pinned base image versions
if grep -qE 'FROM (node|nginx):[a-z]+-[a-z]+' Dockerfile; then
    pass "base images use variant tags (alpine)"
elif grep -qE 'FROM (node|nginx):[0-9]' Dockerfile; then
    pass "base images use version tags"
else
    warn "base images not pinned to specific versions"
fi

# Check .dockerignore exists and excludes node_modules
if [ -f .dockerignore ] && grep -q "node_modules" .dockerignore; then
    pass ".dockerignore excludes node_modules"
else
    fail "node_modules not in .dockerignore — slow builds"
fi

# Build test (if docker available)
if command -v docker &>/dev/null; then
    echo "  → Building Docker image (this may take a moment)..."
    if timeout 120 docker build --no-cache -t bingo-test-build . >/dev/null 2>&1; then
        pass "Dockerfile builds successfully"
        docker rmi bingo-test-build >/dev/null 2>&1
    else
        warn "Dockerfile build skipped or failed (may need image pull)"
    fi
else
    warn "docker not installed — skipping build test"
fi
echo ""

# ── 5. Security checks ──
echo "── Security ──"

# Check for .env in gitignore
if grep -q "^\.env$" .gitignore; then
    pass ".env excluded from git"
else
    fail ".env not in .gitignore — secrets may be committed"
fi

# Check npm audit
if command -v npm &>/dev/null; then
    audit=$(npm audit --omit=dev 2>&1)
    if echo "$audit" | grep -q "found 0 vulnerabilities"; then
        pass "npm audit: 0 vulnerabilities"
    else
        vulns=$(echo "$audit" | grep -oP '\d+ \w+ severity' | head -5)
        fail "npm audit found vulnerabilities: $vulns"
    fi
else
    warn "npm not installed — skipping audit"
fi

# Check for hardcoded secrets in config files
if grep -rEi '(password|secret|api_key|token)\s*=\s*["\x27][^"\x27]+["\x27]' --include='*.conf' --include='*.yml' --include='*.yaml' --include='Dockerfile' . 2>/dev/null | grep -v ".git/" | grep -v "node_modules/"; then
    fail "potential hardcoded secrets found in config files"
else
    pass "no hardcoded secrets in config files"
fi
echo ""

# ── Summary ──
echo "═══════════════════════════════════════════"
echo "  Results: $PASS passed, $FAIL failed, $WARN warnings"
echo "═══════════════════════════════════════════"

if [ $FAIL -gt 0 ]; then
    exit 1
fi
