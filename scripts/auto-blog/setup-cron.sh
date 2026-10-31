#!/bin/bash
# Local cron setup for auto-blog pipeline
# Run this script to install a systemd timer or cron job

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
AUTO_BLOG_DIR="$PROJECT_ROOT/scripts/auto-blog"

echo "Setting up auto-blog cron job..."
echo "Project root: $PROJECT_ROOT"
echo "Auto-blog dir: $AUTO_BLOG_DIR"

# Check if .env.local exists
if [[ ! -f "$AUTO_BLOG_DIR/.env.local" ]]; then
    echo "❌ Missing $AUTO_BLOG_DIR/.env.local"
    echo "Copy $AUTO_BLOG_DIR/.env.example to .env.local and fill in your keys"
    exit 1
fi

# Choose scheduler
if command -v systemctl &> /dev/null && systemctl --user list-unit-files &> /dev/null; then
    echo "Using systemd user timer..."
    
    # Create systemd service
    mkdir -p ~/.config/systemd/user
    cat > ~/.config/systemd/user/auto-blog.service <<EOF
[Unit]
Description=Auto Blog Pipeline - AI Trend Posts
After=network-online.target
Wants=network-online.target

[Service]
Type=oneshot
WorkingDirectory=$AUTO_BLOG_DIR
EnvironmentFile=$AUTO_BLOG_DIR/.env.local
ExecStart=/usr/bin/pnpm run run
StandardOutput=journal
StandardError=journal
EOF

    # Create systemd timer (Mon/Thu 08:00 SAST = 06:00 UTC)
    cat > ~/.config/systemd/user/auto-blog.timer <<EOF
[Unit]
Description=Run auto-blog twice weekly

[Timer]
OnCalendar=Mon,Thu 06:00
Persistent=true
RandomizedDelaySec=15m

[Install]
WantedBy=timers.target
EOF

    systemctl --user daemon-reload
    systemctl --user enable --now auto-blog.timer
    
    echo "✅ systemd timer installed and started"
    echo "Check status: systemctl --user status auto-blog.timer"
    echo "View logs: journalctl --user -u auto-blog -f"

elif command -v crontab &> /dev/null; then
    echo "Using cron..."
    
    # Add cron entry (Mon/Thu 08:00 SAST = 06:00 UTC)
    CRON_JOB="0 6 * * 1,4 cd $AUTO_BLOG_DIR && /usr/bin/pnpm run run >> /var/log/auto-blog.log 2>&1"
    
    (crontab -l 2>/dev/null | grep -v "auto-blog"; echo "$CRON_JOB") | crontab -
    
    echo "✅ Cron job installed"
    echo "Check: crontab -l"
    echo "Logs: tail -f /var/log/auto-blog.log"

else
    echo "❌ Neither systemd nor cron available"
    exit 1
fi

echo ""
echo "To test run manually:"
echo "  cd $AUTO_BLOG_DIR && pnpm run run"