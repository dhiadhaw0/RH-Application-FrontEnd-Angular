import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, SignupRequest } from '../../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  signupData: SignupRequest & { confirmPassword: string } = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  };
  acceptTerms = false;
  loading = false;
  error: string | null = null;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  onSubmit() {
    this.error = null;

    if (this.signupData.password !== this.signupData.confirmPassword) {
      this.error = 'Les mots de passe ne correspondent pas';
      return;
    }

    if (!this.acceptTerms) {
      this.error = 'Veuillez accepter les conditions d\'utilisation';
      return;
    }

    if (this.signupData.firstName && this.signupData.lastName && this.signupData.email && this.signupData.password) {
      this.loading = true;

      const { confirmPassword, ...signupRequest } = this.signupData;

      this.authService.signup(signupRequest).subscribe({
        next: (response) => {
          this.loading = false;
          console.log('Signup successful:', response.user);
          // Redirect to dashboard or home
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.loading = false;
          this.error = error.error?.message || 'Erreur lors de l\'inscription. Veuillez réessayer.';
          console.error('Signup error:', error);
        }
      });
    }
  }

  switchToLogin() {
    this.router.navigate(['/login']);
  }
}
