# trmnl-cli

CLI tool for [TRMNL](https://usetrmnl.com) e-ink displays. Send, validate, and track payloads.

## Installation

```bash
# With bun (recommended)
bun install -g trmnl-cli

# With npm
npm install -g trmnl-cli
```

## Quick Start

```bash
# Set your webhook URL
trmnl config set webhook "https://trmnl.com/api/custom_plugins/YOUR_UUID"

# Send content
trmnl send --content '<div class="layout">Hello TRMNL!</div>'

# Or from a file
trmnl send --file ./output.html
```

## Commands

### `trmnl send`

Send content to your TRMNL display.

```bash
# Direct content
trmnl send --content "<div class=\"layout\">Hello</div>"

# From file
trmnl send --file ./output.html

# From stdin (piped)
echo '{"merge_variables":{"content":"..."}}' | trmnl send

# With options
trmnl send --file output.html --skip-validation --json
```

Options:
- `-c, --content <html>` - HTML content to send
- `-f, --file <path>` - Read content from file
- `-w, --webhook <url>` - Override webhook URL
- `--skip-validation` - Skip payload validation
- `--skip-log` - Don't log to history
- `--json` - Output result as JSON

### `trmnl validate`

Validate a payload without sending.

```bash
trmnl validate --file ./output.html
trmnl validate --content "..." --tier plus
```

Options:
- `-c, --content <html>` - HTML content to validate
- `-f, --file <path>` - Read content from file
- `-t, --tier <tier>` - Check against tier limit (`free` or `plus`)
- `--json` - Output result as JSON

### `trmnl config`

Manage CLI configuration.

```bash
# Show all config
trmnl config list

# Get a value
trmnl config get webhook

# Set a value
trmnl config set webhook "https://..."
trmnl config set tier plus

# Show config file path
trmnl config path
```

Config is stored in `~/.trmnl/config.toml`.

### `trmnl history`

View send history.

```bash
# Last 10 sends
trmnl history

# Last N sends
trmnl history --last 20

# Filter
trmnl history --today
trmnl history --failed
trmnl history --success

# Stats
trmnl history stats

# Clear
trmnl history clear --confirm
```

Options:
- `-n, --last <n>` - Show last N entries (default: 10)
- `--today` - Show only today's entries
- `--failed` - Show only failed sends
- `--success` - Show only successful sends
- `-v, --verbose` - Show content preview
- `--json` - Output as JSON

## Configuration

### Config File (`~/.trmnl/config.toml`)

```toml
[webhook]
url = "https://trmnl.com/api/custom_plugins/..."
tier = "free"  # or "plus"

[history]
path = "~/.trmnl/history.jsonl"
maxSizeMb = 100
```

### Environment Variables

- `TRMNL_WEBHOOK` - Webhook URL (overrides config file)

## History Format

Sends are logged to `~/.trmnl/history.jsonl`:

```jsonl
{"timestamp":"2026-02-07T10:00:00Z","size_bytes":1234,"tier":"free","payload":{...},"success":true,"status_code":200,"duration_ms":234}
```

## Tier Limits

| Tier | Payload Limit | Rate Limit |
|------|---------------|------------|
| Free | 2 KB (2,048 bytes) | 12 requests/hour |
| Plus | 5 KB (5,120 bytes) | 30 requests/hour |

## License

MIT
