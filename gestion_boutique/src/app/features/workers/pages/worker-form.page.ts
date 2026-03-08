import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { WorkersService } from '@core/services/workers.service';
import { Worker } from '@core/models/worker.model';
import { ButtonComponent } from '@shared/components/ui/button/button.component';
import { LoadingSpinnerComponent } from '@shared/components/ui/loading-spinner/loading-spinner.component';

const WORKER_ROLES = [
  'Vendeur',
  'Caissier',
  'Magasinier',
  'Livreur',
  'Gérant',
  'Comptable',
  'Agent de sécurité',
  'Agent d\'entretien',
  'Technicien',
  'Autre'
];

@Component({
  selector: 'app-worker-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent, LoadingSpinnerComponent],
  template: `
    <div class="max-w-2xl mx-auto space-y-6">
      <!-- Header -->
      <div class="flex items-center space-x-4">
        <button (click)="cancel()" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <i class="fas fa-arrow-left text-gray-600"></i>
        </button>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">
            {{ isEditMode() ? 'Modifier l\\'ouvrier' : 'Nouvel ouvrier' }}
          </h1>
          <p class="text-sm text-gray-500">
            {{ isEditMode() ? 'Mettre à jour les informations' : 'Ajouter un nouveau membre à l\\'équipe' }}
          </p>
        </div>
      </div>

      <div *ngIf="isLoading()" class="flex justify-center py-12">
        <app-loading-spinner [size]="50" message="Chargement..."></app-loading-spinner>
      </div>

      <form *ngIf="!isLoading()" [formGroup]="workerForm" (ngSubmit)="onSubmit()" class="space-y-6">
        <!-- Personal Info -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
          <h3 class="text-lg font-semibold text-gray-900 flex items-center">
            <i class="fas fa-user text-blue-500 mr-2"></i>
            Informations personnelles
          </h3>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Prénom <span class="text-red-500">*</span>
              </label>
              <input
                formControlName="firstName"
                type="text"
                placeholder="Ex: Jean"
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <div *ngIf="workerForm.get('firstName')?.invalid && workerForm.get('firstName')?.touched" 
                   class="text-red-500 text-sm mt-1">
                Le prénom est requis
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Nom <span class="text-red-500">*</span>
              </label>
              <input
                formControlName="lastName"
                type="text"
                placeholder="Ex: Dupont"
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <div *ngIf="workerForm.get('lastName')?.invalid && workerForm.get('lastName')?.touched" 
                   class="text-red-500 text-sm mt-1">
                Le nom est requis
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Téléphone <span class="text-red-500">*</span>
              </label>
              <input
                formControlName="phone"
                type="tel"
                placeholder="Ex: 97 00 00 00"
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <div *ngIf="workerForm.get('phone')?.invalid && workerForm.get('phone')?.touched" 
                   class="text-red-500 text-sm mt-1">
                Le téléphone est requis
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Email (optionnel)
              </label>
              <input
                formControlName="email"
                type="email"
                placeholder="Ex: jean.dupont@email.com"
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            </div>
          </div>
        </div>

        <!-- Job Info -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
          <h3 class="text-lg font-semibold text-gray-900 flex items-center">
            <i class="fas fa-briefcase text-purple-500 mr-2"></i>
            Informations professionnelles
          </h3>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Poste / Rôle <span class="text-red-500">*</span>
              </label>
              <select
                formControlName="role"
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="">-- Sélectionner --</option>
                @for (role of roles; track role) {
                  <option [value]="role">{{ role }}</option>
                }
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Date d'embauche <span class="text-red-500">*</span>
              </label>
              <input
                formControlName="hireDate"
                type="date"
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            </div>
          </div>
        </div>

        <!-- Salary Info -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
          <h3 class="text-lg font-semibold text-gray-900 flex items-center">
            <i class="fas fa-money-bill-wave text-green-500 mr-2"></i>
            Rémunération
          </h3>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-3">Type de rémunération</label>
            <div class="grid grid-cols-2 gap-4">
              <button
                type="button"
                (click)="selectSalaryType('monthly')"
                [class.ring-2]="salaryType() === 'monthly'"
                [class.ring-blue-500]="salaryType() === 'monthly'"
                [class.bg-blue-50]="salaryType() === 'monthly'"
                class="p-4 rounded-xl border border-gray-200 hover:border-blue-300 transition-all text-center">
                <i class="fas fa-calendar-alt text-blue-600 text-xl mb-2"></i>
                <span class="block text-sm font-medium text-gray-700">Salaire mensuel</span>
              </button>
              <button
                type="button"
                (click)="selectSalaryType('hourly')"
                [class.ring-2]="salaryType() === 'hourly'"
                [class.ring-blue-500]="salaryType() === 'hourly'"
                [class.bg-blue-50]="salaryType() === 'hourly'"
                class="p-4 rounded-xl border border-gray-200 hover:border-blue-300 transition-all text-center">
                <i class="fas fa-clock text-blue-600 text-xl mb-2"></i>
                <span class="block text-sm font-medium text-gray-700">Taux horaire</span>
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div *ngIf="salaryType() === 'monthly'">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Salaire mensuel (FG)
              </label>
              <div class="relative">
                <input
                  formControlName="monthlySalary"
                  type="number"
                  min="0"
                  placeholder="Ex: 75000"
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-16">
                <span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">FG</span>
              </div>
            </div>

            <div *ngIf="salaryType() === 'hourly'">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Taux horaire (FG/h)
              </label>
              <div class="relative">
                <input
                  formControlName="hourlyRate"
                  type="number"
                  min="0"
                  placeholder="Ex: 500"
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-20">
                <span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">FG/h</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row gap-4">
          <app-button
            type="submit"
            [disabled]="workerForm.invalid || isSubmitting()"
            variant="primary"
            size="lg"
            [fullWidth]="true">
            <i class="fas fa-save mr-2"></i>
            {{ isSubmitting() ? 'Enregistrement...' : (isEditMode() ? 'Mettre à jour' : 'Ajouter l\\'ouvrier') }}
          </app-button>
          <app-button
            type="button"
            (click)="cancel()"
            variant="outline"
            size="lg">
            Annuler
          </app-button>
        </div>
      </form>
    </div>
  `,
  styles: []
})
export class WorkerFormPageComponent implements OnInit {
  private fb = inject(FormBuilder);
  private workersService = inject(WorkersService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  workerForm: FormGroup;
  roles = WORKER_ROLES;
  
  isLoading = signal(false);
  isSubmitting = signal(false);
  isEditMode = signal(false);
  workerId = signal<string | null>(null);
  salaryType = signal<'monthly' | 'hourly'>('monthly');

  constructor() {
    const today = new Date().toISOString().split('T')[0];
    
    this.workerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', Validators.required],
      email: [''],
      role: ['', Validators.required],
      hireDate: [today, Validators.required],
      monthlySalary: [null],
      hourlyRate: [null]
    });
  }

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEditMode.set(true);
      this.workerId.set(id);
      await this.loadWorker(id);
    }
  }

  async loadWorker(id: string): Promise<void> {
    this.isLoading.set(true);
    try {
      const worker = await this.workersService.getWorker(id);
      if (worker) {
        const hireDate = worker.hireDate instanceof Date 
          ? worker.hireDate.toISOString().split('T')[0]
          : new Date(worker.hireDate).toISOString().split('T')[0];

        this.workerForm.patchValue({
          firstName: worker.firstName,
          lastName: worker.lastName,
          phone: worker.phone,
          email: worker.email || '',
          role: worker.role,
          hireDate: hireDate,
          monthlySalary: worker.monthlySalary || null,
          hourlyRate: worker.hourlyRate || null
        });

        // Set salary type based on existing data
        if (worker.hourlyRate) {
          this.salaryType.set('hourly');
        } else {
          this.salaryType.set('monthly');
        }
      } else {
        alert('Ouvrier non trouvé');
        this.router.navigate(['/workers']);
      }
    } finally {
      this.isLoading.set(false);
    }
  }

  selectSalaryType(type: 'monthly' | 'hourly'): void {
    this.salaryType.set(type);
    if (type === 'monthly') {
      this.workerForm.patchValue({ hourlyRate: null });
    } else {
      this.workerForm.patchValue({ monthlySalary: null });
    }
  }

  async onSubmit(): Promise<void> {
    if (this.workerForm.invalid) {
      this.workerForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    try {
      const formValue = this.workerForm.value;
      const workerData = {
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        phone: formValue.phone,
        email: formValue.email || undefined,
        role: formValue.role,
        hireDate: new Date(formValue.hireDate),
        monthlySalary: formValue.monthlySalary ? Number(formValue.monthlySalary) : undefined,
        hourlyRate: formValue.hourlyRate ? Number(formValue.hourlyRate) : undefined,
        isActive: true
      };

      if (this.isEditMode() && this.workerId()) {
        await this.workersService.updateWorker(this.workerId()!, workerData);
      } else {
        await this.workersService.createWorker(workerData);
      }

      this.router.navigate(['/workers']);
    } catch (error: any) {
      alert('Erreur: ' + (error.message || 'Impossible d\'enregistrer l\'ouvrier'));
    } finally {
      this.isSubmitting.set(false);
    }
  }

  cancel(): void {
    this.router.navigate(['/workers']);
  }
}
