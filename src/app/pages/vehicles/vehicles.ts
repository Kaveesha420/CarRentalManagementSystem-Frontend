import { ChangeDetectorRef, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { VehicleItem } from "../vehicle-item/vehicle-item";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [RouterLink, VehicleItem, CommonModule],
  templateUrl: './vehicles.html',
  styleUrl: './vehicles.css',
})
export class Vehicles {
  public vehicleList: any[] = [];
  public totalPages: number = 0;
  public currentPage: number = 0; // මුලින්ම 0 වෙනි පිටුව (Page 1)
  public pagesArray: number[] = [];

  constructor(public cdr: ChangeDetectorRef) {
    this.getVehicle(this.currentPage);
  }

  // Page එක අනුව දත්ත ගේන Method එක
  public getVehicle(page: number) {
    this.currentPage = page;
    
    // Backend API එකට page සහ size (දත්ත ගණන) පාස් කරනවා
    fetch(`http://localhost:8080/car/getAll?page=${page}&size=10`)
      .then(res => res.json())
      .then(data => {
        // Spring Page object එකේ දත්ත තියෙන්නේ 'content' ඇතුළේ
        this.vehicleList = data.content; 
        this.totalPages = data.totalPages;
        
        // Pagination buttons හැදීමට array එකක් සාදා ගැනීම
        this.pagesArray = Array.from({ length: this.totalPages }, (_, i) => i);
        
        this.cdr.detectChanges();
      });
  }
}