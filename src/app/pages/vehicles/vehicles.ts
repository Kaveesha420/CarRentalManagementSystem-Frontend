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
  public currentPage: number = 0; 
  public pagesArray: number[] = [];

  constructor(public cdr: ChangeDetectorRef) {
    this.getVehicle(this.currentPage);
  }

  
  public getVehicle(page: number) {
    this.currentPage = page;
    
    fetch(`http://localhost:8080/car/getAll?page=${page}&size=9`)
      .then(res => res.json())
      .then(data => {
        this.vehicleList = data.content; 
        this.totalPages = data.totalPages;
        
        this.pagesArray = Array.from({ length: this.totalPages }, (_, i) => i);
        
        this.cdr.detectChanges();
      });
  }
}