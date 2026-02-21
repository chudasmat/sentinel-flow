

# AI Agent Firewall Dashboard

## Visual Identity
- **Deep dark theme** — background `#050505`, 1px `#333` borders, subtle dot-grid background pattern
- **Monospace everything** — JetBrains Mono via Google Fonts
- **Status colors** — Safe Green `#00FF41`, Hazard Orange `#FFB800`, Security Red `#FF3131`
- **Terminal-chic aesthetic** — no gradients, no rounded elements, sharp corners, high data density

## Layout & Flow

### Main View — Thread Table
- **Header bar**: "AGENT_FIREWALL_v1.0" title, live "System Latency: Xms" ticker, "Mode: ACTIVE/PASSIVE" indicator
- **Quick Actions row**: "Kill Session," "Rollback State," "Adjust Sensitivity" buttons styled as terminal commands
- **Threads table** filling the page: sortable columns — Thread ID (truncated), First User Message preview, Risk Score (0–10 color-coded), Classification Label, Timestamps
- Rows highlight on hover with a subtle green scanline effect

### Thread Detail — Pop-out Modal
- Clicking any table row opens a large overlay/dialog (not a new page)
- **Conversation Workflow** inside the modal:
  - Message cards laid out in a wrapping grid — cards flow left-to-right then snake down to the next row (no horizontal scrolling)
  - Each card shows: role (system/user/assistant/tool), content preview, classification label badge, risk score
  - Cards are color-bordered by safety status (green = safe, red = unsafe)
  - Connected by arrow/line indicators showing conversation flow
  - Clicking a card expands it inline to show full content, classification probability breakdown, and metadata
- **Taint-Tracker Log** at the bottom of the modal: scrolling monospace terminal log showing classification events for that thread

## Data Layer
- Mock data service with realistic thread and message payloads matching the OpenAPI schema
- All 16 classification labels represented with probability distributions
- API client module with typed interfaces ready to swap to a real endpoint later

## Interactions
- Instant rendering — no loading spinners in mock mode
- Risk score cells glow green/orange/red based on value
- Taint log auto-scrolls with new entries flashing briefly in green
- Modal can be closed with Escape or a close button

