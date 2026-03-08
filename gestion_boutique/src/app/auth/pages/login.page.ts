import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/firebase/auth.service';
import { LoadingSpinnerComponent } from '../../shared/components/ui/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, LoadingSpinnerComponent],
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss'
})
export class LoginPageComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    try {
      await this.authService.login(
        this.loginForm.value.email,
        this.loginForm.value.password
      );
      this.router.navigate(['/dashboard']);
    } catch (error: any) {
      this.errorMessage = error.message || 'Identifiants invalides';
    } finally {
      this.isLoading = false;
    }
  }
}
