import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewpageComponent } from './viewpage.component';

describe('ViewpageComponent', () => {
  let component: ViewpageComponent;
  let fixture: ComponentFixture<ViewpageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewpageComponent]
    });
    fixture = TestBed.createComponent(ViewpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
