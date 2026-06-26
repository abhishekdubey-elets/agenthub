"""Gmail integration: fetch recent inbox messages for the Inbox Triage agent.

Rides on the shared Google OAuth credential (see google_calendar.get_credentials).
Requires the gmail.readonly scope on the stored credential.
"""

from __future__ import annotations

import re

from googleapiclient.discovery import build
from sqlalchemy.orm import Session

from app.models import User
from app.services import google_calendar as gcal


def _header(headers: list[dict], name: str) -> str:
    for h in headers:
        if h.get("name", "").lower() == name.lower():
            return h.get("value", "")
    return ""


def _snippet(payload: dict, fallback: str) -> str:
    """Best-effort short plain-text preview of the message body."""
    # Prefer the API-provided snippet (passed as fallback); clean it up.
    text = fallback or ""
    return re.sub(r"\s+", " ", text).strip()[:240]


def fetch_recent_messages(db: Session, user: User, max_results: int = 12) -> list[dict]:
    """Return recent inbox messages as simplified dicts."""
    record = user.google_credential
    if not record:
        raise gcal.GoogleNotConfigured("Gmail is not connected for this user.")
    if not gcal.record_has_scope(record, gcal.GMAIL_SCOPE):
        raise gcal.GoogleNotConfigured(
            "Gmail access not granted. Reconnect your Google account to enable Gmail."
        )

    creds = gcal.get_credentials(db, user)
    service = build("gmail", "v1", credentials=creds, cache_discovery=False)

    listing = service.users().messages().list(
        userId="me",
        labelIds=["INBOX"],
        maxResults=max_results,
        q="newer_than:2d",
    ).execute()

    messages = []
    for ref in listing.get("messages", []):
        msg = service.users().messages().get(
            userId="me",
            id=ref["id"],
            format="metadata",
            metadataHeaders=["From", "Subject", "Date"],
        ).execute()
        headers = msg.get("payload", {}).get("headers", [])
        label_ids = msg.get("labelIds", [])
        messages.append(
            {
                "from": _header(headers, "From"),
                "subject": _header(headers, "Subject") or "(no subject)",
                "date": _header(headers, "Date"),
                "snippet": _snippet(msg.get("payload", {}), msg.get("snippet", "")),
                "unread": "UNREAD" in label_ids,
            }
        )
    return messages


def messages_to_text(messages: list[dict]) -> str:
    """Format messages into the plain-text block the Inbox Triage agent expects."""
    if not messages:
        return "Email: No recent inbox messages."
    lines = ["Email inbox (recent, from Gmail):"]
    for m in messages:
        flag = "🔵 unread" if m["unread"] else "read"
        lines.append(
            f"- From {m['from']} | {flag}\n  Subject: {m['subject']}\n  Preview: {m['snippet']}"
        )
    return "\n".join(lines)
