import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewpageidComponent } from './viewpageid.component';

describe('ViewpageidComponent', () => {
  let component: ViewpageidComponent;
  let fixture: ComponentFixture<ViewpageidComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewpageidComponent]
    });
    fixture = TestBed.createComponent(ViewpageidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
