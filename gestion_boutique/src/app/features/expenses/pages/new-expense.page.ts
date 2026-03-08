import { Component, OnInit, inject, signal } from '@angular/core';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ExpensesService } from '@core/services/expenses.service';
import { PAYMENT_METHODS_EXPENSE } from '@core/models/expense.model';

@Component({
  selector: 'app-new-expense',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './new-expense.page.html',
  styleUrl: './new-expense.page.scss'
})
export class NewExpensePageComponent implements OnInit {
  private fb = inject(FormBuilder);
  private expensesService = inject(ExpensesService);
  private router = inject(Router);

  expenseForm: FormGroup;
  paymentMethods = PAYMENT_METHODS_EXPENSE;
  isSubmitting = signal(false);

  constructor() {
    const today = new Date().toISOString().split('T')[0];
    
    this.expenseForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(1)]],
      description: ['', Validators.required],
      date: [today, Validators.required],
      paymentMethod: ['cash', Validators.required],
      reference: [''],
      supplier: [''],
      category: ['autre']
    });
  }

  async ngOnInit(): Promise<void> {
    // Plus besoin de charger les ouvriers ici
  }

  async onSubmit(): Promise<void> {
    if (this.expenseForm.invalid) {
      this.expenseForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    try {
      const formValue = this.expenseForm.value;
      
      const expenseData: any = {
        type: 'general',
        category: formValue.category || 'autre',
        amount: Number(formValue.amount),
        currency: 'GNF',
        description: formValue.description,
        date: new Date(formValue.date),
        paymentMethod: formValue.paymentMethod,
      };

      // Ne pas envoyer les champs s'ils sont vides/undefined
      if (formValue.reference) expenseData.reference = formValue.reference;
      if (formValue.supplier) expenseData.supplier = formValue.supplier;

      await this.expensesService.createExpense(expenseData);

      this.router.navigate(['/expenses']);
    } catch (error: any) {
      alert('Erreur: ' + (error.message || 'Impossible d\'enregistrer la dépense'));
    } finally {
      this.isSubmitting.set(false);
    }
  }

  cancel(): void {
    this.router.navigate(['/expenses']);
  }
}
