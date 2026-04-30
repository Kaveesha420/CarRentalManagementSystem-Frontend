import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-cars',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './manage-cars.html',
  styleUrl: './manage-cars.css'
})
export class ManageCars implements OnInit {
  carForm: FormGroup;
  vehicleList: any[] = [];
  selectedFile: File | null = null;
  isEditMode = false;
  selectedId: string | null = null;

  currentPage = 0;
  totalPages = 0;
  pagesArray: number[] = [];

  constructor(private fb: FormBuilder, private http: HttpClient, private cdr: ChangeDetectorRef) {
    this.carForm = this.fb.group({
      brand: ['', Validators.required],
      model: ['', Validators.required],
      fuelType: ['Petrol', Validators.required],
      seatingCapacity: [5, [Validators.required, Validators.min(1)]],
      pricePerDay: ['', [Validators.required, Validators.min(1000)]],
      status: ['AVAILABLE', Validators.required]
    });
  }

  ngOnInit() {
    this.getVehicles(0);
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  public getVehicles(page: number) {
    this.currentPage = page;
    this.http.get<any>(`http://localhost:8080/car/getAll?page=${page}&size=10`).subscribe({
      next: (data) => {
        this.vehicleList = data.content || [];
        this.totalPages = data.totalPages || 0;
        this.pagesArray = Array.from({ length: this.totalPages }, (_, i) => i);
        this.cdr.detectChanges();
      },
      error: (err) => console.error("Error fetching vehicles:", err)
    });
  }

  editVehicle(car: any) {
    this.isEditMode = true;
    this.selectedId = car.id;
    this.selectedFile = null;

    this.carForm.patchValue({
      brand: car.brand,
      model: car.model,
      fuelType: car.fuelType,
      seatingCapacity: car.seatingCapacity,
      pricePerDay: car.pricePerDay,
      status: car.status
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }


onSubmit() {
    if (this.carForm.invalid) {
      Swal.fire({ icon: 'warning', title: 'Wait!', text: 'Please fill all required fields correctly.', background: '#141414', color: '#fff' });
      return;
    }

  const carData = {
    ...this.carForm.value,
    pricePerDay: Number(this.carForm.value.pricePerDay),
    seatingCapacity: Number(this.carForm.value.seatingCapacity)
  };

  const formData = new FormData();
  formData.append('car', new Blob([JSON.stringify(carData)], { type: 'application/json' }));

  if (this.selectedFile) {
    formData.append('file', this.selectedFile);
  }

  const url = this.isEditMode 
    ? `http://localhost:8080/car/update/${this.selectedId}` 
    : `http://localhost:8080/car/add`;

  const request = this.isEditMode 
    ? this.http.put(url, formData) 
    : this.http.post(url, formData);

  request.subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: this.isEditMode ? 'Vehicle Updated!' : 'Vehicle Added Successfully!',
          background: '#141414',
          color: '#fff',
          timer: 2000,
          showConfirmButton: false
        });
        this.reset();
        this.getVehicles(0);
      },
      error: () => Swal.fire({ icon: 'error', title: 'Oops', text: 'Failed to save vehicle.', background: '#141414', color: '#fff' })
    });
  }

  public deleteVehicle(id: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      background: '#141414',
      color: '#fff',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`http://localhost:8080/car/delete/${id}`, { responseType: 'text' }).subscribe({
          next: (res) => {
            Swal.fire({ title: 'Deleted!', text: res, icon: 'success', background: '#141414', color: '#fff' });
            this.getVehicles(this.currentPage);
          },
          error: () => Swal.fire({ icon: 'error', title: 'Error', text: 'Could not delete vehicle.', background: '#141414', color: '#fff' })
        });
      }
    });
  }

  reset() {
    this.isEditMode = false;
    this.selectedId = null;
    this.selectedFile = null;
    this.carForm.reset({ fuelType: 'Petrol', seatingCapacity: 5, status: 'AVAILABLE' });
  }
}