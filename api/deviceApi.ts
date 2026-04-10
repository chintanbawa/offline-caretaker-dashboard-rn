import { apiGet } from './client';
import type { DeviceStatusResponse } from './types';

export function fetchHealth(baseUrl: string) {
  return apiGet<{ ok: boolean; service: string; timestamp: string }>(
    baseUrl,
    '/health'
  );
}

export function fetchStatus(baseUrl: string) {
  return apiGet<DeviceStatusResponse>(baseUrl, '/status');
}
