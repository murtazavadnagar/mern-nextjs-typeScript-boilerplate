import { Types } from 'mongoose';
import { AuditLogModel, IAuditLog } from '../models/AuditLog';

export class AuditLogRepository {
  async create(data: {
    actorId?: string;
    action: string;
    entity: string;
    entityId: string;
    changes?: Record<string, unknown>;
    ipAddress?: string;
    userAgent?: string;
    requestId?: string;
  }): Promise<IAuditLog> {
    return AuditLogModel.create({
      actorId: data.actorId ? new Types.ObjectId(data.actorId) : null,
      action: data.action,
      entity: data.entity,
      entityId: data.entityId,
      changes: data.changes,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      requestId: data.requestId,
    });
  }
}
