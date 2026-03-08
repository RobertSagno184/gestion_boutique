import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../shared/components/layout/header/header.component';
import { SidebarComponent } from '../../shared/components/layout/sidebar/sidebar.component';
import { MobileNavComponent } from '../../shared/components/layout/mobile-nav/mobile-nav.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, SidebarComponent, MobileNavComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <app-header></app-header>
      <div class="flex">
        <app-sidebar></app-sidebar>
        <main class="flex-1 md:ml-64 pb-16 md:pb-0">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <router-outlet></router-outlet>
          </div>
        </main>
      </div>
      <app-mobile-nav></app-mobile-nav>
    </div>
  `,
  styles: []
})
export class MainLayoutComponent {}
