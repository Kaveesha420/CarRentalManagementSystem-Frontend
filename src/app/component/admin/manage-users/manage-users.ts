import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './manage-users.html'
})
export class ManageUsers implements OnInit {
  adminForm: FormGroup;
  usersList: any[] = [];
  isEditMode: boolean = false; 
  selectedUserId: string | null = null;

  currentPage: number = 0;
  totalPages: number = 0;
  pagesArray: number[] = [];

  constructor(private fb: FormBuilder, private http: HttpClient, private cdr: ChangeDetectorRef) {
    this.adminForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['ADMIN']
    });
  }

  ngOnInit() {
    
    this.loadAllUsers(0);
  }

  loadAllUsers(page: number = 0) {
    this.currentPage = page;
    this.http.get<any>(`http://localhost:8080/user/getAll?page=${page}&size=5`).subscribe({
      next: (data) => {
        this.usersList = data.content || [];
        this.totalPages = data.totalPages || 0;
        this.pagesArray = Array.from({ length: this.totalPages }, (_, i) => i);
        this.cdr.detectChanges();
      },
      error: (err) => console.error("Error loading users", err)
    });
  }

  onHandleSubmit() {
    if (this.adminForm.valid) {
      if (this.isEditMode) {
        this.updateUser(); 
      } else {
        this.onAddAdmin();
      }
    } else {
      alert("Please fill all required fields correctly.");
    }
  }

  onAddAdmin() {
    this.http.post('http://localhost:8080/user/add', this.adminForm.value).subscribe({
      next: () => {
        Swal.fire({ icon: 'success', title: 'Added!', text: 'Admin Added Successfully!', background: '#141414', color: '#fff', timer: 1500, showConfirmButton: false });
        this.resetForm();
        this.loadAllUsers(0);
      },
      error: () => Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to add Admin!', background: '#141414', color: '#fff' })
    });
  }

  editUser(user: any) {
    this.isEditMode = true;
    this.selectedUserId = user.id;
    this.adminForm.patchValue({
      username: user.username,
      email: user.email,
      role: user.role
    });
   
    this.adminForm.get('password')?.clearValidators();
    this.adminForm.get('password')?.updateValueAndValidity();
  }

  updateUser() {
  this.http.put(`http://localhost:8080/user/update/${this.selectedUserId}`, this.adminForm.value).subscribe({
    next: () => {
      Swal.fire({
        icon: 'success',
        title: 'User Updated!',
        text: 'The user profile has been updated successfully.',
        background: '#141414',
        color: '#fff',
        confirmButtonColor: '#22c55e',
        showConfirmButton: false,
        timer: 1500 
      });
      
      this.resetForm(); 
      this.loadAllUsers(this.currentPage);
    },
    error: (err) => {
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'Something went wrong while updating the user.',
        background: '#141414',
        color: '#fff',
        confirmButtonColor: '#ef4444'
      });
      console.error("Update error:", err);
    }
  });
}

  deleteUser(id: string) {
    Swal.fire({
      title: 'Delete User?',
      text: "This action cannot be undone!",
      icon: 'warning',
      showCancelButton: true,
      background: '#141414',
      color: '#fff',
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Yes, delete!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`http://localhost:8080/user/delete/${id}`, { responseType: 'text' }).subscribe({
          next: () => {
            Swal.fire({ icon: 'success', title: 'Deleted!', text: 'User Deleted Successfully!', background: '#141414', color: '#fff' });
            this.loadAllUsers(this.currentPage);
          },
          error: () => Swal.fire({ icon: 'error', title: 'Error', text: 'Delete failed', background: '#141414', color: '#fff' })
        });
      }
    });
  }

  resetForm() {
    this.isEditMode = false;
    this.selectedUserId = null;
    this.adminForm.reset({ role: 'ADMIN' });
    
    this.adminForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.adminForm.get('password')?.updateValueAndValidity();
  }
}