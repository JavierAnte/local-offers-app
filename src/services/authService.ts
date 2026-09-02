import type { User } from '../types';
import { API_BASE_URL } from '../config/api';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResult {
  token: string;
  user: User;
}

interface ApiAuthResponse {
  token: string;
  user: { id: string; name: string; email: string };
}

function mapAuthResponse(res: ApiAuthResponse): AuthResult {
  return {
    token: res.token,
    user: {
      id: res.user.id,
      name: res.user.name,
      email: res.user.email,
      avatarUrl: null,
      reputationScore: 0,
      badgesCount: 0,
    },
  };
}

async function postAuth(path: string, body: unknown): Promise<AuthResult> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  return mapAuthResponse(await response.json());
}

export async function register(payload: RegisterPayload): Promise<AuthResult> {
  return postAuth('/auth/register', payload);
}

export async function login(payload: LoginPayload): Promise<AuthResult> {
  return postAuth('/auth/login', payload);
}
