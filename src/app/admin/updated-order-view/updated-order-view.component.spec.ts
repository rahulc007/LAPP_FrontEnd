import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatedOrderViewComponent } from './updated-order-view.component';

describe('UpdatedOrderViewComponent', () => {
  let component: UpdatedOrderViewComponent;
  let fixture: ComponentFixture<UpdatedOrderViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdatedOrderViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatedOrderViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
