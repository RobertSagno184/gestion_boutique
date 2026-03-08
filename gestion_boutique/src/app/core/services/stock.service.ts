import { Injectable, signal, computed } from '@angular/core';
import { FirestoreService } from './firebase/firestore.service';
import { Product, StockMovement } from '../models/product.model';
import { where, orderBy, query as firestoreQuery } from 'firebase/firestore';
import { AuthService } from './firebase/auth.service';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private products = signal<Product[]>([]);
  public products$ = computed(() => this.products());

  constructor(
    private firestore: FirestoreService,
    private auth: AuthService
  ) {}

  async loadProducts(): Promise<void> {
    const products = await this.firestore.getCollection<Product>(
      'products',
      where('isActive', '==', true),
      orderBy('name', 'asc')
    );
    this.products.set(products);
  }

  async getProduct(productId: string): Promise<Product | null> {
    return await this.firestore.getDocument<Product>('products', productId);
  }

  async createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const productData: Omit<Product, 'id'> = {
      ...product,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const productId = await this.firestore.createDocument<Product>('products', productData);
    await this.loadProducts();
    return productId;
  }

  async updateProduct(productId: string, updates: Partial<Product>): Promise<void> {
    await this.firestore.updateDocument<Product>('products', productId, {
      ...updates,
      updatedAt: new Date()
    });
    await this.loadProducts();
  }

  async decreaseStock(productId: string, quantity: number, reason: string): Promise<void> {
    const product = await this.getProduct(productId);
    if (!product) throw new Error('Product not found');

    const newStock = product.stock - quantity;
    if (newStock < 0) {
      throw new Error('Stock insuffisant');
    }

    await this.updateProduct(productId, { stock: newStock });

    // Enregistrer le mouvement de stock
    const userId = this.auth.currentUser()?.uid || 'anonymous';
    await this.firestore.createDocument<StockMovement>('stockMovements', {
      productId,
      type: 'out',
      quantity,
      reason,
      date: new Date(),
      userId,
      createdAt: new Date()
    });
  }

  async increaseStock(productId: string, quantity: number, reason: string): Promise<void> {
    const product = await this.getProduct(productId);
    if (!product) throw new Error('Product not found');

    const newStock = product.stock + quantity;
    await this.updateProduct(productId, { stock: newStock });

    // Enregistrer le mouvement de stock
    const userId = this.auth.currentUser()?.uid || 'anonymous';
    await this.firestore.createDocument<StockMovement>('stockMovements', {
      productId,
      type: 'in',
      quantity,
      reason,
      date: new Date(),
      userId,
      createdAt: new Date()
    });
  }

  async getLowStockProducts(): Promise<Product[]> {
    const products = await this.loadProducts();
    return this.products().filter(p => {
      const minStock = p.minStock || 0;
      return p.stock <= minStock;
    });
  }

  async getStockMovements(productId?: string): Promise<StockMovement[]> {
    const constraints: any[] = [orderBy('date', 'desc')];
    
    if (productId) {
      constraints.push(where('productId', '==', productId));
    }

    return await this.firestore.getCollection<StockMovement>('stockMovements', ...constraints);
  }
}
