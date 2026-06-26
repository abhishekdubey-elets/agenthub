from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.db.session import Base, engine
from app.routers import agents, auth, billing, integrations

# Import models so they're registered on Base before create_all.
from app import models  # noqa: F401


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Dev convenience: create tables on startup. For production, use Alembic migrations.
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(title="AgentHub API", version="0.1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(agents.router)
app.include_router(billing.router)
app.include_router(integrations.router)


@app.get("/api/health", tags=["health"])
def health():
    return {"status": "ok", "openai_configured": bool(settings.openai_api_key)}
