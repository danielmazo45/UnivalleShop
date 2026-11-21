import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from './products/products.module';
import { HealthController } from './health.controller';
@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/univalleshop_catalog'),
    ProductsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
