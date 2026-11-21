import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Product } from '../../domain/entities/product.entity';
import {
  PRODUCT_REPOSITORY_PORT,
  ProductRepositoryPort,
} from '../../domain/ports/product-repository.port';

interface CreateProductInput {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl?: string;
}

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY_PORT)
    private readonly productRepository: ProductRepositoryPort,
  ) {}

  async execute(input: CreateProductInput): Promise<Product> {
    const product = new Product(
      randomUUID(),
      input.name,
      input.description,
      input.price,
      input.category,
      input.stock,
      input.imageUrl,
    );
    return this.productRepository.save(product);
  }
}
