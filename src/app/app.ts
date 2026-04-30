import { Component, signal } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router'; // Router සහ NavigationEnd එකතු කළා
import { filter } from 'rxjs'; 
import { CommonModule } from '@angular/common'; 

import { NavBar } from './component/nav-bar/nav-bar';
import { Footer } from './component/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavBar, Footer, CommonModule], 
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('CarRentalManagement');
  isAdminPage = false;

  constructor(private router: Router) {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.isAdminPage = event.url.includes('/admin');
    });
  }
}