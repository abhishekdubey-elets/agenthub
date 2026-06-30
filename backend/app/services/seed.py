"""Seed a demo user on startup so the app is usable out of the box.

Idempotent: does nothing if the demo account already exists.
Demo login → email: demo@agenthub.com  password: demo12345
"""

from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.models import User

DEMO_EMAIL = "demo@agenthub.com"
DEMO_PASSWORD = "demo12345"


def seed_demo_user(db: Session) -> None:
    existing = db.query(User).filter(User.email == DEMO_EMAIL).first()
    if existing:
        return
    user = User(
        email=DEMO_EMAIL,
        hashed_password=hash_password(DEMO_PASSWORD),
        full_name="Demo User",
        plan="free",
    )
    db.add(user)
