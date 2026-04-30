import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-messages',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-messages.html'
})
export class AdminMessages implements OnInit {
  messageList: any[] = [];
  constructor(private http: HttpClient) {}
  ngOnInit() { this.loadMessages(); }

  loadMessages() {
    this.http.get<any[]>('http://localhost:8080/message/getAll').subscribe(data => this.messageList = data);
  }

  sendReply(id: string, reply: string) {
    this.http.put(`http://localhost:8080/message/reply/${id}`, { reply }).subscribe(() => {
      alert("Reply Sent!");
      this.loadMessages();
    });
  }
}