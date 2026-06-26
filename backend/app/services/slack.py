"""Slack integration: OAuth2 (v2) connect + fetch recent messages for triage."""

from __future__ import annotations

from urllib.parse import urlencode

import requests
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models import SlackCredential, User

# User-token scopes: read recent messages across the user's channels & DMs.
USER_SCOPES = [
    "channels:history",
    "channels:read",
    "groups:history",
    "groups:read",
    "im:history",
    "im:read",
    "mpim:history",
    "users:read",
]

AUTHORIZE_URL = "https://slack.com/oauth/v2/authorize"
ACCESS_URL = "https://slack.com/api/oauth.v2.access"
API_BASE = "https://slack.com/api"


class SlackNotConfigured(RuntimeError):
    pass


def is_configured() -> bool:
    return bool(settings.slack_client_id and settings.slack_client_secret)


def build_auth_url(state: str) -> str:
    if not is_configured():
        raise SlackNotConfigured(
            "Slack OAuth is not configured. Set SLACK_CLIENT_ID and "
            "SLACK_CLIENT_SECRET in backend/.env."
        )
    params = {
        "client_id": settings.slack_client_id,
        "user_scope": ",".join(USER_SCOPES),
        "redirect_uri": settings.slack_redirect_uri,
        "state": state,
    }
    return f"{AUTHORIZE_URL}?{urlencode(params)}"


def exchange_code(code: str) -> dict:
    resp = requests.post(
        ACCESS_URL,
        data={
            "client_id": settings.slack_client_id,
            "client_secret": settings.slack_client_secret,
            "code": code,
            "redirect_uri": settings.slack_redirect_uri,
        },
        timeout=15,
    )
    data = resp.json()
    if not data.get("ok"):
        raise SlackNotConfigured(f"Slack token exchange failed: {data.get('error')}")
    return data


def save_credentials(db: Session, user: User, data: dict) -> SlackCredential:
    authed = data.get("authed_user", {})
    record = user.slack_credential or SlackCredential(user_id=user.id)
    record.access_token = authed.get("access_token") or data.get("access_token", "")
    record.token_type = "user"
    record.scope = authed.get("scope", "")
    record.team_name = (data.get("team") or {}).get("name")
    record.authed_user = authed.get("id")
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


def _api_get(token: str, method: str, params: dict) -> dict:
    resp = requests.get(
        f"{API_BASE}/{method}",
        headers={"Authorization": f"Bearer {token}"},
        params=params,
        timeout=15,
    )
    return resp.json()


def fetch_recent_messages(user: User, max_messages: int = 15) -> list[dict]:
    """Pull recent messages across the user's most active conversations."""
    record = user.slack_credential
    if not record:
        raise SlackNotConfigured("Slack is not connected for this user.")
    token = record.access_token

    convos = _api_get(
        token,
        "conversations.list",
        {
            "types": "public_channel,private_channel,im,mpim",
            "exclude_archived": "true",
            "limit": 100,
        },
    )
    channels = convos.get("channels", []) if convos.get("ok") else []
    # Prefer channels the user is a member of; cap how many we read.
    channels = [c for c in channels if c.get("is_member", True)][:6]

    user_cache: dict[str, str] = {}

    def name_for(uid: str) -> str:
        if not uid:
            return "unknown"
        if uid not in user_cache:
            info = _api_get(token, "users.info", {"user": uid})
            user_cache[uid] = (
                info.get("user", {}).get("real_name")
                or info.get("user", {}).get("name")
                or uid
            ) if info.get("ok") else uid
        return user_cache[uid]

    out: list[dict] = []
    for ch in channels:
        if len(out) >= max_messages:
            break
        label = ch.get("name") or ("DM" if ch.get("is_im") else ch.get("id"))
        history = _api_get(
            token,
            "conversations.history",
            {"channel": ch["id"], "limit": 4},
        )
        if not history.get("ok"):
            continue
        for msg in history.get("messages", []):
            text = (msg.get("text") or "").strip()
            if not text or msg.get("subtype"):
                continue
            out.append(
                {
                    "channel": label,
                    "is_dm": bool(ch.get("is_im")),
                    "author": name_for(msg.get("user", "")),
                    "text": text[:240],
                }
            )
            if len(out) >= max_messages:
                break
    return out


def messages_to_text(messages: list[dict]) -> str:
    """Format Slack messages into the plain-text block the Triage agent expects."""
    if not messages:
        return "Slack: No recent messages."
    lines = ["Slack messages (recent):"]
    for m in messages:
        where = "DM" if m["is_dm"] else f"#{m['channel']}"
        lines.append(f"- [{where}] {m['author']}: {m['text']}")
    return "\n".join(lines)
