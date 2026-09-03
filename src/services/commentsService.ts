import type { Comment, User } from '../types';
import type { ApiComment } from '../types/offer';
import { fetchComments } from './api';
import { API_BASE_URL } from '../config/api';

function mapApiComment(api: ApiComment): Comment {
  return {
    id: api.id,
    offerId: api.offerId,
    text: api.body,
    author: {
      id: String(api.postedBy.id),
      name: api.postedBy.name,
      avatarUrl: null,
      reputationScore: 0,
      badgesCount: 0,
    },
    createdAt: api.createdAt,
  };
}

export async function getComments(offerId: string): Promise<Comment[]> {
  const apiComments = await fetchComments(offerId);
  return apiComments.map(mapApiComment);
}

export interface AddCommentPayload {
  offerId: string;
  text: string;
}

export async function addComment(
  payload: AddCommentPayload,
  token: string,
  author: User
): Promise<Comment> {
  const response = await fetch(`${API_BASE_URL}/offers/${payload.offerId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ body: payload.text }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to add comment: ${response.status} — ${text}`);
  }

  // Backend returns 201 with empty body — reconstruct a local Comment from the payload
  return {
    id: `local-${Date.now()}`,
    offerId: payload.offerId,
    text: payload.text,
    author,
    createdAt: new Date().toISOString(),
  };
}
