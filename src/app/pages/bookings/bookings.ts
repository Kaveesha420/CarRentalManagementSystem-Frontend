import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Auth } from '../../services/auth';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './bookings.html',
  styleUrl: './bookings.css',
})
export class Bookings implements OnInit {
  bookingForm: FormGroup;
  vehicle: any = null;
  totalDays: number = 0;
  totalAmount: number = 0;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private fb: FormBuilder,
    public auth: Auth,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.bookingForm = this.fb.group({
      pickupDate: ['', Validators.required],
      returnDate: ['', Validators.required],
      withDriver: [false]
    });
  }

  ngOnInit() {
    const carId = this.route.snapshot.paramMap.get('id');
    if (carId) {
      this.http.get(`http://localhost:8080/car/getById/${carId}`).subscribe(data => {
        this.vehicle = data;
        this.cdr.detectChanges();
      });
    }

    this.bookingForm.valueChanges.subscribe(() => this.calculatePrice());
  }

  calculatePrice() {
    const { pickupDate, returnDate, withDriver } = this.bookingForm.value;
    if (pickupDate && returnDate && this.vehicle) {
      const start = new Date(pickupDate);
      const end = new Date(returnDate);
      
      if (end > start) {
        const diff = Math.abs(end.getTime() - start.getTime());
        this.totalDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
        
        let price = this.totalDays * this.vehicle.pricePerDay;
        if (withDriver) price += (this.totalDays * 3000);
        
        this.totalAmount = price;
      } else {
        this.totalDays = 0;
        this.totalAmount = 0;
      }
      this.cdr.detectChanges();
    }
  }

 
confirmBooking() {
  const uId = localStorage.getItem('userId');

  if (!uId) {
    Swal.fire({
      icon: 'error',
      title: 'Session Expired',
      text: 'Please login again to continue.',
      background: '#141414',
      color: '#fff',
      confirmButtonColor: '#22c55e' 
    });
    this.router.navigate(['/login']);
    return;
  }

  
  const payload = {
    pickupDate: this.bookingForm.value.pickupDate,
    returnDate: this.bookingForm.value.returnDate,
    withDriver: this.bookingForm.value.withDriver || false,
    carId: this.vehicle.id,
    userId: uId, 
    totalPrice: this.totalAmount
  };

  this.http.post('http://localhost:8080/booking/add', payload).subscribe({
    next: () => {
     
      Swal.fire({
        title: 'Booking Placed!',
        text: 'Your car reservation was successful.',
        icon: 'success',
        background: '#141414',
        color: '#fff',
        confirmButtonColor: '#22c55e',
        showConfirmButton: false,
        timer: 2000 
      });
      this.router.navigate(['/home']);
    },
    error: (err) => {
      
      Swal.fire({
        icon: 'error',
        title: 'Booking Failed',
        text: err.error?.message || 'Something went wrong!',
        background: '#141414',
        color: '#fff',
        confirmButtonColor: '#ef4444' 
      });
    }
  });
}
}