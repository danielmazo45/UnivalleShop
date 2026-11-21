import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CreateOrderUseCase } from './application/use-cases/create-order.use-case';
import { GetOrderUseCase } from './application/use-cases/get-order.use-case';
import { ListOrdersUseCase } from './application/use-cases/list-orders.use-case';
import { ORDER_REPOSITORY_PORT } from './domain/ports/order-repository.port';
import { MongoOrderRepository } from './infrastructure/adapters/mongo-order.repository';
import { OrdersController } from './infrastructure/http/orders.controller';
import { OrderMongo, OrderSchema } from './infrastructure/schemas/order.schema';
@Module({
  imports: [MongooseModule.forFeature([{ name: OrderMongo.name, schema: OrderSchema }])],
  controllers: [OrdersController],
  providers: [CreateOrderUseCase, GetOrderUseCase, ListOrdersUseCase, { provide: ORDER_REPOSITORY_PORT, useClass: MongoOrderRepository }],
})
export class OrdersModule {}
