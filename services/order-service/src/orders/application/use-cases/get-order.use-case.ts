import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Order } from '../../domain/entities/order.entity';
import { ORDER_REPOSITORY_PORT, OrderRepositoryPort } from '../../domain/ports/order-repository.port';
@Injectable()
export class GetOrderUseCase {
  constructor(@Inject(ORDER_REPOSITORY_PORT) private readonly repository: OrderRepositoryPort) {}
  async execute(id: string): Promise<Order> {
    const order = await this.repository.findById(id);
    if (!order) throw new NotFoundException('Pedido no encontrado');
    return order;
  }
}
