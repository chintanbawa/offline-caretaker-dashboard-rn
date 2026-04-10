import type { AuditEntry } from '@/types/domain';
import { getDb } from '../index';

type AuditRow = {
  id: string;
  event_type: string;
  description: string;
  payload_json: string | null;
  result: 'success' | 'failure' | 'info';
  created_at: string;
};

function mapAudit(row: AuditRow): AuditEntry {
  return {
    id: row.id,
    eventType: row.event_type,
    description: row.description,
    payloadJson: row.payload_json,
    result: row.result,
    createdAt: row.created_at
  };
}

export async function listAuditTrail(limit = 100): Promise<AuditEntry[]> {
  const db = getDb();
  const rows = await db.getAllAsync<AuditRow>(
    `
    SELECT *
    FROM audit_trail
    ORDER BY created_at DESC
    LIMIT ?
    `,
    [limit]
  );

  return rows.map(mapAudit);
}

export async function insertAuditEntry(input: {
  id: string;
  eventType: string;
  description: string;
  payloadJson?: string | null;
  result: 'success' | 'failure' | 'info';
  createdAt: string;
}) {
  const db = getDb();

  await db.runAsync(
    `
    INSERT INTO audit_trail (
      id, event_type, description, payload_json, result, created_at
    )
    VALUES (?, ?, ?, ?, ?, ?)
    `,
    [
      input.id,
      input.eventType,
      input.description,
      input.payloadJson ?? null,
      input.result,
      input.createdAt
    ]
  );
}
