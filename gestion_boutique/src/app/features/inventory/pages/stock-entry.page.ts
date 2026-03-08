import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StockService } from '@core/services/stock.service';
import { Product, StockMovement } from '@core/models/product.model';
import { ButtonComponent } from '@shared/components/ui/button/button.component';
import { LoadingSpinnerComponent } from '@shared/components/ui/loading-spinner/loading-spinner.component';
import { formatDate } from '@shared/utils/formatters';

@Component({
  selector: 'app-stock-entry',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent, LoadingSpinnerComponent],
  templateUrl: './stock-entry.page.html',
  styleUrl: './stock-entry.page.scss'
})
export class StockEntryPageComponent implements OnInit {
  private fb = inject(FormBuilder);
  private stockService = inject(StockService);
  private router = inject(Router);

  stockForm: FormGroup;
  products = signal<Product[]>([]);
  movements = signal<StockMovement[]>([]);
  selectedProduct = signal<Product | null>(null);
  selectedType = signal<'in' | 'out' | 'adjustment'>('in');
  
  isLoading = signal(false);
  isSubmitting = signal(false);
  isLoadingHistory = signal(false);

  formatDate = formatDate;

  constructor() {
    this.stockForm = this.fb.group({
      type: ['in', Validators.required],
      productId: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
      reason: ['', Validators.required],
      customReason: ['']
    });
  }

  async ngOnInit(): Promise<void> {
    this.isLoading.set(true);
    this.isLoadingHistory.set(true);
    
    try {
      await this.stockService.loadProducts();
      this.products.set(this.stockService.products$());
      
      const movements = await this.stockService.getStockMovements();
      this.movements.set(movements.slice(0, 20)); // Last 20 movements
    } finally {
      this.isLoading.set(false);
      this.isLoadingHistory.set(false);
    }
  }

  selectMovementType(type: 'in' | 'out' | 'adjustment'): void {
    this.selectedType.set(type);
    this.stockForm.patchValue({ type, reason: '' });
  }

  onProductChange(): void {
    const productId = this.stockForm.get('productId')?.value;
    const product = this.products().find(p => p.id === productId);
    this.selectedProduct.set(product || null);
  }

  getNewStock(): number {
    const product = this.selectedProduct();
    const quantity = Number(this.stockForm.get('quantity')?.value) || 0;
    const type = this.selectedType();
    
    if (!product) return 0;
    
    if (type === 'in') {
      return product.stock + quantity;
    } else if (type === 'out') {
      return Math.max(0, product.stock - quantity);
    } else {
      // For adjustment, quantity is the new stock value
      return quantity;
    }
  }

  getProductName(productId: string): string {
    const product = this.products().find(p => p.id === productId);
    return product?.name || 'Produit inconnu';
  }

  async onSubmit(): Promise<void> {
    if (this.stockForm.invalid) {
      this.stockForm.markAllAsTouched();
      return;
    }

    const product = this.selectedProduct();
    if (!product) return;

    const quantity = Number(this.stockForm.get('quantity')?.value);
    const type = this.selectedType();
    let reason = this.stockForm.get('reason')?.value;
    
    if (reason === 'Autre') {
      reason = this.stockForm.get('customReason')?.value || 'Autre';
    }

    // Validate stock out
    if (type === 'out' && quantity > product.stock) {
      alert(`Stock insuffisant. Stock actuel: ${product.stock} ${product.unit}`);
      return;
    }

    this.isSubmitting.set(true);

    try {
      if (type === 'in') {
        await this.stockService.increaseStock(product.id!, quantity, reason);
      } else if (type === 'out') {
        await this.stockService.decreaseStock(product.id!, quantity, reason);
      } else {
        // Adjustment: set stock to the new value
        const diff = quantity - product.stock;
        if (diff > 0) {
          await this.stockService.increaseStock(product.id!, diff, reason);
        } else if (diff < 0) {
          await this.stockService.decreaseStock(product.id!, Math.abs(diff), reason);
        }
      }

      // Refresh data
      await this.stockService.loadProducts();
      this.products.set(this.stockService.products$());
      
      const movements = await this.stockService.getStockMovements();
      this.movements.set(movements.slice(0, 20));

      // Reset form
      this.stockForm.reset({ type: 'in', reason: '' });
      this.selectedProduct.set(null);
      this.selectedType.set('in');

      alert('Mouvement enregistré avec succès !');
    } catch (error: any) {
      alert('Erreur: ' + (error.message || 'Impossible d\'enregistrer le mouvement'));
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
