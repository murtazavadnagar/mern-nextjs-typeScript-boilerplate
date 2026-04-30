import { Schema, model, Document, Types } from 'mongoose';

export interface IAuditLog extends Document {
  actorId?: Types.ObjectId;
  action: string;
  entity: string;
  entityId: string;
  changes?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  requestId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const auditLogSchema = new Schema<IAuditLog>(
  {
    actorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    action: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    entity: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    entityId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    changes: {
      type: Schema.Types.Mixed,
      default: null,
    },
    ipAddress: {
      type: String,
      default: null,
    },
    userAgent: {
      type: String,
      default: null,
    },
    requestId: {
      type: String,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

auditLogSchema.index({ entity: 1, entityId: 1, createdAt: -1 });

export const AuditLogModel = model<IAuditLog>('AuditLog', auditLogSchema);
