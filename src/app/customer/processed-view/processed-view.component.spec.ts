import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessedViewComponent } from './processed-view.component';

describe('ProcessedViewComponent', () => {
  let component: ProcessedViewComponent;
  let fixture: ComponentFixture<ProcessedViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessedViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessedViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
