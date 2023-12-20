import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AadharpageComponent } from './aadharpage.component';

describe('AadharpageComponent', () => {
  let component: AadharpageComponent;
  let fixture: ComponentFixture<AadharpageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AadharpageComponent]
    });
    fixture = TestBed.createComponent(AadharpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
