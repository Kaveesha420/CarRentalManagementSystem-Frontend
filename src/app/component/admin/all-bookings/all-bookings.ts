import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-all-bookings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './all-bookings.html',
  styleUrl: './all-bookings.css'
})
export class AllBookings implements OnInit {
  public bookingList: any[] = [];
  public availableDrivers: any[] = []; 
  public currentPage: number = 0;
  public totalPages: number = 0;
  public pagesArray: number[] = [];

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.getAllBookings(0);
    this.loadAvailableDrivers(); 
  }

  public loadAvailableDrivers() {
    this.http.get<any[]>('http://localhost:8080/driver/get-available').subscribe({
      next: (data) => {
        this.availableDrivers = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error("Error fetching available drivers:", err)
    });
  }

  public getAllBookings(page: number) {
    this.currentPage = page;
    this.http.get<any>(`http://localhost:8080/booking/getAll?page=${page}&size=10`).subscribe({
      next: (data) => {
        this.bookingList = data.content || [];
        this.totalPages = data.totalPages || 0;
        this.pagesArray = Array.from({ length: this.totalPages }, (_, i) => i);
        this.cdr.detectChanges();
      },
      error: (err) => console.error("Error fetching bookings:", err)
    });
  }

  public onDriverAssign(bookingId: string, event: any) {
    const driverId = event.target.value;
    if (driverId) {
      this.http.put(`http://localhost:8080/booking/assignDriver/${bookingId}/${driverId}`, {}).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Assigned!',
            text: 'Driver Assigned and Booking Confirmed Successfully!',
            background: '#141414',
            color: '#fff',
            timer: 2000,
            showConfirmButton: false
          });
          this.getAllBookings(this.currentPage);
          this.loadAvailableDrivers();
        },
        error: (err) => Swal.fire({ icon: 'error', title: 'Error', text: 'Driver assignment failed!', background: '#141414', color: '#fff' })
      });
    }
  }

  public updateStatus(id: string, status: string) {
    this.http.put(`http://localhost:8080/booking/updateStatus/${id}/${status}`, {}).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Status Updated',
          text: `Booking ${status} Successfully!`,
          background: '#141414',
          color: '#fff',
          timer: 1500,
          showConfirmButton: false
        });
        this.getAllBookings(this.currentPage);
      },
      error: (err) => Swal.fire({ icon: 'error', title: 'Failed', text: 'Failed to update status', background: '#141414', color: '#fff' })
    });
  }
}