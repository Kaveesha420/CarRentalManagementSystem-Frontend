import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleItem } from './vehicle-item';

describe('VehicleItem', () => {
  let component: VehicleItem;
  let fixture: ComponentFixture<VehicleItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleItem],
    }).compileComponents();

    fixture = TestBed.createComponent(VehicleItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
