import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LandingpageComponent } from './landingpage.component';

describe('LandingpageComponent', () => {
  let component: LandingpageComponent;
  let fixture: ComponentFixture<LandingpageComponent>;
  let navigateSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LandingpageComponent],
      imports: [RouterTestingModule.withRoutes([])] // Import RouterTestingModule with empty routes
    });
    fixture = TestBed.createComponent(LandingpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    navigateSpy = spyOn(component.router, 'navigateByUrl').and.stub();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to signup page', () => {
    component.navigate();
    expect(navigateSpy).toHaveBeenCalledWith('signup');
  });

  it('should navigate to contactus page', () => {
    component.navigate1();
    expect(navigateSpy).toHaveBeenCalledWith('contactus');
  });

  it('should navigate to users page', () => {
    component.navigate2();
    expect(navigateSpy).toHaveBeenCalledWith('users');
  });
});
