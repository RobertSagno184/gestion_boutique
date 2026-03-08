import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ExpensesService } from '@core/services/expenses.service';
import { Expense } from '@core/models/expense.model';
import { CurrencyFormatPipe } from '@shared/pipes/currency-format.pipe';
import { LoadingSpinnerComponent } from '@shared/components/ui/loading-spinner/loading-spinner.component';
import { formatDate } from '@shared/utils/formatters';

@Component({
  selector: 'app-expenses-list',
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencyFormatPipe, LoadingSpinnerComponent],
  templateUrl: './expenses-list.page.html',
  styleUrl: './expenses-list.page.scss'
})
export class ExpensesListPageComponent implements OnInit {
  private expensesService = inject(ExpensesService);

  expenses = signal<Expense[]>([]);
  isLoading = signal(false);
  expandedId = signal<string | null>(null);
  
  todayTotal = signal(0);
  weekTotal = signal(0);
  monthTotal = signal(0);

  formatDate = formatDate;

  async ngOnInit(): Promise<void> {
    this.isLoading.set(true);
    try {
      await this.expensesService.loadExpenses();
      this.expenses.set(this.expensesService.expenses$());
      await this.loadStats();
    } finally {
      this.isLoading.set(false);
    }
  }

  async loadStats(): Promise<void> {
    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(now);
    todayEnd.setHours(23, 59, 59, 999);
    
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);
    
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    this.todayTotal.set(await this.expensesService.getTotalExpensesByPeriod(todayStart, todayEnd));
    this.weekTotal.set(await this.expensesService.getTotalExpensesByPeriod(weekStart, now));
    this.monthTotal.set(await this.expensesService.getTotalExpensesByPeriod(monthStart, monthEnd));
  }

  toggleExpand(id: string): void {
    this.expandedId.set(this.expandedId() === id ? null : id);
  }

  getPaymentLabel(method: string): string {
    const methods: Record<string, string> = {
      cash: 'Espèces',
      mobile: 'Mobile',
      bank_transfer: 'Virement',
      card: 'Carte'
    };
    return methods[method] || method;
  }

  getPaymentIcon(method: string): string {
    const icons: Record<string, string> = {
      cash: 'fas fa-money-bill-wave',
      mobile: 'fas fa-mobile-screen',
      bank_transfer: 'fas fa-building-columns',
      card: 'fas fa-credit-card'
    };
    return icons[method] || 'fas fa-money-bill';
  }

  async deleteExpense(expense: Expense): Promise<void> {
    if (confirm(`Supprimer cette dépense de ${expense.amount} FG ?`)) {
      try {
        await this.expensesService.deleteExpense(expense.id!);
        this.expenses.set(this.expensesService.expenses$());
        await this.loadStats();
      } catch (error: any) {
        alert('Erreur: ' + error.message);
      }
    }
  }
}
