import { Injectable, signal, computed } from '@angular/core';
import { FirestoreService } from './firebase/firestore.service';
import { AuthService } from './firebase/auth.service';
import { Expense, ExpenseCategory } from '../models/expense.model';
import { where, orderBy, Timestamp } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {
  private expenses = signal<Expense[]>([]);
  public expenses$ = computed(() => this.expenses());

  constructor(
    private firestore: FirestoreService,
    private auth: AuthService
  ) {}

  async loadExpenses(): Promise<void> {
    const userId = this.auth.currentUser()?.uid;
    if (!userId) return;

    const expenses = await this.firestore.getCollection<Expense>(
      'expenses',
      orderBy('date', 'desc')
    );
    this.expenses.set(expenses);
  }

  async getExpense(expenseId: string): Promise<Expense | null> {
    return await this.firestore.getDocument<Expense>('expenses', expenseId);
  }

  async createExpense(expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt' | 'userId'>): Promise<string> {
    const userId = this.auth.currentUser()?.uid;
    if (!userId) throw new Error('Utilisateur non connecté');

    const expenseData: Omit<Expense, 'id'> = {
      ...expense,
      userId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const expenseId = await this.firestore.createDocument<Expense>('expenses', expenseData);
    await this.loadExpenses();
    return expenseId;
  }

  async updateExpense(expenseId: string, updates: Partial<Expense>): Promise<void> {
    await this.firestore.updateDocument<Expense>('expenses', expenseId, {
      ...updates,
      updatedAt: new Date()
    });
    await this.loadExpenses();
  }

  async deleteExpense(expenseId: string): Promise<void> {
    await this.firestore.deleteDocument('expenses', expenseId);
    await this.loadExpenses();
  }

  async getExpensesByDateRange(startDate: Date, endDate: Date): Promise<Expense[]> {
    const allExpenses = await this.firestore.getCollection<Expense>(
      'expenses',
      orderBy('date', 'desc')
    );

    const startTimestamp = Timestamp.fromDate(startDate);
    const endTimestamp = Timestamp.fromDate(endDate);

    return allExpenses.filter(expense => {
      let expenseTimestamp: Timestamp;
      
      if (expense.date instanceof Date) {
        expenseTimestamp = Timestamp.fromDate(expense.date);
      } else if (expense.date && typeof (expense.date as any).toDate === 'function') {
        expenseTimestamp = expense.date as any as Timestamp;
      } else {
        expenseTimestamp = Timestamp.fromDate(new Date(expense.date));
      }
      
      return expenseTimestamp >= startTimestamp && expenseTimestamp <= endTimestamp;
    });
  }

  async getExpensesByCategory(category: ExpenseCategory): Promise<Expense[]> {
    return await this.firestore.getCollection<Expense>(
      'expenses',
      where('category', '==', category),
      orderBy('date', 'desc')
    );
  }

  async getTodayExpenses(): Promise<Expense[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return await this.getExpensesByDateRange(today, tomorrow);
  }

  async getMonthExpenses(): Promise<Expense[]> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    return await this.getExpensesByDateRange(startOfMonth, endOfMonth);
  }

  async getTotalExpensesByPeriod(startDate: Date, endDate: Date): Promise<number> {
    const expenses = await this.getExpensesByDateRange(startDate, endDate);
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  }

  async getWorkerPayments(workerId: string): Promise<Expense[]> {
    return await this.firestore.getCollection<Expense>(
      'expenses',
      where('workerId', '==', workerId),
      orderBy('date', 'desc')
    );
  }
}
