#  MailPilot AI

### AI-Powered Mail Application

MailPilot AI is a modern email application built with React and Vite. It takes inspiration from Gmail and adds an AI assistant to help users draft replies, summarize emails, and manage their inbox.

I built this project to explore how an email client works and how AI features can be integrated into a clean, user-friendly interface.

##  Getting Started

### Prerequisites

Make sure you have Node.js and npm installed on your system.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/pragadeeshr18-alt/MailPilot-AI.git
   ```

2. Open the project folder:

   ```bash
   cd MailPilot-AI/mailpilot-ai
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open the local URL shown in your terminal. By default:

   ```text
   http://localhost:5173
   ```

##  Features

* **Email Management** — Navigate through Inbox, Sent, Drafts, Starred, and Trash.
* **Email Reading** — Select an email to view its full content.
* **Search** — Search emails by sender, subject, or message content.
* **Compose Email** — Write and review emails before sending.
* **Send Confirmation** — Review the complete email and confirm before sending.
* **Star and Read Status** — Mark emails as starred, read, or unread.
* **AI Assistant** — Draft replies, summarize messages, and change the tone of emails.
* **Dark Mode** — Switch between light and dark themes.
* **Responsive Design** — Designed to work across desktop, tablet, and mobile screens.

##  AI Assistant

The AI assistant is available in the right-side panel and provides tools to help with everyday email tasks.

### What it can do

* Draft a reply to a selected email.
* Summarize an email.
* Create formal or friendly replies.
* Rewrite existing text based on your instructions.
* Apply an AI-generated draft to the compose window.

### Email Safety

MailPilot AI is designed around user control. The assistant prepares email content but does not send emails automatically.

Before an email is sent:

1. The user writes or generates the email.
2. The email is reviewed in the compose window.
3. The user clicks Send.
4. A confirmation dialog displays the email preview.
5. The user explicitly confirms the send action.

##  Tech Stack

* **React 18** — Building the user interface.
* **Vite** — Development server and build tool.
* **Tailwind CSS** — Styling and responsive layouts.
* **JavaScript** — Application logic and interactions.
* **HTML & CSS** — Structure and custom styling.

##  How the Project Works

The application uses an action layer to keep email operations separate from the UI.

Currently, email operations work with local application data, and the AI assistant uses simulated responses. This makes it possible to develop and test the interface before connecting real services.

### Email Actions

The email action layer handles:

* Searching emails.
* Marking emails as read or unread.
* Star and unstar actions.
* Saving drafts.
* Sending emails after confirmation.
* Deleting emails.

### AI Actions

The AI action layer handles:

* Drafting replies.
* Summarizing emails.
* Revising email content.
* Preparing drafts for the compose window.

This structure makes it easier to replace the current logic with real APIs in the future.

##  Project Structure

```text
mailpilot-ai/
├── public/
├── src/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

##  Available Scripts

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start the development server         |
| `npm run build`   | Build the application for production |
| `npm run preview` | Preview the production build         |

##  Future Improvements

Some features I plan to explore in future versions:

* Gmail API integration with OAuth 2.0.
* Real AI responses using Gemini or OpenAI.
* Real-time email synchronization.
* File attachments and inline images.
* Custom labels and email filters.
* Support for multiple email accounts.

##  Current Status

This is a frontend project with simulated email and AI functionality. The main focus is on the user interface, email workflow, and the foundation for future API integrations.

##  License

This project is licensed under the MIT License.

---

**Built with React, Vite, and Tailwind CSS.**
