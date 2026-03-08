import { Component, computed, inject } from '@angular/core';

import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@core/services/firebase/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  template: `
    <header class="bg-white/80 backdrop-blur-2xl shadow-[0_2px_15px_rgba(0,0,0,0.02)] border-b border-gray-100/50 sticky top-0 z-40 h-[72px] flex items-center">
      <div class="max-w-7xl mx-auto px-6 w-full">
        <div class="flex justify-between items-center">
    
          <!-- Logo & Branding -->
          <div class="flex items-center">
            <a routerLink="/dashboard" class="flex items-center space-x-3 group">
              <div class="w-10 h-10 bg-gray-900 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-all duration-300">
                <i class="fas fa-tshirt text-white text-sm"></i>
              </div>
              <div class="flex flex-col">
                <span class="text-lg font-black tracking-tighter text-gray-900 leading-none mb-0.5">MAISON MODE</span>
                <span class="text-[10px] font-bold text-emerald-600 tracking-widest uppercase">Gestion Elite</span>
              </div>
            </a>
          </div>
    
          <!-- User Controls -->
          <div class="flex items-center space-x-4">
    
            <!-- User Profile & Logout -->
            <div class="flex items-center bg-gray-50/50 p-1.5 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all group relative cursor-pointer" (click)="isProfileOpen = !isProfileOpen">
              <div class="h-9 w-9 rounded-xl bg-gray-900 flex items-center justify-center text-white text-[10px] font-black shadow-sm group-hover:bg-emerald-600 transition-all">
                {{ userInitials() }}
              </div>
              <div class="hidden md:flex flex-col ml-3 mr-4 pr-2">
                <span class="text-[11px] font-black text-gray-400 tracking-widest uppercase leading-none mb-1">Propriétaire</span>
                <span class="text-xs font-bold text-gray-700 truncate max-w-[120px]">
                  {{ currentUser()?.displayName || 'Admin' }}
                </span>
              </div>
              <i class="fas fa-chevron-down text-[10px] text-gray-300 mr-2 transition-transform" [class.rotate-180]="isProfileOpen"></i>
    
              <!-- Dropdown Menu -->
              @if (isProfileOpen) {
                <div class="absolute top-[52px] right-0 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 animate-fade-in-up z-50 overflow-hidden">
                  <div class="p-4 border-b border-gray-50 mb-1">
                    <p class="text-[10px] font-black text-gray-400 tracking-widest uppercase mb-1">Session Active</p>
                    <p class="text-xs font-bold text-gray-700 truncate">{{ currentUser()?.email }}</p>
                  </div>
                  <button
                    (click)="logout()"
                    class="w-full flex items-center space-x-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all">
                    <div class="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                      <i class="fas fa-sign-out-alt text-xs"></i>
                    </div>
                    <span>Se déconnecter</span>
                  </button>
                </div>
              }
            </div>
    
          </div>
        </div>
      </div>
    </header>
    
    <!-- Overlay for closing dropdown -->
    @if (isProfileOpen) {
      <div (click)="isProfileOpen = false" class="fixed inset-0 z-30"></div>
    }
    `,
  styles: []
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  isProfileOpen = false;
  currentUser = this.authService.currentUser;
  
  userInitials = computed(() => {
    const user = this.currentUser();
    if (!user) return '??';
    const name = user.displayName || user.email || 'Admin';
    return name.substring(0, 2).toUpperCase();
  });

  async logout(): Promise<void> {
    try {
      await this.authService.logout();
      this.isProfileOpen = false;
      this.router.navigate(['/auth/login']);
    } catch (error) {
      console.error('Erreur déconnexion:', error);
    }
  }
}
