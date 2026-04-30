import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Auth } from '../../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact-us.html',
  styleUrl: './contact-us.css',
})
export class ContactUs implements OnInit {
  contactForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public auth: Auth 
  ) {
    this.contactForm = this.fb.group({
      customerName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.auth.isLoggedIn()) {
      this.contactForm.patchValue({
        customerName: localStorage.getItem('username'),
        email: localStorage.getItem('email')
      });
    }
  }

  onSendMessage() {
    if (this.contactForm.invalid) return;

    const messageData = {
      ...this.contactForm.value,
      customerId: this.auth.getUserId(), 
      status: 'PENDING',
      timestamp: new Date()
    };

    this.http.post('http://localhost:8080/message/send', messageData).subscribe({
      next: () => {
        alert("Message Sent Successfully!");
        this.contactForm.get('message')?.reset();
      },
      error: () => alert("Failed to send message. Please try again.")
    });
  }
}