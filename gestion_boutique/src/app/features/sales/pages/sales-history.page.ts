import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TransactionsService } from '@core/services/transactions.service';
import { Sale } from '@core/models/transaction.model';
import { CurrencyFormatPipe } from '@shared/pipes/currency-format.pipe';
import { formatDate } from '@shared/utils/formatters';

@Component({
  selector: 'app-sales-history',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, CurrencyFormatPipe],
  templateUrl: './sales-history.page.html',
  styleUrl: './sales-history.page.scss'
})
export class SalesHistoryPageComponent implements OnInit {
  private transactionsService = inject(TransactionsService);

  sales = signal<Sale[]>([]);
  isLoading = signal(false);
  searchTerm = '';
  filterPeriod: 'all' | 'today' | 'week' | 'month' = 'all';
  expandedSales: Record<string, boolean> = {};

  formatDate = formatDate;

  // Computed filtered sales
  filteredSales = computed(() => {
    let filtered = this.sales();

    // Filter by period
    if (this.filterPeriod !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered.filter(sale => {
        const saleDate = new Date(sale.date);
        
        switch (this.filterPeriod) {
          case 'today':
            return saleDate >= today;
          case 'week':
            const weekStart = new Date(today);
            weekStart.setDate(today.getDate() - today.getDay());
            return saleDate >= weekStart;
          case 'month':
            const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
            return saleDate >= monthStart;
          default:
            return true;
        }
      });
    }

    // Filter by search term
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(sale => 
        (sale.customerName?.toLowerCase().includes(term)) ||
        sale.items.some(item => item.productName.toLowerCase().includes(term))
      );
    }

    return filtered;
  });

  // Stats computations
  todayTotal = computed(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.sales()
      .filter(s => new Date(s.date) >= today)
      .reduce((sum, s) => sum + s.totalAmount, 0);
  });

  weekTotal = computed(() => {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    weekStart.setHours(0, 0, 0, 0);
    return this.sales()
      .filter(s => new Date(s.date) >= weekStart)
      .reduce((sum, s) => sum + s.totalAmount, 0);
  });

  monthTotal = computed(() => {
    const today = new Date();
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    return this.sales()
      .filter(s => new Date(s.date) >= monthStart)
      .reduce((sum, s) => sum + s.totalAmount, 0);
  });

  grandTotal = computed(() => {
    return this.sales().reduce((sum, s) => sum + s.totalAmount, 0);
  });

  async ngOnInit(): Promise<void> {
    this.isLoading.set(true);
    try {
      const sales = await this.transactionsService.getSales();
      this.sales.set(sales);
    } finally {
      this.isLoading.set(false);
    }
  }

  getInitials(name: string | undefined): string {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  getPaymentMethodLabel(method: string): string {
    const methods: Record<string, string> = {
      cash: 'Espèces',
      card: 'Carte',
      mobile: 'Mobile Money'
    };
    return methods[method] || method;
  }

  getPaymentIcon(method: string): string {
    const icons: Record<string, string> = {
      cash: 'fas fa-money-bill-wave',
      card: 'fas fa-credit-card',
      mobile: 'fas fa-mobile-alt'
    };
    return icons[method] || 'fas fa-money-bill';
  }

  toggleDetails(sale: Sale): void {
    this.expandedSales[sale.id!] = !this.expandedSales[sale.id!];
  }
}
