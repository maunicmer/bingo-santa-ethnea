#!/usr/bin/env bash
set -e

# ──────────────────────────────────────────────
# Let's Encrypt init script for Bingo Santa Ethnea
# Usage: ./init-letsencrypt.sh
# ──────────────────────────────────────────────

# Load domain from .env if available
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

# Prompt for domain if not set
if [ -z "$DOMAIN" ]; then
    read -p "Enter your domain (e.g. bingo.example.com): " DOMAIN
    echo "DOMAIN=$DOMAIN" > .env
    echo "DOMAIN saved to .env"
fi

echo "→ Domain: $DOMAIN"
echo ""

# Prompt for email (optional)
CERTBOT_EMAIL_ARGS=""
if [ -n "$EMAIL" ]; then
    CERTBOT_EMAIL_ARGS="--email $EMAIL --no-eff-email"
    echo "→ Email: $EMAIL (from .env, notifications enabled)"
else
    read -p "Enter email for cert notifications (or press Enter to skip): " EMAIL
    if [ -n "$EMAIL" ]; then
        CERTBOT_EMAIL_ARGS="--email $EMAIL --no-eff-email"
        echo "→ Email: $EMAIL (notifications enabled)"
    else
        CERTBOT_EMAIL_ARGS="--register-unsafely-without-email"
        echo "→ No email provided — no expiration notifications"
    fi
fi
echo ""

# Step 1: Start nginx with HTTP-only config
echo "→ Step 1: Starting nginx (HTTP only)..."
cp nginx.conf nginx.conf.backup
cp nginx.conf.http-only nginx.conf
docker compose up -d nginx
sleep 3

# Verify nginx is running
if ! docker compose ps nginx | grep -q "Up"; then
    echo "✗ nginx failed to start. Check logs: docker compose logs nginx"
    exit 1
fi
echo "✓ nginx is running"
echo ""

# Step 2: Obtain certificates
echo "→ Step 2: Requesting certificate from Let's Encrypt..."
docker compose run --rm certbot \
    certonly --webroot \
    -w /var/www/certbot \
    -d "$DOMAIN" \
    $CERTBOT_EMAIL_ARGS \
    --agree-tos \
    --force-renewal

if [ $? -ne 0 ]; then
    echo "✗ Certbot failed. Check logs above."
    echo "→ Restoring HTTP-only config..."
    cp nginx.conf.backup nginx.conf
    exit 1
fi
echo "✓ Certificate obtained"
echo ""

# Step 3: Switch to SSL config and restart
echo "→ Step 3: Switching to HTTPS config..."
cp nginx.conf.backup nginx.conf
docker compose up -d nginx
sleep 3

# Verify HTTPS is working
if docker compose exec nginx wget --no-verbose --tries=1 --spider https://localhost/ 2>/dev/null; then
    echo "✓ HTTPS is working"
else
    echo "⚠ HTTPS check from inside container failed (may be self-signed issue). Verify manually: https://$DOMAIN"
fi

echo ""
echo "═══════════════════════════════════════════"
echo "  Setup complete!"
echo "  → Open: https://$DOMAIN"
echo "  → Certs auto-renew every 12 hours"
echo "═══════════════════════════════════════════"
