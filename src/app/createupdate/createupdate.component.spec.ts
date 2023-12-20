import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateupdateComponent } from './createupdate.component';

describe('CreateupdateComponent', () => {
  let component: CreateupdateComponent;
  let fixture: ComponentFixture<CreateupdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateupdateComponent]
    });
    fixture = TestBed.createComponent(CreateupdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
