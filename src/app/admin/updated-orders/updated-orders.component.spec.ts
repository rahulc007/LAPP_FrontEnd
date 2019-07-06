import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatedOrdersComponent } from './updated-orders.component';

describe('UpdatedOrdersComponent', () => {
  let component: UpdatedOrdersComponent;
  let fixture: ComponentFixture<UpdatedOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdatedOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatedOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
