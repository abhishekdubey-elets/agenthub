from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.agents_catalog import get_agent, list_agents
from app.core.config import settings
from app.db.session import get_db
from app.deps import get_current_user
from app.models import AgentRun, User
from app.schemas import AgentOut, AgentRunOut, AgentRunRequest
from app.services.openai_service import OpenAINotConfigured, run_agent

router = APIRouter(prefix="/api/agents", tags=["agents"])


def _to_out(a) -> AgentOut:
    return AgentOut(
        key=a.key,
        code=a.code,
        title=a.title,
        description=a.description,
        category=a.category,
        input_label=a.input_label,
        input_placeholder=a.input_placeholder,
        sample_inputs=a.sample_inputs,
    )


@router.get("", response_model=list[AgentOut])
def get_agents(current_user: User = Depends(get_current_user)):
    return [_to_out(a) for a in list_agents()]


@router.get("/{key}", response_model=AgentOut)
def get_agent_detail(key: str, current_user: User = Depends(get_current_user)):
    agent = get_agent(key)
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    return _to_out(agent)


@router.post("/{key}/run", response_model=AgentRunOut)
def run(
    key: str,
    payload: AgentRunRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    agent = get_agent(key)
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")

    run_row = AgentRun(
        user_id=current_user.id,
        agent_key=key,
        input_text=payload.input_text,
        model=settings.openai_model,
    )
    try:
        output = run_agent(agent, payload.input_text)
        run_row.output_text = output
        run_row.status = "completed"
    except OpenAINotConfigured as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:  # surface model/runtime errors as a failed run
        run_row.status = "failed"
        run_row.error = str(e)
        db.add(run_row)
        db.commit()
        db.refresh(run_row)
        raise HTTPException(status_code=502, detail=f"Agent run failed: {e}")

    db.add(run_row)
    db.commit()
    db.refresh(run_row)
    return run_row


@router.get("/{key}/runs", response_model=list[AgentRunOut])
def run_history(
    key: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    rows = (
        db.query(AgentRun)
        .filter(AgentRun.user_id == current_user.id, AgentRun.agent_key == key)
        .order_by(AgentRun.created_at.desc())
        .limit(25)
        .all()
    )
    return rows
