from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.db.session import Base, SessionLocal, engine
from app.routers import agents, auth, billing, integrations, reports
from app.services.seed import seed_demo_user

# Import models so they're registered on Base before create_all.
from app import models  # noqa: F401


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Dev convenience: create tables on startup. For production, use Alembic migrations.
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_demo_user(db)
        db.commit()
    finally:
        db.close()
    yield


app = FastAPI(title="AgentHub API", version="0.1.0", lifespan=lifespan)

allow_origins = [o.strip() for o in settings.frontend_origins.split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(agents.router)
app.include_router(billing.router)
app.include_router(integrations.router)
app.include_router(reports.router)


@app.get("/api/health", tags=["health"])
def health():
    return {"status": "ok", "openai_configured": bool(settings.openai_api_key)}
