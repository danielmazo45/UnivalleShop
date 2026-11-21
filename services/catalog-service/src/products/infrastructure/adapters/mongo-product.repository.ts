import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from '../../domain/entities/product.entity';
import { ProductRepositoryPort } from '../../domain/ports/product-repository.port';
import { ProductDocument, ProductMongo } from '../schemas/product.schema';

@Injectable()
export class MongoProductRepository implements ProductRepositoryPort {
  constructor(@InjectModel(ProductMongo.name) private readonly productModel: Model<ProductMongo>) {}

  async save(product: Product): Promise<Product> {
    const doc = await this.productModel.create({
      _id: product.id, name: product.name, description: product.description,
      price: product.price, category: product.category, stock: product.stock,
      imageUrl: product.imageUrl,
    });
    return this.toDomain(doc);
  }
  async findById(id: string): Promise<Product | null> {
    const doc = await this.productModel.findById(id).exec();
    return doc ? this.toDomain(doc) : null;
  }
  async findAll(): Promise<Product[]> {
    const docs = await this.productModel.find().exec();
    return docs.map(doc => this.toDomain(doc));
  }
  private toDomain(doc: ProductDocument): Product {
    return new Product(doc._id, doc.name, doc.description, doc.price,
      doc.category, doc.stock, doc.imageUrl, doc.createdAt);
  }
}
