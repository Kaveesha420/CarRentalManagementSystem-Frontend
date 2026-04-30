import { Component, Input } from '@angular/core'; // Input import කරන්න
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vehicle-item',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './vehicle-item.html',
  styleUrl: './vehicle-item.css',
})
export class VehicleItem { 
  @Input() vehicle: any; 
}