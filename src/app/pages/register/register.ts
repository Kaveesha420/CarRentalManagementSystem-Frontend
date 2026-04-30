import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Auth } from '../../services/auth';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  
  userData = { 
    username: '', 
    email: '', 
    password: '',
    name: '',      
    address: '', 
    contactNo: '',
    nic: ''      
  };
  
  showPassword = false;

  constructor(private auth: Auth, private router: Router) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onRegister() {
    this.auth.publicRegister(this.userData).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Registration Complete!',
          text: 'Account & Customer Profile Created Successfully.',
          background: '#141414',
          color: '#fff',
          confirmButtonColor: '#22c55e'
        });
        this.router.navigate(['/login']);
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: 'Please check your details and try again.',
          background: '#141414',
          color: '#fff',
          confirmButtonColor: '#ef4444'
        });
      }
    });
  }
}