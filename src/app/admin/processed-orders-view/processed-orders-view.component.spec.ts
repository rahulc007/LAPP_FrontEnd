import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessedOrdersViewComponent } from './processed-orders-view.component';

describe('ProcessedOrdersViewComponent', () => {
  let component: ProcessedOrdersViewComponent;
  let fixture: ComponentFixture<ProcessedOrdersViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessedOrdersViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessedOrdersViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
