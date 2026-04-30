import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit {
  public stats = {
    totalCars: 0,
    totalDrivers: 0,
    totalBookings: 0,
    totalCustomers: 0,
    totalRevenue: 0
  };

  public recentActivity: any[] = [];

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadStats();
    this.loadRecentActivity();
  }

  private loadStats() {
  const baseUrl = 'http://localhost:8080';
 
  this.http.get<any>(`${baseUrl}/car/getAll`).subscribe(data => {
    this.stats.totalCars = data.totalElements || 0;
  });

  this.http.get<any[]>(`${baseUrl}/driver/getAll`).subscribe(data => {
    this.stats.totalDrivers = data.length || 0;
  });

  this.http.get<any>(`${baseUrl}/booking/getAll`).subscribe(data => {
    this.stats.totalBookings = data.totalElements || 0;
    
    const bookings = data.content || [];
    
    this.stats.totalRevenue = bookings
      .filter((b: any) => b.bookingStatus !== 'CANCELLED') 
      .reduce((sum: number, b: any) => sum + (b.totalPrice || 0), 0);
    
    this.cdr.detectChanges();
  });

  this.http.get<any[]>(`${baseUrl}/customer/getAll`).subscribe(data => {
    this.stats.totalCustomers = data.length || 0;
    this.cdr.detectChanges();
  });
}

  public loadRecentActivity() {
    // AuditLogs
    this.http.get<any[]>('http://localhost:8080/audit/recent').subscribe({
      next: (data) => {
        this.recentActivity = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error("Audit Logs load failed. check Backend Controller.", err)
    });
  }
}