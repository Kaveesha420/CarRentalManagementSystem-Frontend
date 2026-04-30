import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './manage-users.html',
  styleUrl: './manage-users.css'
})
export class ManageUsers implements OnInit {
  adminForm: FormGroup;
  usersList: any[] = [];
  isEditMode: boolean = false; // Update එකක්ද කියලා දැනගන්න
  selectedUserId: string | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    // Form එක හදන කොටස
    this.adminForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['ADMIN'] // Default role එක ADMIN විදිහට යනවා
    });
  }

  ngOnInit() {
    this.loadAllUsers();
  }

  // 1. සියලුම Users ලාව Load කිරීම
  loadAllUsers() {
    this.http.get<any[]>('http://localhost:8080/user/getAll').subscribe({
      next: (data) => this.usersList = data,
      error: (err) => console.error("Error loading users", err)
    });
  }

  // 2. Add හෝ Update කිරීම පාලනය කරන ප්‍රධාන Method එක
  onHandleSubmit() {
    if (this.adminForm.valid) {
      if (this.isEditMode) {
        this.updateUser(); // Edit Mode නම් Update කරනවා
      } else {
        this.addNewAdmin(); // නැත්නම් අලුතින් Add කරනවා
      }
    }
  }

  // 3. අලුත් Admin කෙනෙක් එකතු කිරීම
  addNewAdmin() {
    this.http.post('http://localhost:8080/user/add', this.adminForm.value).subscribe({
      next: () => {
        alert('Admin Added Successfully!');
        this.resetForm();
        this.loadAllUsers();
      },
      error: () => alert('Failed to add Admin!')
    });
  }

  // 4. User කෙනෙක්ව Edit කිරීමට තෝරා ගැනීම
  editUser(user: any) {
    this.isEditMode = true;
    this.selectedUserId = user.id;
    // Form එකට පරණ දත්ත ටික පිරවීම
    this.adminForm.patchValue({
      username: user.username,
      email: user.email,
      role: user.role
    });
    // Update කරද්දී password එක අනිවාර්යය නැති කරන්න පුළුවන් (Backend එක අනුව)
    this.adminForm.get('password')?.clearValidators();
    this.adminForm.get('password')?.updateValueAndValidity();
  }

  // 5. දත්ත Update කිරීම
  updateUser() {
    this.http.put(`http://localhost:8080/user/update/${this.selectedUserId}`, this.adminForm.value).subscribe({
      next: () => {
        alert('User Updated Successfully!');
        this.resetForm();
        this.loadAllUsers();
      },
      error: () => alert('Update Failed!')
    });
  }

  // 6. User කෙනෙක්ව මකා දැමීම
  deleteUser(id: string) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.http.delete(`http://localhost:8080/user/delete/${id}`, { responseType: 'text' }).subscribe({
        next: () => {
          alert('User Deleted Successfully!');
          this.loadAllUsers();
        },
        error: (err) => alert('Delete failed!')
      });
    }
  }

  // Form එක මුල සිට සැකසීම
  resetForm() {
    this.isEditMode = false;
    this.selectedUserId = null;
    this.adminForm.reset({ role: 'ADMIN' });
    this.adminForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.adminForm.get('password')?.updateValueAndValidity();
  }
}