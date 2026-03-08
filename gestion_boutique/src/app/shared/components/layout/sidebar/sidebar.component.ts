import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface NavItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 md:pt-16">
      <div class="flex-1 flex flex-col bg-white/95 backdrop-blur-sm border-r border-gray-100 shadow-sm">
        <nav class="flex-1 px-3 py-6 space-y-2">
          <a
            *ngFor="let item of navItems"
            [routerLink]="item.route"
            routerLinkActive="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 shadow-sm border-l-4 border-blue-500"
            [routerLinkActiveOptions]="{ exact: false }"
            class="group flex items-center px-4 py-3 text-sm font-medium text-gray-600 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 ease-in-out relative">
            <i [class]="item.icon" class="mr-3 w-5 text-center text-gray-400 group-hover:text-blue-500 transition-colors"></i>
            <span class="flex-1">{{ item.label }}</span>
            <div class="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </a>
        </nav>
      </div>
    </aside>
  `,
  styles: []
})
export class SidebarComponent {
  @Input() navItems: NavItem[] = [
    { label: 'Tableau de bord', route: '/dashboard', icon: 'fas fa-th-large' },
    { label: 'Caisse & Ventes', route: '/sales', icon: 'fas fa-cash-register' },
    { label: 'Stock & Produits', route: '/inventory', icon: 'fas fa-box-open' },
    { label: 'Dépenses', route: '/expenses', icon: 'fas fa-wallet' }
  ];
}
