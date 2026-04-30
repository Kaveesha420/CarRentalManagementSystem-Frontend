import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Auth } from '../../services/auth';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html'
})
export class Login {
  loginData = { username: '', password: '' };
  showPassword = false;

  constructor(private auth: Auth, private router: Router) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onLogin() {
    this.auth.login(this.loginData).subscribe({
      next: (token: string) => {
        Swal.fire({
          icon: 'success',
          title: 'Welcome Back!',
          text: 'Login Successful!',
          background: '#141414',
          color: '#fff',
          showConfirmButton: false,
          timer: 1500
        });
        const role = this.auth.getRole();
        if (role === 'ADMIN' || role === 'ROLE_ADMIN'){
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/home']);
        }
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: 'Invalid Username or Password!',
          background: '#141414',
          color: '#fff',
          confirmButtonColor: '#22c55e'
        });
      }
    });
  }
}