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
    const userId = this.auth.currentUser()?.uid;
    if (!userId) return;

    const products = await this.firestore.getCollection<Product>(
      'products',
      where('userId', '==', userId),
      where('isActive', '==', true),
      orderBy('name', 'asc')
    );
    this.products.set(products);
  }

  async getProduct(productId: string): Promise<Product | null> {
    const product = await this.firestore.getDocument<Product>('products', productId);
    const userId = this.auth.currentUser()?.uid;
    
    // Sécurité: vérifier si le produit appartient à l'utilisateur
    if (product && product.userId !== userId) {
      return null;
    }
    return product;
  }

  async createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'userId'>): Promise<string> {
    const userId = this.auth.currentUser()?.uid;
    if (!userId) throw new Error('Utilisateur non authentifié');

    const productData: Omit<Product, 'id'> = {
      ...product,
      userId,
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
    await this.updateStockWithTransaction(productId, -quantity, reason, 'out');
  }

  async increaseStock(productId: string, quantity: number, reason: string): Promise<void> {
    await this.updateStockWithTransaction(productId, quantity, reason, 'in');
  }

  /**
   * Met à jour le stock de manière atomique à l'aide d'une transaction
   */
  private async updateStockWithTransaction(
    productId: string, 
    quantityChange: number, 
    reason: string, 
    type: 'in' | 'out' | 'adjustment'
  ): Promise<void> {
    const userId = this.auth.currentUser()?.uid;
    if (!userId) throw new Error('Utilisateur non authentifié');

    const productRef = this.firestore.getDocRef('products', productId);

    try {
      await this.firestore.runTransaction(async (transaction) => {
        const productDoc = await transaction.get(productRef);
        if (!productDoc.exists()) {
          throw new Error('Produit non trouvé');
        }

        const productData = productDoc.data() as Product;
        
        // Vérification de sécurité pour le débit
        if (quantityChange < 0 && productData.stock + quantityChange < 0) {
          throw new Error('Stock insuffisant');
        }

        const newStock = productData.stock + quantityChange;

        // 1. Mettre à jour le produit
        transaction.update(productRef, {
          stock: newStock,
          updatedAt: new Date()
        });

        // 2. Créer le mouvement de stock
        const movementId = crypto.randomUUID().replace(/-/g, '').substring(0, 20);
        const movementRef = this.firestore.getDocRef('stockMovements', movementId);
        const movementData: any = {
          productId,
          type,
          quantity: Math.abs(quantityChange),
          reason,
          date: new Date(),
          userId,
          createdAt: new Date()
        };
        
        transaction.set(movementRef, movementData);
      });

      await this.loadProducts();
    } catch (error) {
      console.error('Erreur lors de la transaction de stock:', error);
      throw error;
    }
  }

  async getLowStockProducts(): Promise<Product[]> {
    const userId = this.auth.currentUser()?.uid;
    if (!userId) return [];
    
    // On réutilise les produits déjà chargés dans le signal pour éviter une requête
    return this.products().filter(p => {
      const minStock = p.minStock || 0;
      return p.stock <= minStock;
    });
  }

  async getStockMovements(productId?: string): Promise<StockMovement[]> {
    const userId = this.auth.currentUser()?.uid;
    if (!userId) return [];

    const constraints: any[] = [
      where('userId', '==', userId),
      orderBy('date', 'desc')
    ];
    
    if (productId) {
      constraints.push(where('productId', '==', productId));
    }

    return await this.firestore.getCollection<StockMovement>('stockMovements', ...constraints);
  }
}
