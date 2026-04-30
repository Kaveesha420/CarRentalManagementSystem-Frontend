import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDrivers } from './manage-drivers';

describe('ManageDrivers', () => {
  let component: ManageDrivers;
  let fixture: ComponentFixture<ManageDrivers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageDrivers],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageDrivers);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
