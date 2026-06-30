from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


# --- Auth ---
class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    full_name: str | None = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    email: EmailStr
    full_name: str | None
    plan: str

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


# --- Agents ---
class AgentOut(BaseModel):
    key: str
    code: str
    title: str
    description: str
    category: str
    input_label: str
    input_placeholder: str
    sample_inputs: list[str]


class AgentRunRequest(BaseModel):
    input_text: str = ""


class AgentRunOut(BaseModel):
    id: int
    agent_key: str
    status: str
    input_text: str
    output_text: str
    model: str | None
    error: str | None
    created_at: datetime

    class Config:
        from_attributes = True


# --- Reports (edit / approve / send) ---
class RunUpdate(BaseModel):
    output_text: str


class SendReportRequest(BaseModel):
    to: EmailStr
    subject: str = Field(min_length=1, max_length=255)
    as_pdf: bool = False


# --- Billing ---
class CheckoutSessionOut(BaseModel):
    checkout_url: str
