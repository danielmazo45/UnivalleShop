import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CreateProductUseCase } from './application/use-cases/create-product.use-case';
import { GetProductUseCase } from './application/use-cases/get-product.use-case';
import { ListProductsUseCase } from './application/use-cases/list-products.use-case';
import { PRODUCT_REPOSITORY_PORT } from './domain/ports/product-repository.port';
import { MongoProductRepository } from './infrastructure/adapters/mongo-product.repository';
import { ProductsController } from './infrastructure/http/products.controller';
import { ProductMongo, ProductSchema } from './infrastructure/schemas/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProductMongo.name, schema: ProductSchema },
    ]),
  ],
  controllers: [ProductsController],
  providers: [
    CreateProductUseCase,
    GetProductUseCase,
    ListProductsUseCase,
    { provide: PRODUCT_REPOSITORY_PORT, useClass: MongoProductRepository },
  ],
})
export class ProductsModule {}
