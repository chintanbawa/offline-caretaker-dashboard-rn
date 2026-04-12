import { apiGet, apiPost } from './client';
import type {
  CommandRequest,
  CommandResponse,
  DeployPackageRequest,
  DeployPackageResponse,
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

export function sendCommand(baseUrl: string, body: CommandRequest) {
  return apiPost<CommandResponse, CommandRequest>(baseUrl, '/commands', body);
}

export function deployPackage(baseUrl: string, body: DeployPackageRequest) {
  return apiPost<DeployPackageResponse, DeployPackageRequest>(
    baseUrl,
    '/deploy',
    body
  );
}
