#!/usr/bin/env bash
# PreToolUse hook: blocks GitHub MCP write tools (PRs, issues, comments, reviews)
# when their payload contains any Claude/AI attribution or signature.
# Ensures Claude never signs PR descriptions, issue text, comments or reviews.
set -euo pipefail

input="$(cat)"

# Collect every string value in the tool input so a signature in any field is caught.
payload="$(printf '%s' "$input" | jq -r '[.tool_input | .. | strings] | join("\n")' 2>/dev/null || true)"

# Signature / attribution patterns (case-insensitive).
pattern='generated (with|by) \[?claude|🤖|co-authored-by:[[:space:]]*claude|claude\.ai/code|claude code\]\(https|noreply@anthropic|generated with claude'

if printf '%s' "$payload" | grep -iqE "$pattern"; then
  cat <<'JSON'
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "Blocked: the text contains a Claude/AI attribution or signature (e.g. 'Generated with Claude Code', a co-authored-by trailer, a claude.ai/code link or a robot emoji). Remove all such attribution and call the tool again with a clean body that describes only the actual change."
  }
}
JSON
  exit 0
fi

# No signature found: allow normally.
exit 0
