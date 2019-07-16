import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LegseditComponent } from './legsedit.component';

describe('LegseditComponent', () => {
  let component: LegseditComponent;
  let fixture: ComponentFixture<LegseditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LegseditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LegseditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
