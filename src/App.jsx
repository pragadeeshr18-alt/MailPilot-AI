import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Inbox, Send, FileText, Star, Trash2, Search, Moon, Sun, Plus, X,
  Reply, Forward, MoreVertical, Bot, Check, Sparkles, Mail,
  ArrowLeft, Eye, EyeOff, Menu, Archive, MessageSquare, Copy,
  ChevronRight, PenLine, Loader2, Send as SendIcon, Wand2, ListChecks
} from 'lucide-react';

// ════════════════════════════════════════════════════════════
// MOCK DATA
// ════════════════════════════════════════════════════════════

const now = new Date(2026, 8, 16, 21, 0);
const hours = (h) => new Date(now.getTime() - h * 3600000).toISOString();
const days  = (d) => new Date(now.getTime() - d * 86400000).toISOString();

const INITIAL_EMAILS = [
  {
    id: '1', sender: 'Sarah Chen', senderEmail: 'sarah.chen@techcorp.com',
    to: 'me@mailpilot.ai', subject: 'Q3 Product Roadmap — Final Review Needed',
    preview: "Hi team, I've finalized the Q3 roadmap and need your sign-off before Friday's board meeting…",
    body: "Hi team,\n\nI've finalized the Q3 product roadmap and need your sign-off before Friday's board meeting.\n\nKey highlights:\n• Mobile app v2.0 launch — July 15\n• API redesign completion — August 1\n• Enterprise dashboard rollout — September 30\n\nPlease review the attached document and share your feedback by EOD Thursday.\n\nBest regards,\nSarah",
    timestamp: hours(2), isRead: false, isStarred: true, folder: 'inbox',
  },
  {
    id: '2', sender: 'David Kim', senderEmail: 'david.kim@designstudio.co',
    to: 'me@mailpilot.ai', subject: 'New Design System v3.0 Components Ready',
    preview: 'The new component library is live in Figma. Updated tokens, spacing, and accessibility…',
    body: "Hey!\n\nThe new Design System v3.0 component library is now live in Figma.\n\nWhat's new:\n• Completely refreshed color tokens with WCAG AAA contrast\n• New spacing scale based on 4px grid\n• 40+ new components including data tables, charts, and dashboards\n• Dark mode support across all components\n\nLet me know if you spot anything that needs adjustment.\n\nCheers,\nDavid",
    timestamp: hours(5), isRead: false, isStarred: false, folder: 'inbox',
  },
  {
    id: '3', sender: 'Emily Rodriguez', senderEmail: 'emily.r@globalventures.com',
    to: 'me@mailpilot.ai', subject: 'Partnership Proposal — AI Integration',
    preview: 'We are very interested in exploring a strategic partnership for integrating your AI capabilities…',
    body: "Dear Team,\n\nGlobal Ventures is very interested in exploring a strategic partnership to integrate your AI capabilities into our enterprise platform.\n\nWe believe this collaboration could drive significant value for both organizations. Our initial proposal includes:\n\n1. Joint development of AI-powered analytics\n2. Shared access to training datasets\n3. Co-marketing initiatives for Q4 2026\n\nWould next Tuesday work for an introductory call?\n\nWarm regards,\nEmily Rodriguez\nVP of Strategic Partnerships",
    timestamp: days(1), isRead: false, isStarred: true, folder: 'inbox',
  },
  {
    id: '4', sender: 'Alex Thompson', senderEmail: 'alex.t@financedesk.com',
    to: 'me@mailpilot.ai', subject: 'Monthly Budget Report — August 2026',
    preview: 'Attached is the August budget report. Overall spend is 12% under projection, with notable savings…',
    body: "Hi,\n\nPlease find the August 2026 budget report attached.\n\nSummary:\n• Total spend: $847,200 (12% under projection)\n• Engineering: $412,000 — on track\n• Marketing: $198,500 — 18% under budget\n• Operations: $236,700 — 5% over budget\n\nThe marketing underspend is due to the delayed campaign launch. I recommend reallocating $35K to operations to cover the infrastructure upgrade.\n\nLet me discuss this in our Friday sync.\n\nBest,\nAlex",
    timestamp: days(1), isRead: true, isStarred: false, folder: 'inbox',
  },
  {
    id: '5', sender: 'Jessica Park', senderEmail: 'jessica.park@hr.company.com',
    to: 'me@mailpilot.ai', subject: 'Team Offsite — October 15-17 Agenda',
    preview: 'Excited to share the agenda for our upcoming offsite! Three days of team building, strategy sessions…',
    body: "Hi everyone! 🎉\n\nExcited to share the agenda for our upcoming team offsite!\n\nOctober 15 (Day 1):\n• 9:00 AM — Welcome & icebreakers\n• 11:00 AM — Vision 2027 presentation\n• 2:00 PM — Cross-team hackathon kickoff\n\nOctober 16 (Day 2):\n• 9:00 AM — Hackathon continues\n• 3:00 PM — Presentations & demos\n• 6:00 PM — Team dinner at The Grand\n\nOctober 17 (Day 3):\n• 9:00 AM — Retrospective & goal setting\n• 12:00 PM — Closing lunch\n\nPlease RSVP by September 20!\n\nJessica",
    timestamp: days(2), isRead: true, isStarred: true, folder: 'inbox',
  },
  {
    id: '6', sender: 'Security Team', senderEmail: 'security@company.com',
    to: 'all@company.com', subject: '🔒 Mandatory Security Training Due Sept 30',
    preview: 'Reminder: All employees must complete the annual security awareness training by September 30…',
    body: "Important Security Notice\n\nAll employees must complete the annual security awareness training by September 30, 2026.\n\nThis year's module covers:\n• Phishing detection and reporting\n• Password hygiene and MFA best practices\n• Data classification and handling\n• Incident response procedures\n\nAccess the training at: security.company.com/training\n\nNon-compliance may result in temporary access restrictions.\n\nThank you,\nInformation Security Team",
    timestamp: days(3), isRead: false, isStarred: false, folder: 'inbox',
  },
  {
    id: '7', sender: 'Marcus Webb', senderEmail: 'marcus.w@devops.io',
    to: 'me@mailpilot.ai', subject: 'Infrastructure Migration Complete ✅',
    preview: 'Great news — the cloud migration is complete. All services are running on the new infrastructure…',
    body: "Hey team,\n\nGreat news — the cloud infrastructure migration is officially complete! 🎉\n\nMigration stats:\n• 47 microservices migrated\n• Zero downtime during cutover\n• 23% improvement in response latency\n• 15% cost reduction (projected annually)\n\nMonitoring dashboards are updated. Please report any anomalies in the #infra-alerts channel.\n\nHuge thanks to everyone who contributed to weekend shifts.\n\nMarcus",
    timestamp: days(4), isRead: true, isStarred: false, folder: 'inbox',
  },
  {
    id: '8', sender: 'Me', senderEmail: 'me@mailpilot.ai',
    to: 'emily.r@globalventures.com', subject: 'Re: Partnership Proposal — AI Integration',
    preview: "Thank you for reaching out, Emily. We're very excited about the potential collaboration…",
    body: "Hi Emily,\n\nThank you for reaching out regarding the partnership proposal. We're very excited about the potential collaboration between our teams.\n\nI've reviewed the initial proposal and have a few thoughts:\n\n1. The joint AI analytics development aligns perfectly with our roadmap\n2. We'd need to discuss data governance frameworks before sharing datasets\n3. Co-marketing for Q4 sounds ambitious but achievable\n\nTuesday at 2 PM EST works well for our team. I'll send a calendar invite.\n\nLooking forward to the conversation.\n\nBest regards",
    timestamp: days(1), isRead: true, isStarred: false, folder: 'sent',
  },
  {
    id: '9', sender: 'Me', senderEmail: 'me@mailpilot.ai',
    to: 'alex.t@financedesk.com', subject: 'Re: Monthly Budget Report — August 2026',
    preview: "Thanks for the detailed report, Alex. The reallocation suggestion makes sense…",
    body: "Hi Alex,\n\nThanks for the detailed report. A few notes:\n\n• The marketing underspend reallocation to operations makes sense — approved\n• Let's discuss the engineering forecast for Q4 in our Friday sync\n• Can you prepare a scenario analysis for 10% and 20% budget cuts?\n\nTalk soon.\n\nBest",
    timestamp: hours(8), isRead: true, isStarred: false, folder: 'sent',
  },
  {
    id: '10', sender: 'Me', senderEmail: 'me@mailpilot.ai',
    to: 'team@company.com', subject: 'Q4 Strategy Priorities',
    preview: "Hi team, here are the three pillars for our Q4 strategy that we discussed…",
    body: "Hi team,\n\nFollowing our strategy session, here are the three pillars for Q4:\n\n1. **Customer Retention** — Launch loyalty program by Oct 15\n2. **Product Excellence** — Ship v2.0 with AI features by Nov 30\n3. **Market Expansion** — Enter APAC with pilot customers by Dec 15\n\nEach pillar has a dedicated owner. Let's align on milestones in Thursday's standup.\n\nBest",
    timestamp: days(3), isRead: true, isStarred: true, folder: 'sent',
  },
  {
    id: '11', sender: 'Me', senderEmail: 'me@mailpilot.ai',
    to: 'conference@techsummit.com', subject: 'Speaking Proposal: AI in Enterprise Software',
    preview: "I'd like to propose a talk on how AI is transforming enterprise software development…",
    body: "Dear Conference Committee,\n\nI'd like to propose a talk for TechSummit 2027:\n\nTitle: \"AI Co-Pilots: Transforming Enterprise Software Development\"\n\nAbstract:\nThis talk explores how AI assistants are reshaping the way teams build, test, and deploy enterprise software...\n\n[Draft — needs more detail on case studies]",
    timestamp: days(2), isRead: true, isStarred: false, folder: 'drafts',
  },
  {
    id: '12', sender: 'Me', senderEmail: 'me@mailpilot.ai',
    to: 'hiking-club@groups.com', subject: 'Weekend Hiking Trip — Mt. Rainier',
    preview: "Hey everyone! Planning a hike up to Camp Muir on Mt. Rainier this weekend…",
    body: "Hey everyone!\n\nPlanning a hike up to Camp Muir on Mt. Rainier this Saturday.\n\nDetails:\n• Meet at Paradise trailhead at 6 AM\n• Round trip: ~9 miles, 4,600 ft elevation gain\n• Bring: layers, sunscreen, 3L water, lunch\n\nLet me know if you're in!\n\n[Draft — confirm weather forecast before sending]",
    timestamp: days(1), isRead: true, isStarred: false, folder: 'drafts',
  },
  {
    id: '13', sender: 'TechWeekly Newsletter', senderEmail: 'digest@techweekly.io',
    to: 'me@mailpilot.ai', subject: 'This Week in Tech: AI Agents, Quantum Computing & More',
    preview: 'Top stories: Google announces new AI agent framework, IBM achieves quantum advantage in materials…',
    body: "📰 TechWeekly Digest — September 14, 2026\n\n🔥 Top Stories:\n\n1. Google announces new AI agent framework with multi-model orchestration\n2. IBM achieves quantum advantage in materials science simulation\n3. EU passes comprehensive AI regulation bill\n4. SpaceX Starship completes first orbital refueling mission\n5. Apple Vision Pro 2 review: The headset that changes everything\n\nRead more at techweekly.io\n\n— The TechWeekly Team",
    timestamp: days(2), isRead: true, isStarred: false, folder: 'inbox',
  },
  {
    id: '14', sender: 'Olivia Martinez', senderEmail: 'olivia.m@events.company.com',
    to: 'me@mailpilot.ai', subject: '🎉 You\'re Invited: Annual Innovation Gala — Nov 8',
    preview: 'We are delighted to invite you to the Annual Innovation Gala celebrating breakthroughs in technology…',
    body: "Dear Colleague,\n\nYou are cordially invited to the Annual Innovation Gala!\n\n📅 Date: November 8, 2026\n🕖 Time: 7:00 PM — 11:00 PM\n📍 Venue: The Grand Ballroom, Metropolitan Hotel\n👔 Dress Code: Black Tie\n\nThe evening will feature:\n• Keynote by Dr. Fei-Fei Li on \"AI for Humanity\"\n• Innovation Awards ceremony\n• Networking reception & gourmet dinner\n• Live jazz ensemble\n\nPlease RSVP by October 15.\n\nWarm regards,\nOlivia Martinez\nEvents Director",
    timestamp: days(5), isRead: false, isStarred: true, folder: 'inbox',
  },
];

