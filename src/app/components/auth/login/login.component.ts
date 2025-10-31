import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, LoginRequest } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginData: LoginRequest = {
    email: '',
    password: ''
  };
  rememberMe = false;
  loading = false;
  error: string | null = null;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  onSubmit() {
    if (this.loginData.email && this.loginData.password) {
      this.loading = true;
      this.error = null;

      this.authService.login(this.loginData).subscribe({
        next: (response) => {
          this.loading = false;
          console.log('Login successful:', response.user);
          // Redirect to dashboard or home
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.loading = false;
          this.error = error.error?.message || 'Erreur de connexion. Vérifiez vos identifiants.';
          console.error('Login error:', error);
        }
      });
    }
  }

  switchToSignup() {
    this.router.navigate(['/register']);
  }
}
