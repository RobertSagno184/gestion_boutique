import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StockService } from '@core/services/stock.service';
import { Product } from '@core/models/product.model';
import { CurrencyFormatPipe } from '@shared/pipes/currency-format.pipe';
import { LoadingSpinnerComponent } from '@shared/components/ui/loading-spinner/loading-spinner.component';
import { ButtonComponent } from '@shared/components/ui/button/button.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencyFormatPipe, LoadingSpinnerComponent],
  templateUrl: './products.page.html',
  styleUrl: './products.page.scss'
})
export class ProductsPageComponent implements OnInit {
  private stockService = inject(StockService);

  products: Product[] = [];
  isLoading = false;

  get normalStockCount(): number {
    return this.products.filter(p => p.stock > (p.minStock || 0)).length;
  }

  get lowStockCount(): number {
    return this.products.filter(p => p.stock > 0 && p.stock <= (p.minStock || 0)).length;
  }

  get outOfStockCount(): number {
    return this.products.filter(p => p.stock === 0).length;
  }

  async ngOnInit(): Promise<void> {
    this.isLoading = true;
    try {
      await this.stockService.loadProducts();
      this.products = this.stockService.products$();
    } finally {
      this.isLoading = false;
    }
  }

  async deleteProduct(product: Product): Promise<void> {
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${product.name}" ?`)) {
      try {
        await this.stockService.updateProduct(product.id!, { isActive: false });
        await this.stockService.loadProducts();
        this.products = this.stockService.products$();
      } catch (error: any) {
        alert('Erreur: ' + error.message);
      }
    }
  }
}
