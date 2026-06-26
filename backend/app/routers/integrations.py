"""Integrations API — Google Calendar OAuth connect/disconnect + event fetch."""

from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import create_access_token, decode_access_token
from app.db.session import get_db
from app.deps import get_current_user
from app.models import User
from app.services import gmail as gmail_svc
from app.services import google_calendar as gcal
from app.services import slack as slack_svc

router = APIRouter(prefix="/api/integrations", tags=["integrations"])


@router.get("/google/status")
def google_status(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    cred = current_user.google_credential
    return {
        "configured": gcal.is_configured(),
        "connected": cred is not None,
        "email": cred.email if cred else None,
        "connected_at": cred.connected_at.isoformat() if cred else None,
        # Per-capability scope flags so the Calendar and Gmail cards can render
        # independently off the one shared Google connection.
        "calendar": gcal.record_has_scope(cred, gcal.CALENDAR_SCOPE),
        "gmail": gcal.record_has_scope(cred, gcal.GMAIL_SCOPE),
    }


@router.get("/google/connect")
def google_connect(current_user: User = Depends(get_current_user)):
    """Return the Google consent URL. The frontend redirects the browser to it."""
    if not gcal.is_configured():
        raise HTTPException(
            status_code=503,
            detail="Google Calendar is not configured. Add GOOGLE_CLIENT_ID and "
            "GOOGLE_CLIENT_SECRET to backend/.env.",
        )
    # `state` carries a signed token identifying the user across the OAuth round-trip.
    state = create_access_token(subject=str(current_user.id))
    return {"auth_url": gcal.build_auth_url(state)}


@router.get("/google/callback")
def google_callback(
    state: str = Query(...),
    code: str | None = Query(default=None),
    error: str | None = Query(default=None),
    db: Session = Depends(get_db),
):
    """Google redirects here. Verify state, exchange code, store tokens, bounce back."""
    redirect_base = f"{settings.frontend_origin}/dashboard/integrations"

    if error:
        return RedirectResponse(f"{redirect_base}?google=error")

    user_id = decode_access_token(state)
    if not user_id:
        return RedirectResponse(f"{redirect_base}?google=invalid_state")

    user = db.query(User).filter(User.id == int(user_id)).first()
    if not user:
        return RedirectResponse(f"{redirect_base}?google=invalid_state")

    try:
        creds = gcal.exchange_code(code or "")
        gcal.save_credentials(db, user, creds)
    except Exception:
        return RedirectResponse(f"{redirect_base}?google=error")

    return RedirectResponse(f"{redirect_base}?google=connected")


@router.post("/google/disconnect")
def google_disconnect(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    cred = current_user.google_credential
    if cred:
        db.delete(cred)
        db.commit()
    return {"disconnected": True}


@router.get("/google/calendar/today")
def google_calendar_today(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not current_user.google_credential:
        raise HTTPException(status_code=400, detail="Google Calendar not connected.")
    try:
        events = gcal.fetch_today_events(db, current_user)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Failed to fetch calendar: {e}")
    return {"events": events, "text": gcal.events_to_text(events)}


@router.get("/google/gmail/recent")
def gmail_recent(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    cred = current_user.google_credential
    if not cred:
        raise HTTPException(status_code=400, detail="Gmail not connected.")
    if not gcal.record_has_scope(cred, gcal.GMAIL_SCOPE):
        raise HTTPException(
            status_code=400,
            detail="Gmail access not granted. Reconnect Google to enable Gmail.",
        )
    try:
        messages = gmail_svc.fetch_recent_messages(db, current_user)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Failed to fetch email: {e}")
    return {"messages": messages, "text": gmail_svc.messages_to_text(messages)}


# --- Slack ---


@router.get("/slack/status")
def slack_status(current_user: User = Depends(get_current_user)):
    cred = current_user.slack_credential
    return {
        "configured": slack_svc.is_configured(),
        "connected": cred is not None,
        "team": cred.team_name if cred else None,
        "connected_at": cred.connected_at.isoformat() if cred else None,
    }


@router.get("/slack/connect")
def slack_connect(current_user: User = Depends(get_current_user)):
    if not slack_svc.is_configured():
        raise HTTPException(
            status_code=503,
            detail="Slack is not configured. Add SLACK_CLIENT_ID and "
            "SLACK_CLIENT_SECRET to backend/.env.",
        )
    state = create_access_token(subject=str(current_user.id))
    return {"auth_url": slack_svc.build_auth_url(state)}


@router.get("/slack/callback")
def slack_callback(
    state: str = Query(...),
    code: str | None = Query(default=None),
    error: str | None = Query(default=None),
    db: Session = Depends(get_db),
):
    redirect_base = f"{settings.frontend_origin}/dashboard/integrations"
    if error:
        return RedirectResponse(f"{redirect_base}?slack=error")

    user_id = decode_access_token(state)
    if not user_id:
        return RedirectResponse(f"{redirect_base}?slack=invalid_state")
    user = db.query(User).filter(User.id == int(user_id)).first()
    if not user:
        return RedirectResponse(f"{redirect_base}?slack=invalid_state")

    try:
        data = slack_svc.exchange_code(code or "")
        slack_svc.save_credentials(db, user, data)
    except Exception:
        return RedirectResponse(f"{redirect_base}?slack=error")

    return RedirectResponse(f"{redirect_base}?slack=connected")


@router.post("/slack/disconnect")
def slack_disconnect(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    cred = current_user.slack_credential
    if cred:
        db.delete(cred)
        db.commit()
    return {"disconnected": True}


@router.get("/slack/recent")
def slack_recent(current_user: User = Depends(get_current_user)):
    if not current_user.slack_credential:
        raise HTTPException(status_code=400, detail="Slack not connected.")
    try:
        messages = slack_svc.fetch_recent_messages(current_user)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Failed to fetch Slack: {e}")
    return {"messages": messages, "text": slack_svc.messages_to_text(messages)}
