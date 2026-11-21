import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersModule } from './orders/orders.module';
import { HealthController } from './health.controller';
@Module({
  imports: [MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/univalleshop_orders'), OrdersModule],
  controllers: [HealthController],
})
export class AppModule {}
