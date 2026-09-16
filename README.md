# ✈️ MailPilot AI

**AI-Powered Mail Application** — A premium Gmail-inspired web client with an integrated AI assistant for drafting, summarizing, and managing emails.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss)

---

## 🚀 Quick Start

```bash
# 1. Navigate to the project
cd mailpilot-ai

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **Inbox / Sent / Drafts / Starred / Trash** | Full folder navigation with unread counts |
| **Email Reading Pane** | Click any email to view full content |
| **Search** | Real-time search across sender, subject, and body |
| **Compose with Confirmation** | Write emails → review → confirm before sending |
| **Star & Read/Unread** | Toggle star and read status on any email |
| **AI Assistant Panel** | Draft replies, summarize emails, revise tone |
| **Dark Mode** | System-aware toggle with smooth transition |
| **Responsive Layout** | Works on desktop, tablet, and mobile |

---

## 🤖 AI Assistant

The right-side AI panel supports these actions:

- **📝 Draft Reply** — Generate a reply to the selected email
- **📋 Summarize** — Get a concise summary of the email
- **🎩 Formal Reply** — Draft a formal/professional response
- **😊 Friendly Reply** — Draft a casual/friendly response
- **Custom Requests** — Type any instruction (e.g., "Make it shorter", "Rewrite in bullet points")
- **Apply to Compose** — One-click to move AI-drafted text into the compose modal

### Safety: AI Never Sends Automatically

The AI assistant **only produces drafts**. It never sends email on the user's behalf. Every outgoing email requires:

1. User reviews the content in the Compose modal
2. User clicks "Send"
3. A **confirmation dialog** appears with full preview
4. User explicitly clicks "Confirm & Send"

---

## 🏗️ Architecture: Action Layer

All email and AI operations are routed through a clean **action layer** designed for easy API replacement:

### `emailActions` (→ Phase 2: Gmail API)

| Action | Current | Phase 2 |
|--------|---------|---------|
| `search()` | Local filter | Gmail search API |
| `markAsRead()` | Local state | Gmail modify labels |
| `toggleStar()` | Local state | Gmail modify labels |
| `sendEmail()` | Local state (after confirmation) | Gmail send API |
| `saveDraft()` | Local state | Gmail drafts API |
| `deleteEmail()` | Local state | Gmail trash endpoint |

### `aiActions` (→ Phase 2: Gemini / OpenAI)

| Action | Current | Phase 2 |
|--------|---------|---------|
| `draftReply()` | Template-based simulation | AI API call |
| `summarize()` | Metadata extraction | AI API call |
| `revise()` | String transformation | AI API call |
| `prepareSend()` | Returns draft object | AI API call + confirmation |

---

## 📋 Phase 2 Roadmap

> **Real AI and Gmail OAuth are planned for Phase 2.**

### Planned Integrations

- **Gmail OAuth 2.0** — Real inbox sync via Gmail API
- **Gemini / OpenAI API** — Replace simulated AI with real LLM responses
- **Real-time sync** — Push notifications for new emails
- **Attachment support** — File uploads and inline images
- **Labels & filters** — Custom organization and auto-sorting
- **Multi-account** — Support for multiple email accounts

### Migration Path

1. Replace `emailActions` function bodies with Gmail API calls
2. Replace `aiActions` function bodies with LLM API calls
3. Add OAuth flow and token management
4. Add environment variables for API keys
5. The UI and confirmation flows remain unchanged

---

## 📁 Project Structure

```
mailpilot-ai/
├── public/                  # Static assets
├── src/
│   ├── App.jsx              # All components + action layers
│   ├── index.css            # Tailwind + custom styles
│   └── main.jsx             # React entry point
├── index.html               # HTML entry
├── package.json             # Dependencies & scripts
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind theme & animations
├── postcss.config.js        # PostCSS plugins
└── README.md                # This file
```

---

## 🛠️ Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server at localhost:5173 |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

---

## 📄 License

MIT
