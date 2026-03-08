import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface NavItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-mobile-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-2xl border-t border-gray-100/50 shadow-[0_-8px_30px_rgb(0,0,0,0.04)] z-50 sm:hidden rounded-t-[32px] px-2 h-[88px]">
      <div class="flex justify-between items-center h-full max-w-lg mx-auto relative px-4">
        
        <!-- Dashboard -->
        <a routerLink="/dashboard" routerLinkActive="active" class="flex flex-col items-center justify-center w-16 group transition-all">
          <div class="w-12 h-12 flex items-center justify-center rounded-2xl group-[.active]:bg-emerald-50 text-gray-400 group-[.active]:text-emerald-600 transition-all duration-300">
            <i class="fas fa-th-large text-xl"></i>
          </div>
          <span class="text-[10px] font-bold mt-1 tracking-tight text-gray-400 group-[.active]:text-emerald-700">ACCUEIL</span>
        </a>

        <!-- Caisse -->
        <a routerLink="/sales" routerLinkActive="active" class="flex flex-col items-center justify-center w-16 group transition-all">
          <div class="w-12 h-12 flex items-center justify-center rounded-2xl group-[.active]:bg-emerald-50 text-gray-400 group-[.active]:text-emerald-600 transition-all duration-300">
            <i class="fas fa-cash-register text-xl"></i>
          </div>
          <span class="text-[10px] font-bold mt-1 tracking-tight text-gray-400 group-[.active]:text-emerald-700">CAISSE</span>
        </a>

        <!-- FAB Center Button -->
        <div class="relative -mt-12 flex flex-col items-center">
          <button (click)="toggleFabMenu()" class="w-16 h-16 bg-gradient-to-tr from-emerald-600 to-green-400 rounded-3xl shadow-[0_12px_24px_rgba(16,185,129,0.35)] flex items-center justify-center text-white text-2xl transform active:scale-90 transition-all duration-200 border-4 border-white">
            <i class="fas" [class.fa-plus]="!isFabOpen" [class.fa-times]="isFabOpen"></i>
          </button>
          
          <!-- Quick Menu -->
          <div *ngIf="isFabOpen" class="absolute bottom-20 flex flex-col items-center gap-4 animate-fade-in-up">
            <a routerLink="/sales/new" (click)="isFabOpen = false" class="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl shadow-xl border border-emerald-50 min-w-[160px]">
              <div class="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
                <i class="fas fa-plus"></i>
              </div>
              <span class="font-bold text-sm text-gray-700">Vente</span>
            </a>
            <a routerLink="/expenses/new" (click)="isFabOpen = false" class="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl shadow-xl border border-red-50 min-w-[160px]">
              <div class="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center text-red-600">
                <i class="fas fa-minus"></i>
              </div>
              <span class="font-bold text-sm text-gray-700">Dépense</span>
            </a>
          </div>
        </div>

        <!-- Stock -->
        <a routerLink="/inventory" routerLinkActive="active" class="flex flex-col items-center justify-center w-16 group transition-all">
          <div class="w-12 h-12 flex items-center justify-center rounded-2xl group-[.active]:bg-emerald-50 text-gray-400 group-[.active]:text-emerald-600 transition-all duration-300">
            <i class="fas fa-box-open text-xl"></i>
          </div>
          <span class="text-[10px] font-bold mt-1 tracking-tight text-gray-400 group-[.active]:text-emerald-700">STOCK</span>
        </a>

        <!-- Finances -->
        <a routerLink="/expenses" routerLinkActive="active" class="flex flex-col items-center justify-center w-16 group transition-all">
          <div class="w-12 h-12 flex items-center justify-center rounded-2xl group-[.active]:bg-emerald-50 text-gray-400 group-[.active]:text-emerald-600 transition-all duration-300">
            <i class="fas fa-wallet text-xl"></i>
          </div>
          <span class="text-[10px] font-bold mt-1 tracking-tight text-gray-400 group-[.active]:text-emerald-700">AUTRE</span>
        </a>

      </div>
    </nav>
    
    <!-- Overlay for FAB -->
    <div *ngIf="isFabOpen" (click)="isFabOpen = false" class="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-40 sm:hidden"></div>
  `,
  styles: [`
    :host {
      display: contents;
    }
  `]
})
export class MobileNavComponent {
  isFabOpen = false;

  toggleFabMenu(): void {
    this.isFabOpen = !this.isFabOpen;
  }
}
