import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadSapDataComponent } from './upload-sap-data.component';

describe('UploadSapDataComponent', () => {
  let component: UploadSapDataComponent;
  let fixture: ComponentFixture<UploadSapDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadSapDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadSapDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
