import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewOrdersViewComponent } from './new-orders-view.component';

describe('NewOrdersViewComponent', () => {
  let component: NewOrdersViewComponent;
  let fixture: ComponentFixture<NewOrdersViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewOrdersViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewOrdersViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
