import { apiGet } from './client';
import type {
  DeviceBackupResponse,
  DeviceLogResponse,
  DeviceStatusResponse
} from './types';

export function fetchHealth(baseUrl: string) {
  return apiGet<{ ok: boolean; service: string; timestamp: string }>(
    baseUrl,
    '/health'
  );
}

export function fetchStatus(baseUrl: string) {
  return apiGet<DeviceStatusResponse>(baseUrl, '/status');
}

export function fetchLogs(baseUrl: string) {
  return apiGet<DeviceLogResponse>(baseUrl, '/logs');
}

export function fetchBackups(baseUrl: string) {
  return apiGet<DeviceBackupResponse>(baseUrl, '/backups');
}
