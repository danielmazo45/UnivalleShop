import { Product } from '../entities/product.entity';

export interface ProductRepositoryPort {
  save(product: Product): Promise<Product>;
  findById(id: string): Promise<Product | null>;
  findAll(): Promise<Product[]>;
}

export const PRODUCT_REPOSITORY_PORT = 'PRODUCT_REPOSITORY_PORT';
