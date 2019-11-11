import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkingtextexceluploadComponent } from './markingtextexcelupload.component';

describe('MarkingtextexceluploadComponent', () => {
  let component: MarkingtextexceluploadComponent;
  let fixture: ComponentFixture<MarkingtextexceluploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarkingtextexceluploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkingtextexceluploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
