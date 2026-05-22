import type { Offer, User } from '../types';
import { MOCK_CURRENT_USER, MOCK_MY_OFFERS } from '../constants/mockData';
import { simulateDelay } from './api';

export async function getMe(): Promise<User> {
  await simulateDelay(300);
  return MOCK_CURRENT_USER;
}

export async function getMyOffers(): Promise<Offer[]> {
  await simulateDelay(400);
  return MOCK_MY_OFFERS;
}
