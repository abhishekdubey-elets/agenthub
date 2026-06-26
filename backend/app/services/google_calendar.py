"""Google Calendar integration: OAuth2 flow + fetching today's events.

Gracefully degrades when Google OAuth isn't configured (no client id/secret),
mirroring how billing/openai handle missing config.
"""

from __future__ import annotations

import os
from datetime import datetime, time, timezone

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models import GoogleCredential, User

SCOPES = [
    "https://www.googleapis.com/auth/calendar.readonly",
    "https://www.googleapis.com/auth/gmail.readonly",
    "openid",
    "https://www.googleapis.com/auth/userinfo.email",
]

CALENDAR_SCOPE = "https://www.googleapis.com/auth/calendar.readonly"
GMAIL_SCOPE = "https://www.googleapis.com/auth/gmail.readonly"


def record_has_scope(record, scope: str) -> bool:
    return bool(record and scope in (record.scopes or "").split())

# Local dev runs the OAuth callback over http://localhost. Google special-cases
# localhost, but oauthlib enforces https unless told otherwise. Also relax scope
# ordering since Google may return scopes in a different order than requested.
if settings.google_redirect_uri.startswith("http://"):
    os.environ.setdefault("OAUTHLIB_INSECURE_TRANSPORT", "1")
os.environ.setdefault("OAUTHLIB_RELAX_TOKEN_SCOPE", "1")


class GoogleNotConfigured(RuntimeError):
    pass


def is_configured() -> bool:
    return bool(settings.google_client_id and settings.google_client_secret)


def _client_config() -> dict:
    return {
        "web": {
            "client_id": settings.google_client_id,
            "client_secret": settings.google_client_secret,
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "redirect_uris": [settings.google_redirect_uri],
        }
    }


def _flow() -> Flow:
    if not is_configured():
        raise GoogleNotConfigured(
            "Google OAuth is not configured. Set GOOGLE_CLIENT_ID and "
            "GOOGLE_CLIENT_SECRET in backend/.env."
        )
    return Flow.from_client_config(
        _client_config(),
        scopes=SCOPES,
        redirect_uri=settings.google_redirect_uri,
    )


def build_auth_url(state: str) -> str:
    flow = _flow()
    auth_url, _ = flow.authorization_url(
        access_type="offline",
        include_granted_scopes="true",
        prompt="consent",
        state=state,
    )
    return auth_url


def exchange_code(code: str) -> Credentials:
    flow = _flow()
    flow.fetch_token(code=code)
    return flow.credentials


def _fetch_email(creds: Credentials) -> str | None:
    try:
        service = build("oauth2", "v2", credentials=creds, cache_discovery=False)
        info = service.userinfo().get().execute()
        return info.get("email")
    except Exception:
        return None


def save_credentials(db: Session, user: User, creds: Credentials) -> GoogleCredential:
    record = user.google_credential or GoogleCredential(user_id=user.id)
    record.token = creds.token
    record.refresh_token = creds.refresh_token or record.refresh_token
    record.token_uri = creds.token_uri
    record.scopes = " ".join(creds.scopes or SCOPES)
    record.expiry = creds.expiry
    record.email = _fetch_email(creds) or record.email
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


def _credentials_from_record(record: GoogleCredential) -> Credentials:
    return Credentials(
        token=record.token,
        refresh_token=record.refresh_token,
        token_uri=record.token_uri,
        client_id=settings.google_client_id,
        client_secret=settings.google_client_secret,
        scopes=record.scopes.split() if record.scopes else SCOPES,
    )


def get_credentials(db: Session, user: User) -> Credentials:
    """Return refreshed Google credentials for a user, persisting any new token.

    Shared by both the Calendar and Gmail services.
    """
    record = user.google_credential
    if not record:
        raise GoogleNotConfigured("Google account is not connected for this user.")

    creds = _credentials_from_record(record)
    if creds.expired and creds.refresh_token:
        creds.refresh(Request())
        record.token = creds.token
        record.expiry = creds.expiry
        db.add(record)
        db.commit()
    return creds


def fetch_today_events(db: Session, user: User) -> list[dict]:
    """Return today's events as simplified dicts. Refreshes token if needed."""
    if not user.google_credential:
        raise GoogleNotConfigured("Google Calendar is not connected for this user.")

    creds = get_credentials(db, user)
    service = build("calendar", "v3", credentials=creds, cache_discovery=False)

    now = datetime.now(timezone.utc).astimezone()
    start = datetime.combine(now.date(), time.min).astimezone()
    end = datetime.combine(now.date(), time.max).astimezone()

    result = service.events().list(
        calendarId="primary",
        timeMin=start.isoformat(),
        timeMax=end.isoformat(),
        singleEvents=True,
        orderBy="startTime",
    ).execute()

    events = []
    for ev in result.get("items", []):
        start_info = ev.get("start", {})
        when = start_info.get("dateTime") or start_info.get("date") or ""
        events.append(
            {
                "summary": ev.get("summary", "(no title)"),
                "start": when,
                "location": ev.get("location"),
                "attendees": [a.get("email") for a in ev.get("attendees", [])],
            }
        )
    return events


def events_to_text(events: list[dict]) -> str:
    """Format events into the plain-text block the Morning Briefing agent expects."""
    if not events:
        return "Calendar: No events scheduled today."
    lines = ["Calendar (from Google Calendar):"]
    for ev in events:
        when = ev["start"]
        label = when
        # Pretty-print a dateTime into HH:MM if possible.
        try:
            dt = datetime.fromisoformat(when.replace("Z", "+00:00"))
            # %I is zero-padded 12-hour; strip the leading zero portably (Windows-safe).
            label = dt.strftime("%I:%M %p").lstrip("0") if "T" in when else "All day"
        except (ValueError, AttributeError):
            label = when or "All day"
        loc = f" @ {ev['location']}" if ev.get("location") else ""
        lines.append(f"- {label}: {ev['summary']}{loc}")
    return "\n".join(lines)
