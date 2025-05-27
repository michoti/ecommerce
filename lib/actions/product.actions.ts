import { Product } from '@/app/generated/prisma';
import db from '../prisma';

export async function getAllProducts(): Promise<Product[]> {
  try {
    return await db.product.findMany({
      include: { category: true },
    });
  } catch (error) {
    throw new Error(`Failed to fetch products: ${error.message}`);
  }
}

export async function getProductById(id: number): Promise<Product | null> {
  try {
    return await db.product.findUnique({
      where: { id },
      include: { category: true },
    });
  } catch (error) {
    throw new Error(`Failed to fetch product with id ${id}: ${error.message}`);
  }
}

export async function createProduct(data: {
  name: string;
  description?: string;
  price: number;
  stock: number;
  categoryId: number;
}): Promise<Product> {
  try {
    return await db.product.create({
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

export async function updateProduct(id: number, data: {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  categoryId?: number;
}): Promise<Product> {
  try {
    return await db.product.update({
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

export async function deleteProduct(id: number): Promise<void> {
  try {
    await db.product.delete({
      where: { id },
    });
  } catch (error) {
    throw new Error(`Failed to delete product with id ${id}: ${error.message}`);
  }
}

export async function getProductsByCategory(categoryId: number): Promise<Product[]> {
  try {
    return await db.product.findMany({
      where: { categoryId },
      include: { category: true },
    });
  } catch (error) {
    throw new Error(`Failed to fetch products for category ${categoryId}: ${error.message}`);
  }
}

export async function searchProductsByName(searchTerm: string): Promise<Product[]> {
  try {
    return await db.product.findMany({
      where: {
        name: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      },
      include: { category: true },
    });
  } catch (error) {
    throw new Error(`Failed to search products with term ${searchTerm}: ${error.message}`);
  }
}

export async function getLowStockProducts(threshold: number = 10): Promise<Product[]> {
  try {
    return await db.product.findMany({
      where: {
        stock: {
          lte: threshold,
        },
      },
      include: { category: true },
    });
  } catch (error) {
    throw new Error(`Failed to fetch low stock products: ${error.message}`);
  }
}

export async function getProductCountByCategory(): Promise<{ categoryId: number; count: number }[]> {
  try {
    const result = await db.product.groupBy({
      by: ['categoryId'],
      _count: {
        id: true,
      },
    });
    return result.map(item => ({
      categoryId: item.categoryId,
      count: item._count.id,
    }));
  } catch (error) {
    throw new Error(`Failed to fetch product count by category: ${error.message}`);
  }
}