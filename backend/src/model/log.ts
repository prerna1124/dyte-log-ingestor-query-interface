import mongoose, { Schema, Document } from 'mongoose';

export interface Log extends Document {
  logId: string;
  level: string;
  message: string;
  resourceId: string;
  timestamp: Date;
  traceId: string;
  spanId: string;
  commit: string;
  metadata: Record<string, any>;
}

const LogSchema: Schema = new Schema({
  logId: String,
  level: String,
  message: String,
  resourceId: String,
  timestamp: Date,
  traceId: String,
  spanId: String,
  commit: String,
  metadata: Schema.Types.Mixed,
}, {collection: 'logs'});

LogSchema.index({ level: 1, message: 1, resourceId: 1, timestamp: 1, traceId: 1, spanId: 1, commit: 1, 'metadata.parentResourceId': 1 });

export default mongoose.model<Log>('logs', LogSchema);
