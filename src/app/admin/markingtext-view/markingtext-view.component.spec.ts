import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkingtextViewComponent } from './markingtext-view.component';

describe('MarkingtextViewComponent', () => {
  let component: MarkingtextViewComponent;
  let fixture: ComponentFixture<MarkingtextViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarkingtextViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkingtextViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
