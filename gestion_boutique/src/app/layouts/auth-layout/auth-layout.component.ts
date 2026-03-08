import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-[#fafafa] flex flex-col justify-center">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class AuthLayoutComponent {}
