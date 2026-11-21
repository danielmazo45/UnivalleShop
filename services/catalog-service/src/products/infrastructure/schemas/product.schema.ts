import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ collection: 'products', timestamps: true })
export class ProductMongo {
  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true, min: 0, default: 0 })
  stock: number;

  @Prop() imageUrl?: string;
  createdAt?: Date;
}
export type ProductDocument = HydratedDocument<ProductMongo>;
export const ProductSchema = SchemaFactory.createForClass(ProductMongo);
