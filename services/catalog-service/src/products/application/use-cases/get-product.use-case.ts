import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Product } from '../../domain/entities/product.entity';
import {
  PRODUCT_REPOSITORY_PORT,
  ProductRepositoryPort,
} from '../../domain/ports/product-repository.port';

@Injectable()
export class GetProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY_PORT)
    private readonly productRepository: ProductRepositoryPort,
  ) {}

  async execute(id: string): Promise<Product> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }
    return product;
  }
}
