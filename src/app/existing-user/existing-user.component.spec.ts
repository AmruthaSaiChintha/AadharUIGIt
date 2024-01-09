import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExistingUserComponent } from './existing-user.component';

describe('ExistingUserComponent', () => {
  let component: ExistingUserComponent;
  let fixture: ComponentFixture<ExistingUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExistingUserComponent]
    });
    fixture = TestBed.createComponent(ExistingUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
