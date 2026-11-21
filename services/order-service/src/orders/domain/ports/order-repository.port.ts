import { Order } from '../entities/order.entity';
export interface OrderRepositoryPort {
  save(order: Order): Promise<Order>;
  findById(id: string): Promise<Order | null>;
  findAll(): Promise<Order[]>;
}
export const ORDER_REPOSITORY_PORT = 'ORDER_REPOSITORY_PORT';
