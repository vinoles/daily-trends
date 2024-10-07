import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type FeedLogDocument = HydratedDocument<FeedLog>;

@Schema()
export class FeedLog {
  @Prop({ required: true })
  message: string;

  @Prop({ required: false })
  url: string;

  @Prop({ required: true, type: Object })
  error: object;

  @Prop({ required: true })
  createdAt: string;
}

export const FeedLogSchema = SchemaFactory.createForClass(FeedLog);
