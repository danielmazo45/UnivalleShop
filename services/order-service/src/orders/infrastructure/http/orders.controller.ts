import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { CreateOrderUseCase } from '../../application/use-cases/create-order.use-case';
import { GetOrderUseCase } from '../../application/use-cases/get-order.use-case';
import { ListOrdersUseCase } from '../../application/use-cases/list-orders.use-case';
@Controller('orders')
export class OrdersController {
  constructor(private readonly createOrder: CreateOrderUseCase, private readonly getOrder: GetOrderUseCase, private readonly listOrders: ListOrdersUseCase) {}
  @Post() create(@Body() dto: CreateOrderDto) { return this.createOrder.execute(dto); }
  @Get() findAll() { return this.listOrders.execute(); }
  @Get(':id') findOne(@Param('id') id: string) { return this.getOrder.execute(id); }
}
