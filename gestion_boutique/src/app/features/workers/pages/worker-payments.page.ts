import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { WorkersService } from '@core/services/workers.service';
import { ExpensesService } from '@core/services/expenses.service';
import { Worker, Payment } from '@core/models/worker.model';
import { Expense, PAYMENT_METHODS_EXPENSE } from '@core/models/expense.model';
import { ButtonComponent } from '@shared/components/ui/button/button.component';
import { LoadingSpinnerComponent } from '@shared/components/ui/loading-spinner/loading-spinner.component';
import { CurrencyFormatPipe } from '@shared/pipes/currency-format.pipe';
import { formatDate } from '@shared/utils/formatters';

const PAYMENT_TYPES = [
  { value: 'salaire', label: 'Salaire mensuel', icon: 'fa-calendar-check', color: 'blue' },
  { value: 'avance_salaire', label: 'Avance sur salaire', icon: 'fa-hand-holding-dollar', color: 'orange' },
  { value: 'bonus', label: 'Bonus / Prime', icon: 'fa-gift', color: 'green' }
];

@Component({
  selector: 'app-worker-payments',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent, LoadingSpinnerComponent, CurrencyFormatPipe],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center space-x-4">
        <button (click)="goBack()" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <i class="fas fa-arrow-left text-gray-600"></i>
        </button>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">
            Paiements - {{ worker()?.firstName }} {{ worker()?.lastName }}
          </h1>
          <p class="text-sm text-gray-500">{{ worker()?.role }}</p>
        </div>
      </div>

      <div *ngIf="isLoading()" class="flex justify-center py-12">
        <app-loading-spinner [size]="50" message="Chargement..."></app-loading-spinner>
      </div>

      <div *ngIf="!isLoading() && worker()" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Worker Info Card -->
        <div class="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-6 text-white">
          <div class="flex items-center space-x-4 mb-6">
            <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <i class="fas fa-user text-3xl"></i>
            </div>
            <div>
              <h2 class="text-xl font-bold">{{ worker()!.firstName }} {{ worker()!.lastName }}</h2>
              <p class="text-purple-200">{{ worker()!.role }}</p>
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-white/10 rounded-lg p-4">
              <p class="text-purple-200 text-sm">Salaire mensuel</p>
              <p class="text-2xl font-bold">
                {{ worker()!.monthlySalary || 0 | currencyFormat }}
              </p>
            </div>
            <div class="bg-white/10 rounded-lg p-4">
              <p class="text-purple-200 text-sm">Total payé ce mois</p>
              <p class="text-2xl font-bold">{{ monthlyPaid() | currencyFormat }}</p>
            </div>
          </div>

          <div class="mt-4 p-4 bg-white/10 rounded-lg">
            <div class="flex items-center justify-between">
              <span class="text-purple-200">Solde restant</span>
              <span class="text-xl font-bold" [class.text-green-300]="remainingBalance() >= 0" [class.text-red-300]="remainingBalance() < 0">
                {{ remainingBalance() | currencyFormat }}
              </span>
            </div>
          </div>
        </div>

        <!-- Payment Form -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <i class="fas fa-plus-circle text-green-500 mr-2"></i>
            Nouveau paiement
          </h3>

          <form [formGroup]="paymentForm" (ngSubmit)="onSubmit()" class="space-y-4">
            <!-- Payment Type -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">Type de paiement</label>
              <div class="grid grid-cols-3 gap-2">
                @for (type of paymentTypes; track type.value) {
                  <button
                    type="button"
                    (click)="selectPaymentType(type.value)"
                    [class.ring-2]="selectedPaymentType() === type.value"
                    [class.ring-blue-500]="selectedPaymentType() === type.value"
                    [class.bg-blue-50]="selectedPaymentType() === type.value"
                    class="p-3 rounded-xl border border-gray-200 hover:border-blue-300 transition-all text-center">
                    <i [class]="'fas ' + type.icon + ' text-' + type.color + '-600 text-xl mb-1'"></i>
                    <span class="block text-xs font-medium text-gray-700">{{ type.label }}</span>
                  </button>
                }
              </div>
            </div>

            <!-- Amount -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Montant (FG) <span class="text-red-500">*</span>
              </label>
              <input
                formControlName="amount"
                type="number"
                min="1"
                placeholder="Ex: 50000"
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-semibold">
            </div>

            <!-- Quick amounts -->
            <div class="flex flex-wrap gap-2">
              @for (amount of quickAmounts; track amount) {
                <button
                  type="button"
                  (click)="setAmount(amount)"
                  class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors">
                  {{ amount | number }} FG
                </button>
              }
              <button
                *ngIf="worker()?.monthlySalary"
                type="button"
                (click)="setAmount(worker()!.monthlySalary!)"
                class="px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg text-sm font-medium text-blue-700 transition-colors">
                Salaire complet
              </button>
            </div>

            <!-- Payment Method -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Mode de paiement</label>
              <select
                formControlName="paymentMethod"
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                @for (method of paymentMethods; track method.value) {
                  <option [value]="method.value">{{ method.label }}</option>
                }
              </select>
            </div>

            <!-- Date -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Date du paiement</label>
              <input
                formControlName="date"
                type="date"
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Note (optionnel)</label>
              <input
                formControlName="description"
                type="text"
                placeholder="Ex: Salaire mois de février"
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            </div>

            <!-- Submit -->
            <app-button
              type="submit"
              [disabled]="paymentForm.invalid || isSubmitting()"
              variant="primary"
              size="lg"
              [fullWidth]="true">
              <i class="fas fa-money-bill-wave mr-2"></i>
              {{ isSubmitting() ? 'Enregistrement...' : 'Effectuer le paiement' }}
            </app-button>
          </form>
        </div>

        <!-- Payment History -->
        <div class="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <i class="fas fa-history text-purple-500 mr-2"></i>
            Historique des paiements
          </h3>

          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mode</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Note</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                @for (payment of payments(); track payment.id) {
                  <tr class="hover:bg-gray-50">
                    <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ formatDate(payment.date) }}
                    </td>
                    <td class="px-4 py-4 whitespace-nowrap">
                      <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                            [class.bg-blue-100]="payment.category === 'salaire'"
                            [class.text-blue-800]="payment.category === 'salaire'"
                            [class.bg-orange-100]="payment.category === 'avance_salaire'"
                            [class.text-orange-800]="payment.category === 'avance_salaire'"
                            [class.bg-green-100]="payment.category === 'bonus'"
                            [class.text-green-800]="payment.category === 'bonus'">
                        {{ getPaymentTypeLabel(payment.category) }}
                      </span>
                    </td>
                    <td class="px-4 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {{ payment.amount | currencyFormat }}
                    </td>
                    <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ getPaymentMethodLabel(payment.paymentMethod) }}
                    </td>
                    <td class="px-4 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {{ payment.description || '-' }}
                    </td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="5" class="px-4 py-12 text-center text-gray-500">
                      <i class="fas fa-receipt text-4xl text-gray-300 mb-3"></i>
                      <p>Aucun paiement enregistré</p>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class WorkerPaymentsPageComponent implements OnInit {
  private fb = inject(FormBuilder);
  private workersService = inject(WorkersService);
  private expensesService = inject(ExpensesService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  paymentForm: FormGroup;
  paymentTypes = PAYMENT_TYPES;
  paymentMethods = PAYMENT_METHODS_EXPENSE;
  quickAmounts = [5000, 10000, 25000, 50000];
  
  worker = signal<Worker | null>(null);
  payments = signal<Expense[]>([]);
  
  isLoading = signal(false);
  isSubmitting = signal(false);
  selectedPaymentType = signal<string>('salaire');

  formatDate = formatDate;

  constructor() {
    const today = new Date().toISOString().split('T')[0];
    
    this.paymentForm = this.fb.group({
      type: ['salaire', Validators.required],
      amount: ['', [Validators.required, Validators.min(1)]],
      paymentMethod: ['cash', Validators.required],
      date: [today, Validators.required],
      description: ['']
    });
  }

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      await this.loadWorkerData(id);
    } else {
      this.router.navigate(['/workers']);
    }
  }

  async loadWorkerData(workerId: string): Promise<void> {
    this.isLoading.set(true);
    try {
      const worker = await this.workersService.getWorker(workerId);
      if (worker) {
        this.worker.set(worker);
        const payments = await this.expensesService.getWorkerPayments(workerId);
        this.payments.set(payments);
      } else {
        alert('Ouvrier non trouvé');
        this.router.navigate(['/workers']);
      }
    } finally {
      this.isLoading.set(false);
    }
  }

  monthlyPaid(): number {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    return this.payments()
      .filter(p => {
        const paymentDate = p.date instanceof Date ? p.date : new Date(p.date);
        return paymentDate >= startOfMonth;
      })
      .reduce((sum, p) => sum + p.amount, 0);
  }

  remainingBalance(): number {
    const salary = this.worker()?.monthlySalary || 0;
    return salary - this.monthlyPaid();
  }

  selectPaymentType(type: string): void {
    this.selectedPaymentType.set(type);
    this.paymentForm.patchValue({ type });
  }

  setAmount(amount: number): void {
    this.paymentForm.patchValue({ amount });
  }

  getPaymentTypeLabel(type: string): string {
    const found = PAYMENT_TYPES.find(t => t.value === type);
    return found?.label || type;
  }

  getPaymentMethodLabel(method: string): string {
    const found = PAYMENT_METHODS_EXPENSE.find(m => m.value === method);
    return found?.label || method;
  }

  async onSubmit(): Promise<void> {
    if (this.paymentForm.invalid || !this.worker()) return;

    this.isSubmitting.set(true);

    try {
      const formValue = this.paymentForm.value;
      const workerData = this.worker()!;

      await this.expensesService.createExpense({
        type: 'salary',
        category: this.selectedPaymentType() as any,
        amount: Number(formValue.amount),
        currency: 'GNF',
        description: formValue.description || `Paiement ${this.getPaymentTypeLabel(this.selectedPaymentType())}`,
        date: new Date(formValue.date),
        paymentMethod: formValue.paymentMethod,
        workerId: workerData.id,
        workerName: `${workerData.firstName} ${workerData.lastName}`
      });

      // Refresh payments
      const payments = await this.expensesService.getWorkerPayments(workerData.id!);
      this.payments.set(payments);

      // Reset form
      this.paymentForm.patchValue({ amount: '', description: '' });
      alert('Paiement enregistré avec succès !');
    } catch (error: any) {
      alert('Erreur: ' + (error.message || 'Impossible d\'enregistrer le paiement'));
    } finally {
      this.isSubmitting.set(false);
    }
  }

  goBack(): void {
    this.router.navigate(['/workers']);
  }
}
