import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TransactionsService } from '@core/services/transactions.service';
import { StockService } from '@core/services/stock.service';
import { SaleItem } from '@core/models/transaction.model';
import { Product } from '@core/models/product.model';
import { CurrencyFormatPipe } from '@shared/pipes/currency-format.pipe';

interface CartItem {
  product: Product;
  quantity: number;
  total: number;
}

@Component({
  selector: 'app-new-sale',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyFormatPipe],
  templateUrl: './new-sale.page.html',
  styleUrl: './new-sale.page.scss'
})
export class NewSalePageComponent implements OnInit {
  private transactionsService = inject(TransactionsService);
  private stockService = inject(StockService);
  private router = inject(Router);

  // State
  products = signal<Product[]>([]);
  cart = signal<CartItem[]>([]);
  searchTerm = '';
  selectedCategory = signal<string>('all');
  customerName = '';
  customerPhone = '';
  paymentMethod: 'cash' | 'mobile' | 'card' = 'cash';
  showCustomerInfo = false;
  isSubmitting = signal(false);
  showSuccessModal = false;
  lastSaleAmount = 0;

  // Computed
  categories = computed(() => {
    const cats = new Set(this.products().map(p => p.category));
    return Array.from(cats);
  });

  filteredProducts = computed(() => {
    let filtered = this.products();
    
    if (this.selectedCategory() !== 'all') {
      filtered = filtered.filter(p => p.category === this.selectedCategory());
    }
    
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term)
      );
    }
    
    return filtered;
  });

  totalItems = computed(() => {
    return this.cart().reduce((sum, item) => sum + item.quantity, 0);
  });

  totalAmount = computed(() => {
    return this.cart().reduce((sum, item) => sum + item.total, 0);
  });

  async ngOnInit(): Promise<void> {
    await this.stockService.loadProducts();
    this.products.set(this.stockService.products$());
  }

  isInCart(product: Product): boolean {
    return this.cart().some(item => item.product.id === product.id);
  }

  addToCart(product: Product): void {
    if (product.stock === 0) return;

    const existingItem = this.cart().find(item => item.product.id === product.id);
    
    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        this.increaseQuantity(existingItem);
      }
    } else {
      this.cart.update(cart => [...cart, {
        product,
        quantity: 1,
        total: product.price
      }]);
    }
  }

  increaseQuantity(item: CartItem): void {
    if (item.quantity >= item.product.stock) return;
    
    this.cart.update(cart => cart.map(i => {
      if (i.product.id === item.product.id) {
        const newQty = i.quantity + 1;
        return { ...i, quantity: newQty, total: newQty * i.product.price };
      }
      return i;
    }));
  }

  decreaseQuantity(item: CartItem): void {
    if (item.quantity <= 1) {
      this.removeFromCart(item);
      return;
    }
    
    this.cart.update(cart => cart.map(i => {
      if (i.product.id === item.product.id) {
        const newQty = i.quantity - 1;
        return { ...i, quantity: newQty, total: newQty * i.product.price };
      }
      return i;
    }));
  }

  removeFromCart(item: CartItem): void {
    this.cart.update(cart => cart.filter(i => i.product.id !== item.product.id));
  }

  clearCart(): void {
    this.cart.set([]);
  }

  async submitSale(): Promise<void> {
    if (this.cart().length === 0) return;

    this.isSubmitting.set(true);

    try {
      const items: SaleItem[] = this.cart().map(item => ({
        productId: item.product.id!,
        productName: item.product.name,
        quantity: item.quantity,
        unitPrice: item.product.price,
        totalPrice: item.total
      }));

      await this.transactionsService.createSale({
        type: 'sale',
        amount: this.totalAmount(),
        currency: 'GNF',
        description: `Vente de ${items.length} produit(s)`,
        date: new Date(),
        items,
        customerName: this.customerName || undefined,
        customerPhone: this.customerPhone || undefined,
        totalAmount: this.totalAmount(),
        paymentMethod: this.paymentMethod
      });

      this.lastSaleAmount = this.totalAmount();
      this.showSuccessModal = true;
    } catch (error: any) {
      alert('Erreur: ' + (error.message || 'Impossible d\'enregistrer la vente'));
    } finally {
      this.isSubmitting.set(false);
    }
  }

  closeSuccessModal(): void {
    this.showSuccessModal = false;
  }

  newSale(): void {
    this.showSuccessModal = false;
    this.cart.set([]);
    this.customerName = '';
    this.customerPhone = '';
    this.paymentMethod = 'cash';
    // Reload products to get updated stock
    this.stockService.loadProducts().then(() => {
      this.products.set(this.stockService.products$());
    });
  }

  goToHistory(): void {
    this.router.navigate(['/sales']);
  }

  cancel(): void {
    this.router.navigate(['/dashboard']);
  }
}
