import { Injectable, signal, computed } from '@angular/core';
import { FirestoreService } from './firebase/firestore.service';
import { AuthService } from './firebase/auth.service';
import { Transaction, Sale, SaleItem } from '../models/transaction.model';
import { StockService } from './stock.service';
import { where, orderBy, limit, query as firestoreQuery, Timestamp } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
  private transactions = signal<Transaction[]>([]);
  public transactions$ = computed(() => this.transactions());

  constructor(
    private firestore: FirestoreService,
    private auth: AuthService,
    private stockService: StockService
  ) {}

  async createSale(sale: Omit<Sale, 'id' | 'createdAt' | 'updatedAt' | 'userId'>): Promise<string> {
    const userId = this.auth.currentUser()?.uid;
    if (!userId) throw new Error('Utilisateur non authentifié');

    console.log('Début de la création de la vente...', sale);

    try {
      const saleData: any = {
        ...sale,
        userId,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Supprimer les champs undefined ou vides pour éviter l'erreur Firebase
      if (!saleData.customerName) delete saleData.customerName;
      if (!saleData.customerPhone) delete saleData.customerPhone;

      // 1. Enregistrer le détail de la vente
      const saleId = await this.firestore.createDocument<Sale>('sales', saleData);
      console.log('Vente enregistrée avec ID:', saleId);

      // 2. Enregistrer la transaction financière pour le Dashboard
      const transactionData: Omit<Transaction, 'id'> = {
        type: 'sale',
        amount: sale.totalAmount,
        currency: sale.currency || 'GNF',
        description: `Vente #${saleId.substring(0, 5)} - ${sale.items.length} article(s)`,
        date: sale.date || new Date(),
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        reference: saleId
      };
      await this.firestore.createDocument<Transaction>('transactions', transactionData);
      console.log('Transaction financière créée');

      // 3. Mettre à jour automatiquement le stock
      for (const item of sale.items) {
        await this.stockService.decreaseStock(item.productId, item.quantity, `Vente #${saleId}`);
      }
      console.log('Stocks mis à jour');

      // 4. Recharger les transactions (en arrière-plan, ne doit pas bloquer le succès)
      this.loadTransactions().catch(err => console.warn('Erreur rafraîchissement (index probablement manquant):', err));

      return saleId;
    } catch (error) {
      console.error('Erreur lors de la validation de la vente:', error);
      throw error;
    }
  }

  async getSale(saleId: string): Promise<Sale | null> {
    const sale = await this.firestore.getDocument<Sale>('sales', saleId);
    const userId = this.auth.currentUser()?.uid;
    if (sale && sale.userId !== userId) {
      return null;
    }
    return sale;
  }

  async getSales(startDate?: Date, endDate?: Date): Promise<Sale[]> {
    const userId = this.auth.currentUser()?.uid;
    if (!userId) return [];

    const constraints: any[] = [
      where('userId', '==', userId),
      orderBy('date', 'desc')
    ];
    
    if (startDate) {
      constraints.push(where('date', '>=', Timestamp.fromDate(startDate)));
    }
    if (endDate) {
      constraints.push(where('date', '<=', Timestamp.fromDate(endDate)));
    }

    return await this.firestore.getCollection<Sale>('sales', ...constraints);
  }

  async loadTransactions(): Promise<void> {
    const userId = this.auth.currentUser()?.uid;
    if (!userId) return;

    const transactions = await this.firestore.getCollection<Transaction>(
      'transactions',
      where('userId', '==', userId),
      orderBy('date', 'desc'),
      limit(100)
    );

    this.transactions.set(transactions);
  }

  async getTodayTransactions(): Promise<Transaction[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Utiliser getTransactionsByDateRange qui gère déjà le filtrage
    return await this.getTransactionsByDateRange(today, tomorrow);
  }

  async getTransactionsByDateRange(startDate: Date, endDate: Date): Promise<Transaction[]> {
    const userId = this.auth.currentUser()?.uid;
    if (!userId) return [];

    return await this.firestore.getCollection<Transaction>(
      'transactions',
      where('userId', '==', userId),
      where('date', '>=', Timestamp.fromDate(startDate)),
      where('date', '<=', Timestamp.fromDate(endDate)),
      orderBy('date', 'desc')
    );
  }
}
