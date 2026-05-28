import type { Comment } from '../types';
import { MOCK_COMMENTS, MOCK_COMMENTS_POOL } from '../constants/mockData';
import { simulateDelay } from './api';

export async function getComments(offerId: string, count?: number): Promise<Comment[]> {
  await simulateDelay(350);

  if (count != null && count > 0) {
    return Array.from({ length: count }, (_, i) => {
      const base = MOCK_COMMENTS_POOL[i % MOCK_COMMENTS_POOL.length];
      return { ...base, id: `mock-${i}`, offerId };
    });
  }

  return MOCK_COMMENTS[offerId] ?? [];
}

export interface AddCommentPayload {
  offerId: string;
  text: string;
}

export async function addComment(payload: AddCommentPayload): Promise<Comment> {
  await simulateDelay(500);
  const newComment: Comment = {
    id: `c${Date.now()}`,
    offerId: payload.offerId,
    text: payload.text,
    author: { id: 'me', name: 'Tú', avatarUrl: null, reputationScore: 0, badgesCount: 0 },
    createdAt: new Date().toISOString(),
  };
  return newComment;
}
