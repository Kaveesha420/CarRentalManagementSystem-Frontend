import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class Auth {

  private baseUrl = 'http://localhost:8080';

  private isLoggedInSubject = new BehaviorSubject<boolean>(this.checkTokenValidity());
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private currentUserSubject = new BehaviorSubject<string | null>(this.getUserNameFromToken());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) { }

  // Checking whether the token exists and has not expired
  private checkTokenValidity(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const decoded: any = jwtDecode(token);
      const isExpired = decoded.exp * 1000 < Date.now();

      if (isExpired) {
        this.logout(); // If time is over Logout 
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }

  private getUserNameFromToken(): string | null {
    const token = localStorage.getItem('token');
    if (!token || !this.checkTokenValidity()) return null;
    try {
      const decoded: any = jwtDecode(token);
      return decoded.sub || decoded.username;
    } catch { return null; }
  }

  
  public isLoggedIn(): boolean {
    return this.checkTokenValidity();
  }

  login(loginData: any): Observable<string> {
    return this.http.post(`${this.baseUrl}/auth/login`, loginData, { responseType: 'text' }).pipe(
      tap(token => {
        localStorage.setItem('token', token);
        const decoded: any = jwtDecode(token);
        localStorage.setItem('role', decoded.role);
        localStorage.setItem('username', decoded.sub || decoded.username);
        localStorage.setItem('userId', decoded.id || '');

        this.isLoggedInSubject.next(true);
        this.currentUserSubject.next(decoded.sub || decoded.username);
      })
    );
  }

  logout() {
    localStorage.clear();
    this.isLoggedInSubject.next(false);
    this.currentUserSubject.next(null);
  }

  getRole() { return localStorage.getItem('role'); }

  publicRegister(userData: any): Observable<any> {
    const data = { ...userData, role: 'CUSTOMER' };
    return this.http.post(`${this.baseUrl}/user/add`, data);
  }

  public getUserId(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const decoded: any = jwtDecode(token);
      return decoded.id || decoded.sub;
    } catch {
      return null;
    }
  }
}