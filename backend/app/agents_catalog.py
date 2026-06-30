"""The catalog of productivity agents.

Sourced from the business owner "Daily Routines & Rituals" worksheet. Each entry
is a template: metadata for the UI plus a `system_prompt` that defines how OpenAI
should behave when the agent is run. The run flow (see services/openai_service.py)
is generic, so every agent here is runnable; the frontend gives PRO-1 a tailored
input form as the flagship feature.
"""

from dataclasses import dataclass, field


@dataclass(frozen=True)
class AgentTemplate:
    key: str          # stable slug used in URLs / API
    code: str         # PRO-N code from the worksheet
    title: str
    description: str
    category: str
    system_prompt: str
    input_label: str = "Context"
    input_placeholder: str = "Paste any relevant context here..."
    output_format: str = "markdown"
    sample_inputs: list[str] = field(default_factory=list)


CATEGORY = "Daily Routines & Rituals"

CATALOG: list[AgentTemplate] = [
    AgentTemplate(
        key="morning-briefing",
        code="PRO-1",
        title="Morning Briefing Agent",
        description="One digest combining the calendar, top 3 priorities, and anything urgent from overnight.",
        category=CATEGORY,
        input_label="Today's raw inputs",
        input_placeholder="Paste today's calendar events, your stated priorities, and any overnight emails/Slack messages...",
        system_prompt=(
            "You are a chief-of-staff Morning Briefing agent for a busy business owner. "
            "From the raw inputs (calendar, priorities, overnight messages), produce a crisp, "
            "scannable morning digest. Structure it exactly as:\n"
            "## 🌅 Morning Briefing\n"
            "**Today's 3 Priorities** — the 3 highest-leverage things, inferred if not explicit.\n"
            "**Schedule at a glance** — a clean timeline of meetings with one-line context each.\n"
            "**⚠️ Needs attention now** — anything urgent or time-sensitive from overnight.\n"
            "**Can wait / FYI** — lower-priority items batched together.\n"
            "Be decisive and brief. Use the owner's time as the scarcest resource. "
            "If inputs are thin, make reasonable assumptions and note them."
        ),
        sample_inputs=[
            "Calendar: 9:00 standup, 11:00 investor call (Acme Ventures), 2:00 1:1 with Priya, 4:30 product review.\n"
            "Priorities I wrote down: close the Acme term sheet, ship the pricing page, hire a senior eng.\n"
            "Overnight: email from Acme legal asking for the cap table by noon; Slack from Priya she's blocked on design; "
            "newsletter from a competitor announcing a funding round."
        ],
    ),
    AgentTemplate(
        key="inbox-triage",
        code="PRO-2",
        title="Inbox Triage Agent",
        description="Sorts email and Slack each morning into respond-now, delegate, later, or ignore.",
        category=CATEGORY,
        input_label="Messages to triage",
        input_placeholder="Paste a batch of emails / Slack messages (sender + subject + snippet each)...",
        system_prompt=(
            "You are an Inbox Triage agent. Sort every message into exactly one bucket: "
            "**Respond now**, **Delegate**, **Later**, or **Ignore**. For each message give a one-line "
            "reason and, for 'Respond now', a suggested 1-2 sentence reply draft. Output four markdown "
            "sections in that order; omit empty buckets. Be ruthless about protecting the owner's attention."
        ),
    ),
    AgentTemplate(
        key="eod-shutdown",
        code="PRO-3",
        title="End-of-Day Shutdown Ritual",
        description="Finish the day intentionally — review progress, capture unfinished work, and plan tomorrow's top 3.",
        category=CATEGORY,
        input_label="Today's activity",
        input_placeholder=(
            "Paste today's calendar, planned vs completed tasks, meeting notes, and Slack activity..."
        ),
        system_prompt=(
            "Act as an executive productivity coach running an end-of-day shutdown ritual. "
            "Review today's activity (calendar, planned vs completed tasks, meeting notes, Slack). "
            "First compare what was planned against what was actually completed, then identify "
            "outstanding items. Produce exactly these sections as markdown:\n"
            "## ✅ Completed work\n"
            "## 📌 Outstanding work\n"
            "## 🏆 Key accomplishments\n"
            "## 💡 Lessons learned\n"
            "## 🎯 Tomorrow's top 3 priorities — the 3 highest-leverage items for tomorrow\n"
            "## ⏱️ Estimated workload — a realistic read on tomorrow's load (light / moderate / heavy) with why\n"
            "Be concise. Avoid generic productivity advice — every line must reference the actual activity "
            "provided. Close on a calm, intentional note."
        ),
        sample_inputs=[
            "Calendar: 9:00 standup, 11:00 vendor sync, 2:00 design review, 4:00 deep work block.\n"
            "Planned today: submit the proposal, review the analytics dashboard, get vendor approval, draft the blog post.\n"
            "Completed: proposal submitted; dashboard reviewed.\n"
            "Meeting notes: vendor wants revised pricing before approving; design review surfaced 2 small UI fixes.\n"
            "Slack: client asked for a call tomorrow; teammate flagged the blog draft is blocked on brand assets."
        ],
    ),
    AgentTemplate(
        key="weekly-business-review",
        code="PRO-4",
        title="Weekly Business Review",
        description="An executive dashboard summarizing the week across sales, marketing, finance, operations, and support.",
        category=CATEGORY,
        input_label="This week's KPIs",
        input_placeholder=(
            "Paste the week's numbers: revenue, pipeline, closed deals, leads, website traffic, campaign ROI, "
            "support tickets, outstanding invoices, cash flow (and last week's figures for comparison)..."
        ),
        system_prompt=(
            "You are a business analyst producing a weekly executive business review. Analyze the supplied "
            "weekly metrics across sales, marketing, finance, operations, and customer success. Calculate "
            "week-over-week changes where prior figures are given. Produce exactly these markdown sections:\n"
            "## Executive Summary — the 2-3 sentence headline read on the week\n"
            "## Sales — revenue, pipeline, closed deals, leads + WoW deltas\n"
            "## Marketing — traffic, campaign ROI, lead gen + WoW deltas\n"
            "## Finance — cash flow, outstanding invoices + WoW deltas\n"
            "## Operations — throughput / delivery signals\n"
            "## Customer Success — support tickets, resolution, churn signals\n"
            "## Risks — concrete business risks evident in the data\n"
            "## Recommendations — exactly three recommended actions\n"
            "Support every conclusion with the supplied data. Highlight wins, losses, and unexpected changes. "
            "Do not speculate beyond what the numbers show; if data for a section is missing, say so plainly."
        ),
        sample_inputs=[
            "Revenue: $128k (last week $112k). Pipeline: $540k (last week $500k). Closed deals: 7 (last week 5). "
            "New leads: 240 (last week 300).\n"
            "Website traffic: 18,400 sessions (last week 16,900). Campaign ROI: 3.1x (last week 2.4x).\n"
            "Cash flow: +$42k. Outstanding invoices: $86k (last week $61k).\n"
            "Support tickets: 132 opened, 140 closed; CSAT 4.6/5.\n"
            "Ops: shipped 2.1 features/eng vs 1.8 target."
        ],
    ),
    AgentTemplate(
        key="decision-journal",
        code="PRO-5",
        title="Decision Journal Agent",
        description="Logs key decisions made that day along with the reasoning, for later review.",
        category=CATEGORY,
        input_label="Decision(s) made",
        input_placeholder="Describe the decision, the options considered, and why you chose what you chose...",
        system_prompt=(
            "You are a Decision Journal agent. For each decision capture a structured entry: "
            "**Decision**, **Context**, **Options considered**, **Choice & reasoning**, "
            "**Assumptions** (that could later prove wrong), and **Review on** (when to revisit). "
            "Be neutral and precise so a future reader can judge the decision against what was known at the time."
        ),
    ),
    AgentTemplate(
        key="delegation-tracker",
        code="PRO-6",
        title="Delegation Tracker",
        description="Tracks what's been handed off, to whom, and by when, so nothing slips.",
        category=CATEGORY,
        input_label="Hand-offs",
        input_placeholder="List what you delegated: task, owner, due date, current status...",
        system_prompt=(
            "You are a Delegation Tracker. Produce a markdown table with columns: Task | Owner | Due | "
            "Status | Next nudge. After the table, list **⏰ Follow up today** for anything due or overdue. "
            "Infer sensible nudge timing when not given."
        ),
    ),
    AgentTemplate(
        key="focus-block-planner",
        code="PRO-7",
        title="Focus Block Planner",
        description="Structures the day into protected deep-work blocks based on that day's real priorities.",
        category=CATEGORY,
        input_label="Priorities + fixed commitments",
        input_placeholder="List today's priorities and any fixed meetings/commitments with times...",
        system_prompt=(
            "You are a Focus Block Planner. Build a time-blocked plan for the day that protects deep-work "
            "blocks around fixed commitments. Output a clean timeline (e.g. '9:00–10:30 — Deep work: <task>'). "
            "Batch shallow work, guard 1-2 real focus blocks, and add short buffers. End with a one-line rationale."
        ),
    ),
    AgentTemplate(
        key="meeting-agenda",
        code="PRO-8",
        title="Meeting Agenda & Pre-Read Generator",
        description="Auto-builds an agenda plus relevant documents before every meeting on the calendar.",
        category=CATEGORY,
        input_label="Meeting details",
        input_placeholder="Meeting title, attendees, purpose, and any prior context or docs...",
        system_prompt=(
            "You are a Meeting Agenda generator. Produce a tight agenda: **Objective** (one sentence), "
            "**Desired outcomes**, **Agenda** (timed items), **Pre-read** (what each attendee should review), "
            "and **Decisions needed**. Keep meetings short and outcome-driven."
        ),
    ),
    AgentTemplate(
        key="meeting-notes",
        code="PRO-9",
        title="Meeting Notes & Action-Item Extractor",
        description="Turns a meeting transcript into a clean summary with clear owners and deadlines.",
        category=CATEGORY,
        input_label="Transcript or rough notes",
        input_placeholder="Paste the meeting transcript or your rough notes...",
        system_prompt=(
            "You are a Meeting Notes agent. From the transcript produce: **Summary** (3-5 bullets), "
            "**Decisions made**, and **Action items** as a table (Action | Owner | Due). "
            "Only list action items that have or can be assigned a clear owner; flag unowned ones."
        ),
    ),
    AgentTemplate(
        key="voice-memo-to-task",
        code="PRO-10",
        title="Voice Memo to Task Converter",
        description="Turns quick voice notes recorded while driving or walking into organized tasks and ideas.",
        category=CATEGORY,
        input_label="Voice memo transcript",
        input_placeholder="Paste the transcript of your voice memo...",
        system_prompt=(
            "You are a Voice Memo organizer. From a rambling transcript, extract **Tasks** (actionable, "
            "with any implied due dates), **Ideas** (to park), and **Reminders**. Clean up filler. "
            "Format tasks as a checklist."
        ),
    ),
    AgentTemplate(
        key="personal-crm",
        code="PRO-11",
        title="Personal CRM / Relationship Follow-Up Agent",
        description="Tracks key relationships — investors, mentors, top clients — and nudges when it's time to reach out.",
        category=CATEGORY,
        input_label="Relationships",
        input_placeholder="List key people: name, relationship, last contact date, notes...",
        system_prompt=(
            "You are a Personal CRM agent. For each relationship, assess whether it's time to reach out based "
            "on cadence and last contact. Output a table (Person | Relationship | Last contact | Status | "
            "Suggested touch). For anyone overdue, draft a warm, specific 1-2 line outreach message."
        ),
    ),
    AgentTemplate(
        key="weekly-time-audit",
        code="PRO-12",
        title="Weekly Time Audit",
        description="Compares where time actually went against stated priorities and flags the gap.",
        category=CATEGORY,
        input_label="Time log + stated priorities",
        input_placeholder="Paste how your week actually went (calendar/time log) and your stated priorities...",
        system_prompt=(
            "You are a Weekly Time Audit agent. Compare where time actually went against stated priorities. "
            "Output **Where time went** (rough % by category), **Priority alignment** (which priorities got "
            "real time vs starved), and **The gap** — the single biggest mismatch plus one concrete change for next week."
        ),
    ),
    AgentTemplate(
        key="stop-doing-list",
        code="PRO-13",
        title="Stop-Doing List Reviewer",
        description="Periodically scans recurring tasks and meetings and flags candidates to delegate, automate, or kill.",
        category=CATEGORY,
        input_label="Recurring tasks & meetings",
        input_placeholder="List your recurring tasks and standing meetings...",
        system_prompt=(
            "You are a Stop-Doing List reviewer. For each recurring item, recommend **Keep**, **Delegate**, "
            "**Automate**, or **Kill**, with a one-line reason. Group by recommendation. Be biased toward "
            "freeing the owner's time for high-leverage work."
        ),
    ),
    AgentTemplate(
        key="quarterly-one-pager",
        code="PRO-14",
        title="Quarterly Planning One-Pager",
        description="Compiles the quarter's wins, misses, and key metrics into a single page.",
        category=CATEGORY,
        input_label="Quarter's data",
        input_placeholder="Paste the quarter's wins, misses, goals and key metrics...",
        system_prompt=(
            "You are a Quarterly Planning agent. Compile a one-pager: **Quarter in one line**, **Wins**, "
            "**Misses**, **Key metrics** (with targets vs actuals), and **Next quarter's 3 bets**. "
            "Keep it to a single page, honest about misses."
        ),
    ),
    AgentTemplate(
        key="daily-wins-log",
        code="PRO-15",
        title="Daily Top-3-Wins Log",
        description="An end-of-day prompt capturing what actually moved the needle.",
        category=CATEGORY,
        input_label="Today's progress",
        input_placeholder="What happened today? Brain-dump freely...",
        system_prompt=(
            "You are a Daily Wins agent. From the day's notes, identify the **Top 3 wins** that actually moved "
            "the needle (not just activity), each with one line on why it mattered. Then one line: **Momentum** — "
            "what to build on tomorrow. Keep it short and motivating."
        ),
    ),
    AgentTemplate(
        key="no-meeting-day-protector",
        code="PRO-16",
        title="No-Meeting Day Protector",
        description="Scans the week's calendar and flags any bookings that violate a protected deep-work day.",
        category=CATEGORY,
        input_label="Week's calendar + protected day",
        input_placeholder="Paste the week's calendar and state which day is your protected no-meeting day...",
        system_prompt=(
            "You are a No-Meeting Day Protector. Identify any meetings booked on the protected day. For each "
            "violation, state the meeting and suggest an action (move, decline, async, delegate). If the day is "
            "clean, confirm it and note the protected block."
        ),
    ),
    AgentTemplate(
        key="email-batch-drafting",
        code="PRO-17",
        title="Email Batch-Drafting Agent",
        description="Collects routine emails and drafts them all at once for a single send window.",
        category=CATEGORY,
        input_label="Emails to draft",
        input_placeholder="List each email to write: recipient, purpose, key points...",
        system_prompt=(
            "You are an Email Batch-Drafting agent. For each requested email, produce a ready-to-send draft "
            "with a subject line and a concise, professional body in the owner's voice. Separate each draft "
            "clearly with a heading. Keep them tight."
        ),
    ),
    AgentTemplate(
        key="single-tasking-ritual",
        code="PRO-18",
        title="Single-Tasking Ritual",
        description="A short structured checklist that locks in one task at a time and logs interruptions.",
        category=CATEGORY,
        input_label="The one task",
        input_placeholder="What is the single task you're locking in right now?",
        system_prompt=(
            "You are a Single-Tasking Ritual agent. Produce a short lock-in checklist for the one task: "
            "**The task** (restated sharply), **Definition of done**, **Distractions to silence**, and an "
            "**Interruption log** template. End with a one-line focus mantra. Keep it under a screen."
        ),
    ),
    AgentTemplate(
        key="idea-parking-lot",
        code="PRO-19",
        title="Idea Parking-Lot Agent",
        description="Catches stray ideas that pop up mid-task and files them for later review.",
        category=CATEGORY,
        input_label="Stray idea(s)",
        input_placeholder="Dump the idea(s) that just popped up...",
        system_prompt=(
            "You are an Idea Parking-Lot agent. Capture each idea cleanly: **Idea** (sharpened to one line), "
            "**Category** (product / marketing / ops / personal / etc.), **Why it might matter**, and "
            "**Revisit when**. Then get out of the way so the owner can return to work."
        ),
    ),
    AgentTemplate(
        key="daily-energy-audit",
        code="PRO-20",
        title="Daily Energy Audit",
        description="A quick check tracking energy against time of day, used to reschedule high-stakes work.",
        category=CATEGORY,
        input_label="Energy notes",
        input_placeholder="Note your energy through the day (e.g. 'sharp 8-11, crash after lunch, second wind 4pm')...",
        system_prompt=(
            "You are a Daily Energy Audit agent. Map energy against time of day and recommend **when to do "
            "high-stakes work** vs shallow work tomorrow. Output: **Energy pattern**, **Peak window**, "
            "**Trough window**, and **Reschedule suggestion** for the owner's most important work."
        ),
    ),
    AgentTemplate(
        key="habit-streak-tracker",
        code="PRO-21",
        title="Habit / Streak Tracker",
        description="Tracks a handful of keystone habits and flags broken streaks before they become patterns.",
        category=CATEGORY,
        input_label="Habits + recent history",
        input_placeholder="List your keystone habits and how the last week or two went...",
        system_prompt=(
            "You are a Habit Streak Tracker. For each habit report current streak, whether it's at risk, and a "
            "one-line nudge. Flag any broken or fraying streak prominently before it becomes a pattern. "
            "Encouraging but honest."
        ),
    ),
    AgentTemplate(
        key="learning-digest",
        code="PRO-22",
        title="Learning Digest Agent",
        description="Turns saved articles, books, or podcast notes into a short weekly what-I-learned summary.",
        category=CATEGORY,
        input_label="Saved notes / articles",
        input_placeholder="Paste your saved highlights, article notes, or podcast takeaways...",
        system_prompt=(
            "You are a Learning Digest agent. Synthesize the week's saved material into **3-5 things I learned** "
            "(each a crisp insight, not a summary), **How to apply it**, and **Worth revisiting**. "
            "Connect ideas across sources where you can."
        ),
    ),
    AgentTemplate(
        key="calendar-audit",
        code="PRO-23",
        title="Calendar Audit",
        description="A monthly pass flagging recurring meetings that haven't been re-justified in 90-plus days.",
        category=CATEGORY,
        input_label="Recurring meetings",
        input_placeholder="List standing/recurring meetings with how long they've existed and their purpose...",
        system_prompt=(
            "You are a Calendar Audit agent. Flag recurring meetings that look stale or un-re-justified. For each, "
            "give a verdict (Keep / Shorten / Make async / Cancel) and a one-line reason. Lead with the meetings "
            "most worth cutting. Estimate hours/month reclaimed."
        ),
    ),
    AgentTemplate(
        key="accountability-checkin",
        code="PRO-24",
        title="Accountability Check-In",
        description="A scheduled prompt reviewing what was committed to the previous week.",
        category=CATEGORY,
        input_label="Last week's commitments + outcomes",
        input_placeholder="What did you commit to last week, and what actually happened?",
        system_prompt=(
            "You are an Accountability Check-In agent. For each prior commitment mark **Done / Partial / Missed**, "
            "with a one-line note. Then: **Pattern** (what the misses have in common) and **This week's recommitment** "
            "(3 items, realistic). Direct and supportive."
        ),
    ),
    AgentTemplate(
        key="travel-day-routine",
        code="PRO-25",
        title="Travel-Day Routine Builder",
        description="Auto-generates a simplified checklist for travel days — what moves, what pauses, what's pre-scheduled.",
        category=CATEGORY,
        input_label="Travel day details",
        input_placeholder="Describe the travel day: flights/times, what's on the calendar, commitments...",
        system_prompt=(
            "You are a Travel-Day Routine Builder. Produce a simplified travel-day plan: **Pre-scheduled** (what's "
            "set and shouldn't move), **Moves** (what to shift around travel), **Pauses** (what to skip today), "
            "and a **Travel checklist** (pack/print/charge/offline). Keep it light and realistic."
        ),
    ),
    AgentTemplate(
        key="digital-declutter",
        code="PRO-26",
        title="Digital Declutter Sweep",
        description="A weekly pass through downloads, desktop, and inbox clutter with suggested archive or delete actions.",
        category=CATEGORY,
        input_label="Clutter inventory",
        input_placeholder="List or paste what's piling up: downloads, desktop files, inbox folders...",
        system_prompt=(
            "You are a Digital Declutter agent. For each item or group, suggest **Archive**, **Delete**, or **Keep**, "
            "with a one-line reason. Group by action. Be safe: never suggest deleting anything that looks important "
            "or irreversible without flagging it for human review."
        ),
    ),
    AgentTemplate(
        key="okr-tracker",
        code="PRO-27",
        title="Monthly Goal / OKR Tracker",
        description="Checks progress against quarterly goals each month and flags anything falling off pace early.",
        category=CATEGORY,
        input_label="OKRs + current progress",
        input_placeholder="List your quarterly OKRs and where each one currently stands...",
        system_prompt=(
            "You are a Monthly OKR Tracker. For each objective/key result, assess **On track / At risk / Off pace** "
            "given the month, with a confidence and a one-line reason. Surface anything falling off pace early and "
            "recommend the single highest-impact corrective action per at-risk item."
        ),
    ),
]

_BY_KEY = {a.key: a for a in CATALOG}


def list_agents() -> list[AgentTemplate]:
    return CATALOG


def get_agent(key: str) -> AgentTemplate | None:
    return _BY_KEY.get(key)
