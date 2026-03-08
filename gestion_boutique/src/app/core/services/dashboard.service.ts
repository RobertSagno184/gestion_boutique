import { Injectable, signal, computed } from '@angular/core';
import { TransactionsService } from './transactions.service';
import { ExpensesService } from './expenses.service';
import { StockService } from './stock.service';
import { DashboardStats, FinancialSummary } from '../models/dashboard.model';
import { Sale } from '../models/transaction.model';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private stats = signal<DashboardStats | null>(null);
  private lowStockProducts = signal<Product[]>([]);
  
  public stats$ = computed(() => this.stats());
  public lowStockProducts$ = computed(() => this.lowStockProducts());

  constructor(
    private transactionsService: TransactionsService,
    private expensesService: ExpensesService,
    private stockService: StockService
  ) {}

  async loadDashboardStats(): Promise<DashboardStats> {
    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());

    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);

    // Charger les ventes
    const allSales = await this.transactionsService.getSales();
    
    // Charger les dépenses
    await this.expensesService.loadExpenses();
    const allExpenses = this.expensesService.expenses$();

    // Filtrer par période
    const todaySales = this.filterByDateRange(allSales, today, tomorrow);
    const weekSales = this.filterByDateRange(allSales, weekStart, now);
    const monthSales = this.filterByDateRange(allSales, monthStart, monthEnd);

    const todayExpenses = await this.expensesService.getExpensesByDateRange(today, tomorrow);
    const weekExpenses = await this.expensesService.getExpensesByDateRange(weekStart, now);
    const monthExpenses = await this.expensesService.getExpensesByDateRange(monthStart, monthEnd);

    const stats: DashboardStats = {
      today: {
        sales: todaySales.reduce((sum, s) => sum + s.totalAmount, 0),
        expenses: todayExpenses.reduce((sum, e) => sum + e.amount, 0),
        profit: todaySales.reduce((sum, s) => sum + s.totalAmount, 0) - todayExpenses.reduce((sum, e) => sum + e.amount, 0),
        transactionsCount: todaySales.length + todayExpenses.length
      },
      week: {
        sales: weekSales.reduce((sum, s) => sum + s.totalAmount, 0),
        expenses: weekExpenses.reduce((sum, e) => sum + e.amount, 0),
        profit: weekSales.reduce((sum, s) => sum + s.totalAmount, 0) - weekExpenses.reduce((sum, e) => sum + e.amount, 0),
        transactionsCount: weekSales.length + weekExpenses.length
      },
      month: {
        sales: monthSales.reduce((sum, s) => sum + s.totalAmount, 0),
        expenses: monthExpenses.reduce((sum, e) => sum + e.amount, 0),
        profit: monthSales.reduce((sum, s) => sum + s.totalAmount, 0) - monthExpenses.reduce((sum, e) => sum + e.amount, 0),
        transactionsCount: monthSales.length + monthExpenses.length
      }
    };

    this.stats.set(stats);
    
    // Charger les alertes de stock bas
    await this.loadLowStockAlerts();
    
    return stats;
  }

  private filterByDateRange(sales: Sale[], startDate: Date, endDate: Date): Sale[] {
    return sales.filter(sale => {
      const saleDate = sale.date instanceof Date ? sale.date : new Date(sale.date);
      return saleDate >= startDate && saleDate <= endDate;
    });
  }

  async getFinancialSummary(startDate: Date, endDate: Date): Promise<FinancialSummary> {
    const sales = await this.transactionsService.getSales(startDate, endDate);
    const expenses = await this.expensesService.getExpensesByDateRange(startDate, endDate);
    
    const totalRevenue = sales.reduce((sum, s) => sum + s.totalAmount, 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

    const netProfit = totalRevenue - totalExpenses;
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

    return {
      totalRevenue,
      totalExpenses,
      netProfit,
      profitMargin,
      period: { start: startDate, end: endDate }
    };
  }

  async loadLowStockAlerts(): Promise<void> {
    const lowStock = await this.stockService.getLowStockProducts();
    this.lowStockProducts.set(lowStock);
  }

  async getLowStockCount(): Promise<number> {
    const lowStockProducts = await this.stockService.getLowStockProducts();
    return lowStockProducts.length;
  }
}
