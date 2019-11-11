import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkingtexteditComponent } from './markingtextedit.component';

describe('MarkingtexteditComponent', () => {
  let component: MarkingtexteditComponent;
  let fixture: ComponentFixture<MarkingtexteditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarkingtexteditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkingtexteditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
