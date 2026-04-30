import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Auth } from '../../../services/auth';
import { ChangeDetectorRef } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayout implements OnInit {
  public pendingMessagesCount: number = 0;
  public adminName: string | null = '';

  constructor(
    private auth: Auth, 
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadPendingCount();
    this.adminName = localStorage.getItem('username') || 'Admin';

    // check every one minitus new messeges
    setInterval(() => this.loadPendingCount(), 60000);
  }

  loadPendingCount() {
    this.http.get<number>('http://localhost:8080/message/pending-count').subscribe({
      next: (count) => {
        this.pendingMessagesCount = count;
        this.cdr.detectChanges();
      },
      error: (err) => console.error("Could not load message count", err)
    });
  }

  onLogout() {
    Swal.fire({
      title: 'Are you sure?',
      text: "You will be logged out from the admin panel!",
      icon: 'warning',
      showCancelButton: true,
      background: '#141414',
      color: '#fff',
      confirmButtonColor: '#22c55e',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, Logout!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.auth.logout(); 
        this.router.navigate(['/login']); 
      }
    });
  }
}