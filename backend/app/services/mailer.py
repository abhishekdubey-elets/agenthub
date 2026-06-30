"""Email delivery via SMTP. Sends a report as an HTML body, optionally with a
PDF attachment. Degrades gracefully when SMTP isn't configured.
"""

from __future__ import annotations

import smtplib
from email.message import EmailMessage

import markdown as md

from app.core.config import settings


class SMTPNotConfigured(RuntimeError):
    pass


def is_configured() -> bool:
    return bool(settings.smtp_host and settings.smtp_from)


def markdown_to_html(text: str) -> str:
    body = md.markdown(text or "", extensions=["tables", "sane_lists"])
    return (
        '<div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;'
        'max-width:640px;margin:0 auto;color:#1a1a1a;line-height:1.6;">'
        f"{body}"
        '<hr style="border:none;border-top:1px solid #eee;margin:24px 0;">'
        '<p style="color:#888;font-size:12px;">Sent from AgentHub</p>'
        "</div>"
    )


def send_report(
    to: str,
    subject: str,
    body_markdown: str,
    pdf_bytes: bytes | None = None,
    pdf_filename: str = "report.pdf",
) -> None:
    if not is_configured():
        raise SMTPNotConfigured(
            "Email is not configured. Set SMTP_HOST, SMTP_FROM (and credentials) "
            "in backend/.env."
        )

    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = settings.smtp_from
    msg["To"] = to
    msg.set_content(body_markdown or "(empty report)")  # plain-text fallback
    msg.add_alternative(markdown_to_html(body_markdown), subtype="html")

    if pdf_bytes is not None:
        msg.add_attachment(
            pdf_bytes,
            maintype="application",
            subtype="pdf",
            filename=pdf_filename,
        )

    with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=20) as server:
        if settings.smtp_use_tls:
            server.starttls()
        if settings.smtp_user and settings.smtp_password:
            server.login(settings.smtp_user, settings.smtp_password)
        server.send_message(msg)
