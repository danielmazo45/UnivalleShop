import { Inject, Injectable } from '@nestjs/common';
import { Order } from '../../domain/entities/order.entity';
import { ORDER_REPOSITORY_PORT, OrderRepositoryPort } from '../../domain/ports/order-repository.port';
@Injectable()
export class ListOrdersUseCase {
  constructor(@Inject(ORDER_REPOSITORY_PORT) private readonly repository: OrderRepositoryPort) {}
  execute(): Promise<Order[]> { return this.repository.findAll(); }
}
