const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const TOKEN_KEY = "agenthub_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export type User = {
  id: number;
  email: string;
  full_name: string | null;
  plan: string;
};

export type Agent = {
  key: string;
  code: string;
  title: string;
  description: string;
  category: string;
  input_label: string;
  input_placeholder: string;
  sample_inputs: string[];
};

export type AgentRun = {
  id: number;
  agent_key: string;
  status: string;
  input_text: string;
  output_text: string;
  model: string | null;
  error: string | null;
  created_at: string;
};

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    let detail = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.detail) detail = typeof body.detail === "string" ? body.detail : JSON.stringify(body.detail);
    } catch {
      /* ignore */
    }
    throw new Error(detail);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  async register(email: string, password: string, fullName?: string) {
    return request<{ access_token: string; user: User }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, full_name: fullName || null }),
    });
  },

  async login(email: string, password: string) {
    // OAuth2 password flow expects form-encoded body with `username`.
    const form = new URLSearchParams();
    form.set("username", email);
    form.set("password", password);
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString(),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body?.detail || "Login failed");
    }
    return res.json() as Promise<{ access_token: string; user: User }>;
  },

  async me() {
    return request<User>("/api/auth/me");
  },

  async listAgents() {
    return request<Agent[]>("/api/agents");
  },

  async getAgent(key: string) {
    return request<Agent>(`/api/agents/${key}`);
  },

  async runAgent(key: string, inputText: string) {
    return request<AgentRun>(`/api/agents/${key}/run`, {
      method: "POST",
      body: JSON.stringify({ input_text: inputText }),
    });
  },

  async runHistory(key: string) {
    return request<AgentRun[]>(`/api/agents/${key}/runs`);
  },

  async createCheckout() {
    return request<{ checkout_url: string }>("/api/billing/checkout", {
      method: "POST",
    });
  },

  // --- Google Calendar integration ---
  async googleStatus() {
    return request<GoogleStatus>("/api/integrations/google/status");
  },

  async googleConnectUrl() {
    return request<{ auth_url: string }>("/api/integrations/google/connect");
  },

  async googleDisconnect() {
    return request<{ disconnected: boolean }>(
      "/api/integrations/google/disconnect",
      { method: "POST" }
    );
  },

  async googleCalendarToday() {
    return request<{ events: CalendarEvent[]; text: string }>(
      "/api/integrations/google/calendar/today"
    );
  },

  async gmailRecent() {
    return request<{ messages: unknown[]; text: string }>(
      "/api/integrations/google/gmail/recent"
    );
  },

  // --- Slack integration ---
  async slackStatus() {
    return request<SlackStatus>("/api/integrations/slack/status");
  },

  async slackConnectUrl() {
    return request<{ auth_url: string }>("/api/integrations/slack/connect");
  },

  async slackDisconnect() {
    return request<{ disconnected: boolean }>(
      "/api/integrations/slack/disconnect",
      { method: "POST" }
    );
  },

  async slackRecent() {
    return request<{ messages: unknown[]; text: string }>(
      "/api/integrations/slack/recent"
    );
  },
};

export type GoogleStatus = {
  configured: boolean;
  connected: boolean;
  email: string | null;
  connected_at: string | null;
  calendar: boolean;
  gmail: boolean;
};

export type SlackStatus = {
  configured: boolean;
  connected: boolean;
  team: string | null;
  connected_at: string | null;
};

export type CalendarEvent = {
  summary: string;
  start: string;
  location: string | null;
  attendees: string[];
};
