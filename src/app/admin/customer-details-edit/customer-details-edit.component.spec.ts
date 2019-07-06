import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerDetailsEditComponent } from './customer-details-edit.component';

describe('CustomerDetailsEditComponent', () => {
  let component: CustomerDetailsEditComponent;
  let fixture: ComponentFixture<CustomerDetailsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerDetailsEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerDetailsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
