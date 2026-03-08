import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WorkersService } from '@core/services/workers.service';
import { Worker } from '@core/models/worker.model';
import { LoadingSpinnerComponent } from '@shared/components/ui/loading-spinner/loading-spinner.component';
import { CurrencyFormatPipe } from '@shared/pipes/currency-format.pipe';
import { ButtonComponent } from '@shared/components/ui/button/button.component';

@Component({
  selector: 'app-workers',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingSpinnerComponent, CurrencyFormatPipe, ButtonComponent],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            <i class="fas fa-users mr-2"></i>Équipe
          </h1>
          <p class="text-sm text-gray-500 mt-1">Gérez vos ouvriers et leurs paiements</p>
        </div>
        <app-button routerLink="/workers/new" variant="primary" size="md">
          <i class="fas fa-user-plus mr-2"></i>Ajouter un ouvrier
        </app-button>
      </div>

      <div *ngIf="isLoading" class="flex justify-center py-12">
        <app-loading-spinner [size]="50" message="Chargement..."></app-loading-spinner>
      </div>

      <div *ngIf="!isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div
          *ngFor="let worker of workers"
          class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300">
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                {{ worker.firstName.charAt(0) }}{{ worker.lastName.charAt(0) }}
              </div>
              <div>
                <h3 class="font-semibold text-gray-900">
                  {{ worker.firstName }} {{ worker.lastName }}
                </h3>
                <span class="text-sm text-purple-600 font-medium">
                  {{ worker.role }}
                </span>
              </div>
            </div>
          </div>
          
          <div class="space-y-2 text-sm text-gray-600 mb-4">
            <p *ngIf="worker.phone" class="flex items-center">
              <i class="fas fa-phone text-gray-400 w-5 mr-2"></i>{{ worker.phone }}
            </p>
            <p *ngIf="worker.email" class="flex items-center">
              <i class="fas fa-envelope text-gray-400 w-5 mr-2"></i>{{ worker.email }}
            </p>
            <p *ngIf="worker.monthlySalary" class="flex items-center">
              <i class="fas fa-money-bill-wave text-green-500 w-5 mr-2"></i>
              <span class="font-semibold text-gray-900">{{ worker.monthlySalary | currencyFormat }}</span>
              <span class="text-gray-400 ml-1">/mois</span>
            </p>
            <p *ngIf="worker.hourlyRate" class="flex items-center">
              <i class="fas fa-clock text-blue-500 w-5 mr-2"></i>
              <span class="font-semibold text-gray-900">{{ worker.hourlyRate | currencyFormat }}</span>
              <span class="text-gray-400 ml-1">/heure</span>
            </p>
          </div>
          
          <div class="pt-4 border-t border-gray-100 flex gap-2">
            <a [routerLink]="['/workers', worker.id, 'payments']" 
               class="flex-1 text-center px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all text-sm font-medium">
              <i class="fas fa-money-bill-wave mr-1"></i>Payer
            </a>
            <a [routerLink]="['/workers', worker.id, 'edit']" 
               class="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
              <i class="fas fa-edit"></i>
            </a>
            <button (click)="deleteWorker(worker)" 
                    class="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>

      <div *ngIf="!isLoading && workers.length === 0" class="text-center py-16">
        <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="fas fa-users text-3xl text-gray-400"></i>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Aucun ouvrier</h3>
        <p class="text-gray-500 mb-4">Commencez par ajouter les membres de votre équipe</p>
        <app-button routerLink="/workers/new" variant="primary" size="md">
          <i class="fas fa-user-plus mr-2"></i>Ajouter un ouvrier
        </app-button>
      </div>
    </div>
  `,
  styles: []
})
export class WorkersPageComponent implements OnInit {
  private workersService = inject(WorkersService);

  workers: Worker[] = [];
  isLoading = false;

  async ngOnInit(): Promise<void> {
    this.isLoading = true;
    try {
      await this.workersService.loadWorkers();
      this.workers = this.workersService.workers$();
    } finally {
      this.isLoading = false;
    }
  }

  async deleteWorker(worker: Worker): Promise<void> {
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${worker.firstName} ${worker.lastName} ?`)) {
      try {
        await this.workersService.deleteWorker(worker.id!);
        this.workers = this.workersService.workers$();
      } catch (error: any) {
        alert('Erreur: ' + error.message);
      }
    }
  }
}
