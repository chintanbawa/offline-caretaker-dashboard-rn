import { insertAuditEntry } from '@/db/repositories/auditRepo';

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

export async function writeAudit(input: {
  eventType: string;
  description: string;
  payload?: Record<string, unknown> | null;
  result: 'success' | 'failure' | 'info';
}) {
  await insertAuditEntry({
    id: createId('audit'),
    eventType: input.eventType,
    description: input.description,
    payloadJson: input.payload ? JSON.stringify(input.payload) : null,
    result: input.result,
    createdAt: new Date().toISOString()
  });
}
