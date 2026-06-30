"""Report actions on an agent run: edit/approve the output, download a PDF, send by email."""

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response
from sqlalchemy.orm import Session

from app.agents_catalog import get_agent
from app.db.session import get_db
from app.deps import get_current_user
from app.models import AgentRun, User
from app.schemas import AgentRunOut, RunUpdate, SendReportRequest
from app.services import mailer
from app.services.pdf import render_report_pdf

router = APIRouter(prefix="/api/runs", tags=["reports"])


def _get_owned_run(run_id: int, db: Session, user: User) -> AgentRun:
    run = db.query(AgentRun).filter(AgentRun.id == run_id).first()
    if not run or run.user_id != user.id:
        raise HTTPException(status_code=404, detail="Run not found")
    return run


def _report_title(run: AgentRun) -> str:
    agent = get_agent(run.agent_key)
    return agent.title if agent else "AgentHub Report"


@router.patch("/{run_id}", response_model=AgentRunOut)
def update_run(
    run_id: int,
    payload: RunUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Save an edited/approved version of the run's output (Human Checkpoint)."""
    run = _get_owned_run(run_id, db, current_user)
    run.output_text = payload.output_text
    db.add(run)
    db.commit()
    db.refresh(run)
    return run


@router.get("/{run_id}/pdf")
def download_pdf(
    run_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    run = _get_owned_run(run_id, db, current_user)
    title = _report_title(run)
    pdf = render_report_pdf(title, run.output_text)
    filename = f"{run.agent_key}-{run.id}.pdf"
    return Response(
        content=pdf,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


@router.post("/{run_id}/send")
def send_report(
    run_id: int,
    payload: SendReportRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    run = _get_owned_run(run_id, db, current_user)
    if not mailer.is_configured():
        raise HTTPException(
            status_code=503,
            detail="Email is not configured. Add SMTP_HOST and SMTP_FROM to backend/.env.",
        )
    title = _report_title(run)
    pdf_bytes = render_report_pdf(title, run.output_text) if payload.as_pdf else None
    try:
        mailer.send_report(
            to=payload.to,
            subject=payload.subject,
            body_markdown=run.output_text,
            pdf_bytes=pdf_bytes,
            pdf_filename=f"{run.agent_key}-{run.id}.pdf",
        )
    except mailer.SMTPNotConfigured as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Failed to send email: {e}")
    return {"sent": True, "to": payload.to}