// ════════════════════════════════════════════════════════════
// ACTION LAYER — Phase 2: Replace with real API calls
// ════════════════════════════════════════════════════════════

/**
 * Email Actions
 * Each function encapsulates a single email operation.
 * Phase 2 will replace local state mutations with Gmail API calls.
 */
const emailActions = {
  /** Filter emails by search query (local). Phase 2: Gmail search API. */
  search(emails, query) {
    if (!query.trim()) return emails;
    const q = query.toLowerCase();
    return emails.filter(
      (e) =>
        e.sender.toLowerCase().includes(q) ||
        e.subject.toLowerCase().includes(q) ||
        e.preview.toLowerCase().includes(q) ||
        e.body.toLowerCase().includes(q) ||
        e.senderEmail.toLowerCase().includes(q)
    );
  },

  /** Mark an email as read. Phase 2: Gmail modify labels. */
  markAsRead(emailId, setEmails) {
    setEmails((prev) =>
      prev.map((e) => (e.id === emailId ? { ...e, isRead: true } : e))
    );
  },

  /** Toggle read / unread. Phase 2: Gmail modify labels. */
  toggleRead(emailId, setEmails) {
    setEmails((prev) =>
      prev.map((e) => (e.id === emailId ? { ...e, isRead: !e.isRead } : e))
    );
  },

  /** Toggle star. Phase 2: Gmail modify labels. */
  toggleStar(emailId, setEmails) {
    setEmails((prev) =>
      prev.map((e) => (e.id === emailId ? { ...e, isStarred: !e.isStarred } : e))
    );
  },

  /** Move to trash. Phase 2: Gmail trash endpoint. */
  deleteEmail(emailId, setEmails, setSelectedId) {
    setEmails((prev) =>
      prev.map((e) => (e.id === emailId ? { ...e, folder: 'trash' } : e))
    );
    setSelectedId(null);
  },

  /**
   * Send an email — ONLY after explicit user confirmation.
   * Phase 2: Gmail send API. The confirmation step remains in the UI.
   */
  sendEmail(composeData, setEmails) {
    const sent = {
      id: `sent-${Date.now()}`,
      sender: 'Me',
      senderEmail: 'me@mailpilot.ai',
      to: composeData.to,
      subject: composeData.subject || '(No Subject)',
      preview: (composeData.body || '').substring(0, 120),
      body: composeData.body || '',
      timestamp: new Date().toISOString(),
      isRead: true,
      isStarred: false,
      folder: 'sent',
    };
    setEmails((prev) => [sent, ...prev]);
    return sent;
  },

  /** Save as draft. Phase 2: Gmail drafts API. */
  saveDraft(composeData, setEmails) {
    const draft = {
      id: `draft-${Date.now()}`,
      sender: 'Me',
      senderEmail: 'me@mailpilot.ai',
      to: composeData.to || '',
      subject: composeData.subject || '(No Subject)',
      preview: (composeData.body || '').substring(0, 120),
      body: composeData.body || '',
      timestamp: new Date().toISOString(),
      isRead: true,
      isStarred: false,
      folder: 'drafts',
    };
    setEmails((prev) => [draft, ...prev]);
    return draft;
  },
};

