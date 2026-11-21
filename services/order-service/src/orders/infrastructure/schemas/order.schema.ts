import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
@Schema({ _id: false })
export class OrderItemMongo {
  @Prop({ required: true }) productId: string;
  @Prop({ required: true, min: 1 }) quantity: number;
  @Prop({ required: true, min: 0 }) unitPrice: number;
}
export const OrderItemSchema = SchemaFactory.createForClass(OrderItemMongo);
@Schema({ collection: 'orders', timestamps: true })
export class OrderMongo {
  @Prop({ type: String, required: true }) _id: string;
  @Prop({ required: true }) userId: string;
  @Prop({ type: [OrderItemSchema], required: true }) items: OrderItemMongo[];
  @Prop({ required: true, min: 0 }) total: number;
  @Prop({ required: true, enum: ['pending'] }) status: 'pending';
  createdAt?: Date;
}
export type OrderDocument = HydratedDocument<OrderMongo>;
export const OrderSchema = SchemaFactory.createForClass(OrderMongo);
