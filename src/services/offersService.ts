import { Platform } from 'react-native';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { File, UploadType } from 'expo-file-system';
import type { Offer, PaginatedResponse, Category, VoteType, Pricing } from '../types';
import type { ApiOffer } from '../types/offer';
import { getNearbyOffers, fetchOfferById } from './api';
import { API_BASE_URL } from '../config/api';

// Caps the long edge of a photo before upload — phone photos are commonly
// 4-5MB+ straight out of the camera, and the feed/detail screens never
// display them anywhere near full resolution.
const MAX_UPLOAD_DIMENSION = 1280;
const UPLOAD_JPEG_COMPRESSION = 0.75;


export interface GetOffersParams {
  latitude: number;
  longitude: number;
  category?: Category | 'all';
  page?: number;
  limit?: number;
}

export interface CreateOfferPayload {
  headline: string;
  businessName: string;
  category: Category;
  pricing: Pricing;
  expiresAt?: string;
  imageUri?: string;
  imageWidth?: number;
  imageHeight?: number;
  latitude: number;
  longitude: number;
}

function mapOfferType(offerType: ApiOffer['offerType']): Pricing {
  switch (offerType.type) {
    case 'percentage':
      return { type: 'percentage', percentage: offerType.percentage, label: offerType.label };
    case 'bundle':
      return { type: 'bundle', label: offerType.label };
    case 'price':
      return {
        type: 'price',
        currentPrice: offerType.currentPrice,
        previousPrice: offerType.previousPrice,
        label: offerType.label,
      };
    case 'text':
      return { type: 'text', label: offerType.label };
  }
}

function mapApiOffer(api: ApiOffer): Offer {
  return {
    id: api.id,
    headline: api.headline,
    description: api.description ?? undefined,
    businessName: api.businessName,
    isVerifiedBusiness: api.isVerifiedBusiness,
    category: api.category as Category,
    imageUrl: api.imageUrl ?? null,
    pricing: api.offerType ? mapOfferType(api.offerType) : undefined,
    distanceMeters: api.distanceMeters,
    confirmationsCount: api.confirmationsCount,
    invalidationsCount: api.invalidationsCount,
    commentsCount: api.commentsCount,
    createdAt: api.createdAt,
    expiresAt: api.expiresAt ?? null,
    postedBy: {
      id: String(api.postedBy.id),
      name: api.postedBy.name,
      avatarUrl: null,
      reputationScore: 0,
      badgesCount: 0,
    },
  };
}

export async function getOffers(params: GetOffersParams): Promise<PaginatedResponse<Offer>> {
  const { latitude, longitude, category = 'all', page = 1, limit = 20 } = params;

  const apiOffers = await getNearbyOffers(latitude, longitude);
  const mapped = apiOffers.map(mapApiOffer);

  const filtered =
    category === 'all' ? mapped : mapped.filter((o) => o.category === category);

  return {
    items: filtered.slice(0, limit),
    total: filtered.length,
    page,
    hasMore: false,
  };
}

export async function getOfferById(id: string): Promise<Offer> {
  const apiOffer = await fetchOfferById(id);
  return mapApiOffer(apiOffer);
}

// Downscales to MAX_UPLOAD_DIMENSION on the long edge (skipping resize if
// already smaller) and re-encodes as JPEG, so the file leaving the device
// is a few hundred KB instead of a multi-MB camera original.
async function compressImage(uri: string, width?: number, height?: number): Promise<string> {
  const context = ImageManipulator.manipulate(uri);

  const longEdge = width != null && height != null ? Math.max(width, height) : undefined;
  if (longEdge == null || longEdge > MAX_UPLOAD_DIMENSION) {
    context.resize(
      width != null && height != null && height > width
        ? { height: MAX_UPLOAD_DIMENSION }
        : { width: MAX_UPLOAD_DIMENSION },
    );
  }

  const image = await context.renderAsync();
  const result = await image.saveAsync({
    compress: UPLOAD_JPEG_COMPRESSION,
    format: SaveFormat.JPEG,
  });

  return result.uri;
}

async function uploadImage(uri: string, token: string): Promise<string> {
  // Native: upload the local file directly through expo-file-system's
  // native-backed multipart upload — this sidesteps Expo's JS fetch/
  // FormData runtime entirely, which has proven unreliable across SDK
  // bumps for local file uploads (dropped the old {uri,name,type} RN
  // convention in SDK 57, then mangled a fetch()-derived Blob's bytes).
  if (Platform.OS !== 'web') {
    const result = await new File(uri).upload(`${API_BASE_URL}/uploads`, {
      httpMethod: 'POST',
      uploadType: UploadType.MULTIPART,
      fieldName: 'image',
      mimeType: 'image/jpeg',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (result.status < 200 || result.status >= 300) {
      throw new Error(`Failed to upload image: ${result.status} — ${result.body}`);
    }

    const data: { url: string } = JSON.parse(result.body);
    return data.url;
  }

  // Web: a real browser's fetch/FormData is standards-compliant, so the
  // straightforward Blob-based approach works fine here.
  const blob = await fetch(uri).then((r) => r.blob());

  const formData = new FormData();
  formData.append('image', blob, 'offer.jpg');

  const response = await fetch(`${API_BASE_URL}/uploads`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to upload image: ${response.status} — ${text}`);
  }

  const data: { url: string } = await response.json();
  return data.url;
}

export async function createOffer(payload: CreateOfferPayload, token: string): Promise<Offer> {
  const body: Record<string, unknown> = {
    headline: payload.headline,
    businessName: payload.businessName,
    category: payload.category,
    latitude: payload.latitude,
    longitude: payload.longitude,
  };

  body.offerType = payload.pricing;
  if (payload.expiresAt) body.expiresAt = payload.expiresAt;

  let uploadedImageUrl: string | null = null;
  if (payload.imageUri) {
    const compressedUri = await compressImage(payload.imageUri, payload.imageWidth, payload.imageHeight);
    uploadedImageUrl = await uploadImage(compressedUri, token);
    body.imageUrl = uploadedImageUrl;
  }

  const response = await fetch(`${API_BASE_URL}/offers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to create offer: ${response.status} — ${text}`);
  }

  // Backend returns 201 with empty body — reconstruct a local Offer from the payload
  return {
    id: `local-${Date.now()}`,
    headline: payload.headline,
    businessName: payload.businessName,
    category: payload.category,
    pricing: payload.pricing,
    imageUrl: uploadedImageUrl,
    expiresAt: payload.expiresAt ?? null,
    distanceMeters: 0,
    createdAt: new Date().toISOString(),
    confirmationsCount: 0,
    invalidationsCount: 0,
    commentsCount: 0,
    postedBy: { id: 'me', name: 'Tú', avatarUrl: null, reputationScore: 0, badgesCount: 0 },
  };
}

export async function voteOffer(offerId: string, type: VoteType, token: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/offers/${offerId}/votes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ type }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to vote: ${response.status} — ${text}`);
  }
}