// ════════════════════════════════════════════════════════════
// AI ACTION LAYER — Phase 2: Replace with Gemini / OpenAI API
// ════════════════════════════════════════════════════════════

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * AI Actions
 * Each async function simulates an AI call.
 * Phase 2 will swap the body with a fetch() to a real AI endpoint.
 * The AI NEVER sends email automatically; it only produces drafts
 * that the user must review and confirm.
 */
const aiActions = {
  /** Generate a reply draft. Never sends automatically. */
  async draftReply(email, instruction = '') {
    await delay(1400 + Math.random() * 800);
    const firstName = email.sender.split(' ')[0];
    const isFormal =
      instruction.toLowerCase().includes('formal') ||
      instruction.toLowerCase().includes('professional');
    const isFriendly =
      instruction.toLowerCase().includes('friendly') ||
      instruction.toLowerCase().includes('casual');

    if (isFormal) {
      return `Dear ${email.sender},\n\nThank you for your correspondence regarding "${email.subject}." I have carefully reviewed the contents and wish to acknowledge receipt.\n\nI shall provide a comprehensive response after due consideration of the matters raised therein.\n\nYours sincerely`;
    }
    if (isFriendly) {
      return `Hey ${firstName}! 👋\n\nThanks so much for this — really appreciate you sharing it!\n\nI've had a look through everything and it all looks fantastic. Let me gather my thoughts and I'll get back to you super soon.\n\nCatch you later! 🙌`;
    }
    return `Hi ${firstName},\n\nThank you for your email regarding "${email.subject}." I've reviewed the details and appreciate the thorough overview.\n\nI'll follow up with my detailed feedback shortly. Please let me know if there's anything urgent in the meantime.\n\nBest regards`;
  },

  /** Summarize an email. */
  async summarize(email) {
    await delay(1100 + Math.random() * 600);
    return (
      `📋 **Summary: "${email.subject}"**\n\n` +
      `**From:** ${email.sender} (${email.senderEmail})\n` +
      `**Priority:** ${email.isStarred ? '⭐ High' : 'Normal'}\n` +
      `**Status:** ${email.isRead ? 'Read' : '🔵 Unread'}\n\n` +
      `**Key Points:**\n` +
      `• Email discusses: ${email.subject.toLowerCase().replace(/—.*/, '').trim()}\n` +
      `• ${email.body.split('\n').filter((l) => l.startsWith('•') || l.startsWith('-') || l.match(/^\d+\./)).slice(0, 3).join('\n• ') || 'Contains detailed information requiring review'}\n\n` +
      `**Suggested Action:** Review and respond within 24 hours.`
    );
  },

  /** Revise a draft per user instruction. */
  async revise(draft, instruction) {
    await delay(1000 + Math.random() * 500);
    const inst = instruction.toLowerCase();
    if (inst.includes('shorter') || inst.includes('concise') || inst.includes('brief')) {
      const lines = draft.split('\n').filter((l) => l.trim());
      return lines.slice(0, Math.max(3, Math.ceil(lines.length * 0.6))).join('\n');
    }
    if (inst.includes('formal')) {
      return draft
        .replace(/Hey |Hi /g, 'Dear ')
        .replace(/Thanks/g, 'Thank you')
        .replace(/!\s/g, '. ')
        .replace(/Cheers/g, 'Sincerely')
        .replace(/Catch you later.*/g, 'I look forward to your response.');
    }
    if (inst.includes('friendly') || inst.includes('casual')) {
      return draft
        .replace(/Dear /g, 'Hey ')
        .replace(/Thank you/g, 'Thanks')
        .replace(/\.\s/g, '! ')
        .replace(/Sincerely/g, 'Cheers')
        .replace(/Yours sincerely/g, 'Talk soon');
    }
    return draft + '\n\n— [Revised as requested]';
  },

  /**
   * Prepare an email to send — returns a draft object for user review.
   * The user MUST confirm before emailActions.sendEmail() is called.
   */
  async prepareSend(email, replyBody) {
    await delay(400);
    return {
      to: email.senderEmail,
      subject: `Re: ${email.subject}`,
      body: replyBody,
      requiresConfirmation: true,
    };
  },
};

