import { Component, OnInit, inject, signal } from '@angular/core';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { StockService } from '@core/services/stock.service';
import { LoadingSpinnerComponent } from '@shared/components/ui/loading-spinner/loading-spinner.component';

const PRODUCT_CATEGORIES = [
  'Hauts (T-shirts, Chemises)',
  'Bas (Pantalons, Jupes)',
  'Robes & Ensembles',
  'Vestes & Manteaux',
  'Chaussures',
  'Sacs à main & Bagages',
  'Accessoires (Bijoux, Montres)',
  'Sous-vêtements',
  'Autre'
];

const FASHION_SIZES = [
  'Unique', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL',
  '36', '37', '38', '39', '40', '41', '42', '43', '44', '45',
  '28', '30', '32', '34'
];

const PRODUCT_UNITS = [
  { value: 'pièce', label: 'Pièce(s)' },
  { value: 'paire', label: 'Paire(s)' },
  { value: 'lot', label: 'Lot(s)' }
];

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule, LoadingSpinnerComponent],
  templateUrl: './product-form.page.html',
  styleUrl: './product-form.page.scss'
})
export class ProductFormPageComponent implements OnInit {
  private fb = inject(FormBuilder);
  private stockService = inject(StockService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  productForm: FormGroup;
  categories = PRODUCT_CATEGORIES;
  units = PRODUCT_UNITS;
  sizes = FASHION_SIZES;
  
  isLoading = signal(false);
  isSubmitting = signal(false);
  isEditMode = signal(false);
  productId = signal<string | null>(null);

  constructor() {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      category: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      costPrice: [null],
      stock: [0, [Validators.required, Validators.min(0)]],
      minStock: [5],
      unit: ['pièce', Validators.required],
      sku: [''],
      size: ['Unique'],
      color: [''],
      material: [''],
      gender: ['Unisexe']
    });
  }

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEditMode.set(true);
      this.productId.set(id);
      await this.loadProduct(id);
    }
  }

  async loadProduct(id: string): Promise<void> {
    this.isLoading.set(true);
    try {
      const product = await this.stockService.getProduct(id);
      if (product) {
        this.productForm.patchValue({
          name: product.name,
          description: product.description || '',
          category: product.category,
          price: product.price,
          costPrice: product.costPrice || null,
          stock: product.stock,
          minStock: product.minStock || 5,
          unit: product.unit,
          sku: product.sku || '',
          size: product.size || 'Unique',
          color: product.color || '',
          material: product.material || '',
          gender: product.gender || 'Unisexe'
        });
      }
    } finally {
      this.isLoading.set(false);
    }
  }

  updateStock(amount: number): void {
    const current = this.productForm.get('stock')?.value || 0;
    this.productForm.patchValue({ stock: Math.max(0, current + amount) });
  }

  async onSubmit(): Promise<void> {
    if (this.productForm.invalid) return;
    this.isSubmitting.set(true);

    try {
      const formValue = this.productForm.value;
      const productData = {
        ...formValue,
        price: Number(formValue.price),
        costPrice: formValue.costPrice ? Number(formValue.costPrice) : null,
        stock: Number(formValue.stock),
        isActive: true
      };

      if (this.isEditMode() && this.productId()) {
        await this.stockService.updateProduct(this.productId()!, productData);
      } else {
        await this.stockService.createProduct(productData);
      }
      this.router.navigate(['/inventory/products']);
    } catch (error: any) {
      alert('Erreur: ' + error.message);
    } finally {
      this.isSubmitting.set(false);
    }
  }

  cancel(): void {
    this.router.navigate(['/inventory/products']);
  }
}
