import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { DashboardService } from '@core/services/dashboard.service';
import { StockService } from '@core/services/stock.service';
import { Product } from '@core/models/product.model';
import { CurrencyFormatPipe } from '@shared/pipes/currency-format.pipe';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CurrencyFormatPipe
  ],
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-out', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class DashboardPageComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  private stockService = inject(StockService);
  
  stats = this.dashboardService.stats$;
  lowStockProducts = signal<Product[]>([]);
  isLoading = false;

  async ngOnInit(): Promise<void> {
    this.isLoading = true;
    try {
      await this.dashboardService.loadDashboardStats();
      const lowStock = await this.stockService.getLowStockProducts();
      this.lowStockProducts.set(lowStock);
    } finally {
      this.isLoading = false;
    }
  }
}
