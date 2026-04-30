import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-manage-drivers',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './manage-drivers.html',
  styleUrl: './manage-drivers.css'
})
export class ManageDrivers implements OnInit {
  driverForm: FormGroup;
  driverList: any[] = [];
  isEditMode: boolean = false;
  selectedDriverId: string | null = null;

  constructor(
    private fb: FormBuilder, 
    private http: HttpClient, 
    private cdr: ChangeDetectorRef
  ) {
  this.driverForm = this.fb.group({
    name: ['', Validators.required],
    contactNo: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]], 
    licenseNo: ['', Validators.required], 
    status: ['AVAILABLE', Validators.required]
  });
}

  ngOnInit() {
    this.getDrivers();
  }

  public getDrivers() {
    this.http.get<any[]>('http://localhost:8080/driver/getAll').subscribe({
      next: (data) => {
        this.driverList = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error("Error fetching drivers:", err)
    });
  }

  onHandleSubmit() {
    if (this.driverForm.valid) {
      if (this.isEditMode) {
        this.updateDriver();
      } else {
        this.addDriver();
      }
    }
  }

  addDriver() {
    this.http.post('http://localhost:8080/driver/add', this.driverForm.value).subscribe({
      next: () => {
        alert('Driver Added Successfully!');
        this.resetForm();
        this.getDrivers();
      },
      error: () => alert('Failed to add driver!')
    });
  }

  editDriver(driver: any) {
  this.isEditMode = true;
  this.selectedDriverId = driver.id;
  this.driverForm.patchValue({
    name: driver.name,
    contactNo: driver.contactNo, 
    licenseNo: driver.licenseNo,
    status: driver.status
  });
}

  updateDriver() {
    this.http.put(`http://localhost:8080/driver/update/${this.selectedDriverId}`, this.driverForm.value).subscribe({
      next: () => {
        alert('Driver Updated Successfully!');
        this.resetForm();
        this.getDrivers();
      },
      error: () => alert('Update failed!')
    });
  }

  
  public deleteDriver(id: string) {
    if (confirm('Are you sure you want to remove this driver?')) {
      this.http.delete(`http://localhost:8080/driver/delete/${id}`, { responseType: 'text' }).subscribe({
        next: () => {
          alert('Driver Removed Successfully!');
          this.getDrivers();
        },
        error: () => alert('Delete failed!')
      });
    }
  }

  resetForm() {
    this.isEditMode = false;
    this.selectedDriverId = null;
    this.driverForm.reset({ status: 'AVAILABLE' });
  }
}