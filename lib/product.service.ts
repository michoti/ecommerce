import { PrismaClient, Product } from '../app/generated/prisma';

const prisma = new PrismaClient();

export class ProductService {
  async getAllProducts(): Promise<Product[]> {
    try {
      return await prisma.product.findMany({
        include: { category: true },
      });
    } catch (error) {
      throw new Error(`Failed to fetch products: ${error.message}`);
    }
  }

  async getProductById(id: number): Promise<Product | null> {
    try {
      return await prisma.product.findUnique({
        where: { id },
        include: { category: true },
      });
    } catch (error) {
      throw new Error(`Failed to fetch product with id ${id}: ${error.message}`);
    }
  }

  async createProduct(data: {
    name: string;
    description?: string;
    price: number;
    stock: number;
    categoryId: number;
  }): Promise<Product> {
    try {
      return await prisma.product.create({
        data: {
          name: data.name,
          description: data.description,
          price: data.price,
          stock: data.stock,
          categoryId: data.categoryId,
        },
        include: { category: true },
      });
    } catch (error) {
      throw new Error(`Failed to create product: ${error.message}`);
    }
  }

  async updateProduct(id: number, data: {
    name?: string;
    description?: string;
    price?: number;
    stock?: number;
    categoryId?: number;
  }): Promise<Product> {
    try {
      return await prisma.product.update({
        where: { id },
        data: {
          name: data.name,
          description: data.description,
          price: data.price,
          stock: data.stock,
          categoryId: data.categoryId,
        },
        include: { category: true },
      });
    } catch (error) {
      throw new Error(`Failed to update product with id ${id}: ${error.message}`);
    }
  }

  async deleteProduct(id: number): Promise<void> {
    try {
      await prisma.product.delete({
        where: { id },
      });
    } catch (error) {
      throw new Error(`Failed to delete product with id ${id}: ${error.message}`);
    }
  }

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    try {
      return await prisma.product.findMany({
        where: { categoryId },
        include: { category: true },
      });
    } catch (error) {
      throw new Error(`Failed to fetch products for category ${categoryId}: ${error.message}`);
    }
  }
}