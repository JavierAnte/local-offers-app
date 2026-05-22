import type { User, Offer, Comment, Notification, Category } from '../types';

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'Ana García',
    avatarUrl: 'https://i.pravatar.cc/150?img=1',
    reputationScore: 320,
    badgesCount: 4,
  },
  {
    id: 'u2',
    name: 'Carlos Romero',
    avatarUrl: 'https://i.pravatar.cc/150?img=12',
    reputationScore: 180,
    badgesCount: 2,
  },
  {
    id: 'u3',
    name: 'Laura Soto',
    avatarUrl: 'https://i.pravatar.cc/150?img=5',
    reputationScore: 95,
    badgesCount: 1,
  },
];

export const MOCK_CURRENT_USER: User = {
  id: 'me',
  name: 'Javier López',
  avatarUrl: 'https://i.pravatar.cc/150?img=8',
  reputationScore: 210,
  badgesCount: 3,
};

export const MOCK_OFFERS: Offer[] = [
  {
    id: 'o1',
    title: 'Pollo entero en oferta',
    businessName: 'Supermercado El Barrio',
    currentPrice: 3.99,
    previousPrice: 6.50,
    imageUrl: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400',
    category: 'grocery',
    distance: 320,
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    validations: 14,
    invalidations: 1,
    commentsCount: 3,
    postedBy: MOCK_USERS[0],
  },
  {
    id: 'o2',
    title: 'Auriculares Bluetooth 50% dto',
    businessName: 'TecnoPlus',
    currentPrice: 24.99,
    previousPrice: 49.99,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    category: 'electronics',
    distance: 780,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(),
    validations: 8,
    invalidations: 0,
    commentsCount: 1,
    postedBy: MOCK_USERS[1],
  },
  {
    id: 'o3',
    title: 'Menú del día con bebida incluida',
    businessName: 'Bar La Esquina',
    currentPrice: 9.50,
    previousPrice: 12.00,
    imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400',
    category: 'food',
    distance: 150,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 7).toISOString(),
    validations: 22,
    invalidations: 2,
    commentsCount: 5,
    postedBy: MOCK_USERS[2],
  },
  {
    id: 'o4',
    title: 'Zapatillas running — liquidación',
    businessName: 'SportCity',
    currentPrice: 39.00,
    previousPrice: 89.00,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    category: 'sports',
    distance: 1200,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    expiresAt: null,
    validations: 5,
    invalidations: 0,
    commentsCount: 0,
    postedBy: MOCK_USERS[0],
  },
  {
    id: 'o5',
    title: 'Leche entera pack 6 uds',
    businessName: 'Mercadona',
    currentPrice: 4.20,
    previousPrice: 5.40,
    imageUrl: null,
    category: 'grocery',
    distance: 450,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(),
    validations: 3,
    invalidations: 0,
    commentsCount: 0,
    postedBy: MOCK_USERS[1],
  },
];

export const MOCK_COMMENTS: Record<string, Comment[]> = {
  o1: [
    {
      id: 'c1',
      offerId: 'o1',
      text: 'Lo compré esta mañana, confirmo que sigue en oferta.',
      author: MOCK_USERS[1],
      createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    },
    {
      id: 'c2',
      offerId: 'o1',
      text: '¡Gracias por avisar! Muy buena oferta.',
      author: MOCK_USERS[2],
      createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    },
  ],
  o3: [
    {
      id: 'c3',
      offerId: 'o3',
      text: 'El menú también incluye postre hoy.',
      author: MOCK_USERS[0],
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
  ],
};

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    type: 'offer_validated',
    message: 'Tu oferta "Pollo entero" recibió 5 validaciones.',
    offerId: 'o1',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: 'n2',
    type: 'comment_received',
    message: 'Carlos comentó en tu oferta "Pollo entero".',
    offerId: 'o1',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 'n3',
    type: 'offer_expiring',
    message: 'Tu oferta "Menú del día" expira en 7 horas.',
    offerId: 'o3',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
];

export const MOCK_CATEGORIES: Array<{ id: Category | 'all'; label: string }> = [
  { id: 'all', label: 'Todo' },
  { id: 'food', label: 'Comida' },
  { id: 'grocery', label: 'Supermercado' },
  { id: 'electronics', label: 'Electrónica' },
  { id: 'fashion', label: 'Moda' },
  { id: 'sports', label: 'Deportes' },
  { id: 'home', label: 'Hogar' },
  { id: 'beauty', label: 'Belleza' },
  { id: 'other', label: 'Otros' },
];

export const MOCK_MY_OFFERS: Offer[] = [MOCK_OFFERS[0], MOCK_OFFERS[2]];
