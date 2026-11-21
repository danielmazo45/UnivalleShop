import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from '../../domain/entities/order.entity';
import { OrderRepositoryPort } from '../../domain/ports/order-repository.port';
import { OrderDocument, OrderMongo } from '../schemas/order.schema';
@Injectable()
export class MongoOrderRepository implements OrderRepositoryPort {
  constructor(@InjectModel(OrderMongo.name) private readonly model: Model<OrderMongo>) {}
  async save(order: Order): Promise<Order> {
    const doc = await this.model.create({ _id: order.id, userId: order.userId, items: order.items, total: order.total, status: order.status });
    return this.toDomain(doc);
  }
  async findById(id: string): Promise<Order | null> {
    const doc = await this.model.findById(id).exec();
    return doc ? this.toDomain(doc) : null;
  }
  async findAll(): Promise<Order[]> {
    return (await this.model.find().exec()).map(doc => this.toDomain(doc));
  }
  private toDomain(doc: OrderDocument): Order {
    return new Order(doc._id, doc.userId, doc.items.map(i => ({ productId: i.productId, quantity: i.quantity, unitPrice: i.unitPrice })), doc.total, doc.status, doc.createdAt);
  }
}
