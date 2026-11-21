import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Order, OrderItem } from '../../domain/entities/order.entity';
import { ORDER_REPOSITORY_PORT, OrderRepositoryPort } from '../../domain/ports/order-repository.port';
@Injectable()
export class CreateOrderUseCase {
  constructor(@Inject(ORDER_REPOSITORY_PORT) private readonly repository: OrderRepositoryPort) {}
  async execute(input: { userId: string; items: OrderItem[] }): Promise<Order> {
    if (!input.items.length) throw new BadRequestException('El pedido requiere al menos un producto');
    const total = Math.round(input.items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0) * 100) / 100;
    return this.repository.save(new Order(randomUUID(), input.userId, input.items, total, 'pending'));
  }
}