// ════════════════════════════════════════════════════════════
// HELPERS
// ════════════════════════════════════════════════════════════

function formatTimestamp(iso) {
  const date = new Date(iso);
  const diff = now - date;
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(diff / 3600000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  if (hrs < 24 && date.getDate() === now.getDate())
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (hrs < 48) return 'Yesterday';
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

function getInitials(name) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

const AVATAR_GRADIENTS = [
  'from-indigo-500 to-purple-600',
  'from-blue-500 to-cyan-500',
  'from-emerald-500 to-teal-600',
  'from-orange-500 to-red-500',
  'from-pink-500 to-rose-600',
  'from-violet-500 to-fuchsia-600',
  'from-amber-500 to-orange-500',
  'from-sky-500 to-blue-600',
];

function avatarGradient(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return AVATAR_GRADIENTS[Math.abs(h) % AVATAR_GRADIENTS.length];
}

// ════════════════════════════════════════════════════════════
// COMPONENTS
// ════════════════════════════════════════════════════════════

/* ── Sidebar ──────────────────────────────────────────────── */
function Sidebar({ folder, setFolder, counts, onCompose, isOpen, onClose }) {
  const items = [
    { id: 'inbox',   label: 'Inbox',   Icon: Inbox,    count: counts.inbox },
    { id: 'starred', label: 'Starred', Icon: Star,     count: counts.starred },
    { id: 'sent',    label: 'Sent',    Icon: Send,     count: counts.sent },
    { id: 'drafts',  label: 'Drafts',  Icon: FileText, count: counts.drafts },
    { id: 'trash',   label: 'Trash',   Icon: Trash2,   count: counts.trash },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full z-50 w-[260px] sidebar-gradient
          flex flex-col py-5 px-3
          transform transition-transform duration-300 ease-out
          lg:translate-x-0 lg:static lg:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-400 to-purple-500 flex items-center justify-center shadow-glow-sm">
            <Mail className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight leading-none">
              MailPilot
            </h1>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-brand-300">
              AI
            </span>
          </div>
        </div>

        {/* Compose */}
        <button
          onClick={() => { onCompose(); onClose(); }}
          className="btn-compose flex items-center gap-2 px-5 py-3 rounded-xl text-white font-semibold text-sm mb-6 mx-1"
        >
          <Plus className="w-5 h-5" />
          Compose
        </button>

        {/* Nav items */}
        <nav className="flex-1 space-y-1">
          {items.map(({ id, label, Icon, count }) => {
            const active = folder === id;
            return (
              <button
                key={id}
                onClick={() => { setFolder(id); onClose(); }}
                className={`
                  w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium
                  transition-all duration-200 group
                  ${active
                    ? 'bg-white/15 text-white shadow-glow-sm'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'}
                `}
              >
                <Icon className={`w-[18px] h-[18px] ${active ? 'text-brand-300' : 'text-gray-400 group-hover:text-brand-300'}`} />
                <span className="flex-1 text-left">{label}</span>
                {count > 0 && (
                  <span
                    className={`
                      text-xs px-2 py-0.5 rounded-full font-semibold
                      ${active
                        ? 'bg-brand-500 text-white'
                        : 'bg-white/10 text-gray-300'}
                    `}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="mt-auto px-3 pt-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
              MP
            </div>
            <div className="text-xs">
              <p className="text-white font-medium">Pilot User</p>
              <p className="text-gray-400">me@mailpilot.ai</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

/* ── Email List Item ──────────────────────────────────────── */
function EmailListItem({ email, selected, onClick, onStar, dark }) {
  return (
    <button
      onClick={onClick}
      className={`
        email-row w-full flex items-start gap-3 px-4 py-3.5 text-left rounded-xl
        border border-transparent
        ${selected
          ? 'bg-brand-50 border-brand-200 dark:bg-brand-950/40 dark:border-brand-800/50 shadow-sm'
          : email.isRead
            ? 'hover:bg-gray-50 dark:hover:bg-white/5'
            : 'bg-white dark:bg-white/[0.03] hover:bg-brand-50/50 dark:hover:bg-brand-950/20 shadow-sm'}
      `}
    >
      {/* Avatar */}
      <div
        className={`
          w-10 h-10 rounded-full bg-gradient-to-br ${avatarGradient(email.sender)}
          flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5
        `}
      >
        {getInitials(email.sender)}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          {!email.isRead && (
            <span className="w-2 h-2 rounded-full bg-brand-500 flex-shrink-0" />
          )}
          <span
            className={`text-sm truncate ${
              email.isRead
                ? 'text-gray-600 dark:text-gray-400'
                : 'font-semibold text-gray-900 dark:text-white'
            }`}
          >
            {email.sender}
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500 ml-auto flex-shrink-0">
            {formatTimestamp(email.timestamp)}
          </span>
        </div>
        <p
          className={`text-sm truncate mb-0.5 ${
            email.isRead
              ? 'text-gray-500 dark:text-gray-500'
              : 'font-medium text-gray-800 dark:text-gray-200'
          }`}
        >
          {email.subject}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-600 truncate">
          {email.preview}
        </p>
      </div>

      {/* Star */}
      <button
        onClick={(e) => { e.stopPropagation(); onStar(); }}
        className="flex-shrink-0 mt-1 p-1 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors"
      >
        <Star
          className={`w-4 h-4 transition-colors ${
            email.isStarred
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-gray-300 dark:text-gray-600 hover:text-yellow-400'
          }`}
        />
      </button>
    </button>
  );
}

/* ── Email View ───────────────────────────────────────────── */
function EmailView({ email, onBack, onStar, onToggleRead, onDelete, onReply }) {
  if (!email) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-400 dark:text-gray-600 p-8">
        <Mail className="w-16 h-16 mb-4 opacity-30" />
        <p className="text-lg font-medium">Select an email to read</p>
        <p className="text-sm mt-1">Choose from the list on the left</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden animate-fade-in">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100 dark:border-gray-800">
        <button
          onClick={onBack}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1" />
        <button
          onClick={onReply}
          className="p-2 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-950/30 text-gray-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
          title="Reply"
        >
          <Reply className="w-[18px] h-[18px]" />
        </button>
        <button
          className="p-2 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-950/30 text-gray-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
          title="Forward"
        >
          <Forward className="w-[18px] h-[18px]" />
        </button>
        <button
          onClick={onStar}
          className="p-2 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-900/20 text-gray-500 transition-colors"
          title="Star"
        >
          <Star
            className={`w-[18px] h-[18px] ${
              email.isStarred ? 'fill-yellow-400 text-yellow-400' : ''
            }`}
          />
        </button>
        <button
          onClick={onToggleRead}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
          title={email.isRead ? 'Mark unread' : 'Mark read'}
        >
          {email.isRead ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
        </button>
        <button
          onClick={onDelete}
          className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-gray-500 hover:text-red-500 transition-colors"
          title="Delete"
        >
          <Trash2 className="w-[18px] h-[18px]" />
        </button>
      </div>

      {/* Email content */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          {email.subject}
        </h2>

        <div className="flex items-start gap-3 mb-6">
          <div
            className={`w-11 h-11 rounded-full bg-gradient-to-br ${avatarGradient(email.sender)} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}
          >
            {getInitials(email.sender)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="font-semibold text-gray-900 dark:text-white">
                {email.sender}
              </span>
              <span className="text-xs text-gray-400">
                &lt;{email.senderEmail}&gt;
              </span>
            </div>
            <div className="text-xs text-gray-400 mt-0.5">
              To: {email.to} · {new Date(email.timestamp).toLocaleString()}
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
          {email.body}
        </div>
      </div>

      {/* Quick reply bar */}
      <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-800">
        <button
          onClick={onReply}
          className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400 hover:border-brand-300 dark:hover:border-brand-700 hover:text-brand-600 dark:hover:text-brand-400 transition-all"
        >
          <Reply className="w-4 h-4" />
          Click to reply…
        </button>
      </div>
    </div>
  );
}

/* ── Compose Modal ────────────────────────────────────────── */
function ComposeModal({
  data, setData, onSend, onSaveDraft, onClose, confirmStep, setConfirmStep,
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center modal-backdrop animate-fade-in">
      <div
        className="
          w-full max-w-2xl mx-4 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl
          border border-gray-200 dark:border-gray-700 overflow-hidden animate-scale-in
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-800 dark:text-white">
            {confirmStep ? '✉️ Confirm Send' : '✏️ New Message'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {confirmStep ? (
          /* ── Confirmation View ── */
          <div className="p-6">
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-5">
              <p className="text-sm font-medium text-amber-800 dark:text-amber-300 mb-1">
                ⚠️ Review before sending
              </p>
              <p className="text-xs text-amber-600 dark:text-amber-400">
                Please verify the recipient and message content. This action cannot be undone.
              </p>
            </div>
            <div className="space-y-3 text-sm mb-6">
              <div>
                <span className="font-medium text-gray-500 dark:text-gray-400">To:</span>{' '}
                <span className="text-gray-800 dark:text-gray-200">{data.to}</span>
              </div>
              <div>
                <span className="font-medium text-gray-500 dark:text-gray-400">Subject:</span>{' '}
                <span className="text-gray-800 dark:text-gray-200">{data.subject || '(No Subject)'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-500 dark:text-gray-400 block mb-1">Message:</span>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-gray-700 dark:text-gray-300 whitespace-pre-wrap max-h-40 overflow-y-auto text-sm">
                  {data.body || '(Empty)'}
                </div>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmStep(false)}
                className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                ← Back to Edit
              </button>
              <button
                onClick={onSend}
                className="btn-send px-6 py-2.5 rounded-xl text-white text-sm font-semibold flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Confirm & Send
              </button>
            </div>
          </div>
        ) : (
          /* ── Compose Form ── */
          <div className="p-5 space-y-4">
            <div>
              <input
                type="email"
                placeholder="To"
                value={data.to}
                onChange={(e) => setData({ ...data, to: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400"
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Subject"
                value={data.subject}
                onChange={(e) => setData({ ...data, subject: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400"
              />
            </div>
            <div>
              <textarea
                rows={10}
                placeholder="Write your message…"
                value={data.body}
                onChange={(e) => setData({ ...data, body: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  if (!data.to.trim()) return;
                  setConfirmStep(true);
                }}
                disabled={!data.to.trim()}
                className="btn-compose px-6 py-2.5 rounded-xl text-white text-sm font-semibold flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
              >
                <SendIcon className="w-4 h-4" />
                Send
              </button>
              <button
                onClick={onSaveDraft}
                className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Save Draft
              </button>
              <div className="flex-1" />
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                Discard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── AI Panel ─────────────────────────────────────────────── */
function AIPanel({ email, onApplyDraft, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);
  const prevEmailId = useRef(null);

  // Reset when email changes
  useEffect(() => {
    if (email?.id !== prevEmailId.current) {
      setMessages([]);
      prevEmailId.current = email?.id;
    }
  }, [email]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const addUserMsg = (text) =>
    setMessages((p) => [...p, { role: 'user', text, ts: Date.now() }]);
  const addAiMsg = (text) =>
    setMessages((p) => [...p, { role: 'ai', text, ts: Date.now() }]);

  const runAction = useCallback(
    async (label, fn) => {
      if (!email || loading) return;
      addUserMsg(label);
      setLoading(true);
      try {
        const result = await fn();
        addAiMsg(result);
      } catch {
        addAiMsg('⚠️ Something went wrong. Please try again.');
      }
      setLoading(false);
    },
    [email, loading]
  );

  const handleSend = () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');

    const lower = text.toLowerCase();
    if (lower.includes('summarize') || lower.includes('summary')) {
      runAction(text, () => aiActions.summarize(email));
    } else if (lower.includes('draft') || lower.includes('reply') || lower.includes('respond')) {
      runAction(text, () => aiActions.draftReply(email, text));
    } else if (lower.includes('revise') || lower.includes('rewrite') || lower.includes('make it')) {
      const lastAi = [...messages].reverse().find((m) => m.role === 'ai');
      if (lastAi) {
        runAction(text, () => aiActions.revise(lastAi.text, text));
      } else {
        runAction(text, () => aiActions.draftReply(email, text));
      }
    } else {
      // Generic: treat as draft instruction
      runAction(text, () => aiActions.draftReply(email, text));
    }
  };

  const quickActions = [
    { label: '📝 Draft Reply', fn: () => runAction('Draft a reply', () => aiActions.draftReply(email)) },
    { label: '📋 Summarize',   fn: () => runAction('Summarize this email', () => aiActions.summarize(email)) },
    { label: '🎩 Formal Reply', fn: () => runAction('Draft a formal reply', () => aiActions.draftReply(email, 'formal')) },
    { label: '😊 Friendly Reply', fn: () => runAction('Draft a friendly reply', () => aiActions.draftReply(email, 'friendly')) },
  ];

  return (
    <div className="w-full lg:w-[360px] flex-shrink-0 border-l border-gray-100 dark:border-gray-800 flex flex-col bg-white dark:bg-surface-900 animate-slide-right overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-brand-50 to-purple-50 dark:from-brand-950/30 dark:to-purple-950/20">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center shadow-glow-sm">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">AI Assistant</h3>
          <p className="text-[10px] text-gray-500 dark:text-gray-400">Powered by MailPilot AI</p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {!email ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-gray-400 dark:text-gray-600">
          <Bot className="w-12 h-12 mb-3 opacity-30" />
          <p className="text-sm font-medium">Select an email first</p>
          <p className="text-xs mt-1">I can help draft replies, summarize, and more</p>
        </div>
      ) : (
        <>
          {/* Quick Actions */}
          <div className="px-3 py-3 border-b border-gray-100 dark:border-gray-800">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-semibold mb-2 px-1">
              Quick Actions
            </p>
            <div className="flex flex-wrap gap-1.5">
              {quickActions.map((a) => (
                <button
                  key={a.label}
                  onClick={a.fn}
                  disabled={loading}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-brand-50 dark:hover:bg-brand-950/30 hover:border-brand-300 dark:hover:border-brand-700 hover:text-brand-700 dark:hover:text-brand-300 transition-all disabled:opacity-40"
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div ref={listRef} className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.length === 0 && !loading && (
              <div className="text-center py-8 text-gray-400 dark:text-gray-600">
                <Wand2 className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-xs">Ask me anything about this email</p>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2 animate-slide-up ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.role === 'ai' && (
                  <div className="w-6 h-6 rounded-md bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center flex-shrink-0 mt-1">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                )}
                <div
                  className={`
                    max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed
                    ${msg.role === 'user'
                      ? 'bg-brand-600 text-white rounded-br-md'
                      : 'bg-brand-50 dark:bg-brand-950/40 text-gray-800 dark:text-gray-200 rounded-bl-md border border-brand-100 dark:border-brand-900/50'
                    }
                  `}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>

                  {/* Apply to Compose button on AI drafts (not summaries) */}
                  {msg.role === 'ai' && !msg.text.startsWith('📋') && !msg.text.startsWith('⚠️') && (
                    <button
                      onClick={() => onApplyDraft(msg.text)}
                      className="mt-2 flex items-center gap-1.5 text-xs font-medium text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors"
                    >
                      <PenLine className="w-3 h-3" />
                      Apply to Compose
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex gap-2 items-start">
                <div className="w-6 h-6 rounded-md bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
                <div className="bg-brand-50 dark:bg-brand-950/40 rounded-xl rounded-bl-md px-4 py-3 border border-brand-100 dark:border-brand-900/50">
                  <div className="flex gap-1.5">
                    <span className="typing-dot animate-typing-1" />
                    <span className="typing-dot animate-typing-2" />
                    <span className="typing-dot animate-typing-3" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-100 dark:border-gray-800">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder="Ask AI anything…"
                disabled={loading}
                className="flex-1 px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder-gray-400 disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="p-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-purple-600 text-white hover:shadow-glow-sm transition-all disabled:opacity-40"
              >
                <SendIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ── Toast Notification ───────────────────────────────────── */
function Toast({ message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-[200] animate-slide-up">
      <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-2xl text-sm font-medium">
        <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
        {message}
        <button onClick={onClose} className="ml-2 text-gray-400 hover:text-white dark:hover:text-gray-900">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// MAIN APP
// ════════════════════════════════════════════════════════════

export default function App() {
  // ── State ──
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia?.('(prefers-color-scheme: dark)').matches || false;
    }
    return false;
  });
  const [emails, setEmails] = useState(INITIAL_EMAILS);
  const [folder, setFolder] = useState('inbox');
  const [selectedId, setSelectedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCompose, setShowCompose] = useState(false);
  const [composeData, setComposeData] = useState({ to: '', subject: '', body: '' });
  const [confirmSend, setConfirmSend] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [mobileView, setMobileView] = useState('list'); // 'list' | 'email'

  // ── Dark mode class ──
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // ── Computed ──
  const filteredEmails = useMemo(() => {
    let list = emails.filter((e) => {
      if (folder === 'starred') return e.isStarred && e.folder !== 'trash';
      return e.folder === folder;
    });
    if (searchQuery) list = emailActions.search(list, searchQuery);
    return list.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [emails, folder, searchQuery]);

  const selectedEmail = useMemo(
    () => emails.find((e) => e.id === selectedId) || null,
    [emails, selectedId]
  );

  const counts = useMemo(
    () => ({
      inbox:   emails.filter((e) => e.folder === 'inbox' && !e.isRead).length,
      starred: emails.filter((e) => e.isStarred && e.folder !== 'trash').length,
      sent:    emails.filter((e) => e.folder === 'sent').length,
      drafts:  emails.filter((e) => e.folder === 'drafts').length,
      trash:   emails.filter((e) => e.folder === 'trash').length,
    }),
    [emails]
  );

  // ── Handlers ──
  const handleSelectEmail = useCallback(
    (id) => {
      setSelectedId(id);
      emailActions.markAsRead(id, setEmails);
      setMobileView('email');
    },
    []
  );

  const handleStar = useCallback((id) => {
    emailActions.toggleStar(id, setEmails);
  }, []);

  const handleToggleRead = useCallback((id) => {
    emailActions.toggleRead(id, setEmails);
  }, []);

  const handleDelete = useCallback((id) => {
    emailActions.deleteEmail(id, setEmails, setSelectedId);
    setMobileView('list');
    showToast('Email moved to trash');
  }, []);

  const handleSendEmail = useCallback(() => {
    emailActions.sendEmail(composeData, setEmails);
    setShowCompose(false);
    setConfirmSend(false);
    setComposeData({ to: '', subject: '', body: '' });
    showToast('Email sent successfully ✈️');
  }, [composeData]);

  const handleSaveDraft = useCallback(() => {
    emailActions.saveDraft(composeData, setEmails);
    setShowCompose(false);
    setConfirmSend(false);
    setComposeData({ to: '', subject: '', body: '' });
    showToast('Draft saved');
  }, [composeData]);

  const handleReply = useCallback(() => {
    if (!selectedEmail) return;
    setComposeData({
      to: selectedEmail.senderEmail,
      subject: `Re: ${selectedEmail.subject}`,
      body: '',
    });
    setConfirmSend(false);
    setShowCompose(true);
  }, [selectedEmail]);

  const handleApplyAIDraft = useCallback(
    (text) => {
      if (!selectedEmail) return;
      setComposeData({
        to: selectedEmail.senderEmail,
        subject: `Re: ${selectedEmail.subject}`,
        body: text,
      });
      setConfirmSend(false);
      setShowCompose(true);
    },
    [selectedEmail]
  );

  const openCompose = useCallback(() => {
    setComposeData({ to: '', subject: '', body: '' });
    setConfirmSend(false);
    setShowCompose(true);
  }, []);

  const showToast = (message) => setToast(message);

  // ── Render ──
  return (
    <div className="flex h-screen overflow-hidden bg-surface-50 dark:bg-surface-900">
      {/* Sidebar */}
      <Sidebar
        folder={folder}
        setFolder={(f) => { setFolder(f); setSelectedId(null); setSearchQuery(''); setMobileView('list'); }}
        counts={counts}
        onCompose={openCompose}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="flex items-center gap-3 px-4 lg:px-6 py-3 border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-surface-800/80 backdrop-blur-md">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search */}
          <div className="flex-1 max-w-xl relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search emails…"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 border border-transparent focus:border-brand-500 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            {/* AI Toggle */}
            <button
              onClick={() => setShowAI((p) => !p)}
              className={`
                p-2.5 rounded-xl transition-all relative
                ${showAI
                  ? 'bg-gradient-to-r from-brand-500 to-purple-600 text-white shadow-glow-sm'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500'}
              `}
              title="AI Assistant"
            >
              <Sparkles className="w-5 h-5" />
              {showAI && (
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white dark:border-surface-900" />
              )}
            </button>

            {/* Dark mode */}
            <button
              onClick={() => setDarkMode((d) => !d)}
              className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-all"
              title={darkMode ? 'Light mode' : 'Dark mode'}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Email List */}
          <div
            className={`
              w-full lg:w-[380px] xl:w-[420px] flex-shrink-0
              border-r border-gray-100 dark:border-gray-800
              flex flex-col overflow-hidden bg-white dark:bg-surface-900
              ${mobileView === 'email' ? 'hidden lg:flex' : 'flex'}
            `}
          >
            {/* Folder label */}
            <div className="flex items-center justify-between px-5 py-3">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white capitalize">
                {folder}
              </h2>
              <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                {filteredEmails.length} {filteredEmails.length === 1 ? 'email' : 'emails'}
              </span>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-0.5">
              {filteredEmails.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-600">
                  {searchQuery ? (
                    <>
                      <Search className="w-10 h-10 mb-3 opacity-30" />
                      <p className="text-sm font-medium">No results found</p>
                      <p className="text-xs mt-1">Try a different search term</p>
                    </>
                  ) : (
                    <>
                      <Inbox className="w-10 h-10 mb-3 opacity-30" />
                      <p className="text-sm font-medium">No emails here</p>
                    </>
                  )}
                </div>
              ) : (
                filteredEmails.map((email) => (
                  <EmailListItem
                    key={email.id}
                    email={email}
                    selected={selectedId === email.id}
                    onClick={() => handleSelectEmail(email.id)}
                    onStar={() => handleStar(email.id)}
                  />
                ))
              )}
            </div>
          </div>

          {/* Email View */}
          <div
            className={`
              flex-1 flex flex-col min-w-0 bg-white dark:bg-surface-900
              ${mobileView === 'list' && selectedId === null ? 'hidden lg:flex' : ''}
              ${mobileView === 'list' ? 'hidden lg:flex' : 'flex'}
            `}
          >
            <EmailView
              email={selectedEmail}
              onBack={() => setMobileView('list')}
              onStar={() => selectedId && handleStar(selectedId)}
              onToggleRead={() => selectedId && handleToggleRead(selectedId)}
              onDelete={() => selectedId && handleDelete(selectedId)}
              onReply={handleReply}
            />
          </div>

          {/* AI Panel */}
          {showAI && (
            <AIPanel
              email={selectedEmail}
              onApplyDraft={handleApplyAIDraft}
              onClose={() => setShowAI(false)}
            />
          )}
        </div>
      </div>

      {/* Compose Modal */}
      {showCompose && (
        <ComposeModal
          data={composeData}
          setData={setComposeData}
          onSend={handleSendEmail}
          onSaveDraft={handleSaveDraft}
          onClose={() => { setShowCompose(false); setConfirmSend(false); }}
          confirmStep={confirmSend}
          setConfirmStep={setConfirmSend}
        />
      )}

      {/* Toast */}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
