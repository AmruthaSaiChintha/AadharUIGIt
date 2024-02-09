import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { SignupComponent } from './signup.component';
import { FormControl, FormGroup } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing'; 
import { UserService } from '../user.service';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router'; 

class MockUserService {
  checkEmailExists(email: string) {
    return of({ exists: false });
  }

  user(data: any) {
    return of('success');
  }
}

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let router:Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SignupComponent],
      imports: [HttpClientModule, RouterTestingModule],
      providers: [
        { provide: UserService, useClass: MockUserService },Router 
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should initialize the form correctly', () => {
    expect(component.signupFormModel).toBeDefined();
    expect(component.signupFormModel instanceof FormGroup).toBeTruthy();
  });
  it('should validate email field', () => {
    const emailControl = component.signupFormModel.get('email');
    expect(emailControl?.valid).toBeFalsy();

    emailControl?.setValue('invalidemail');
    expect(emailControl?.hasError('email')).toBeTruthy();
  });
  it('should validate username field', () => {
    const usernameControl = component.signupFormModel.get('username');
    expect(usernameControl?.valid).toBeFalsy();

    usernameControl?.setValue('u$ername'); // Invalid username
    expect(usernameControl?.hasError('pattern')).toBeTruthy();
  });
  it('should validate password field', () => {
    const passwordControl = component.signupFormModel.get('password');
    expect(passwordControl?.valid).toBeFalsy();

    passwordControl?.setValue('password'); 
    expect(passwordControl?.hasError('pattern')).toBeTruthy();
  });
  it('should return null for a valid email', () => {
    const control = new FormControl('test@example.com');
    const result = component.comEmailValidator(control);
    expect(result).toBeNull();
  });
  it('should return invalidEmail for an invalid email', () => {
    const control = new FormControl('invalidemail');
    const result = component.comEmailValidator(control);
    expect(result).toEqual({ 'invalidEmail': true });
  });
  it('should navigate to login page on successful signup', () => {
    spyOn(component.router, 'navigate').and.stub();
    component.signupFormModel.setValue({
      email: 'test@example.com',
      username: 'testuser',
      password: 'Test@1234',
      userType: 'user'
    });
    component.signup();

    expect(component.router.navigate).toHaveBeenCalledWith(['login']);
  });
  it('should not navigate if form is invalid', () => {
    spyOn(component.router, 'navigate').and.stub();
    component.signup();
    expect(component.router.navigate).not.toHaveBeenCalled();
  });
  it('should not navigate if email already exists', () => {
    spyOn(component.people, 'checkEmailExists').and.returnValue(of({ exists: true,message:"yes email already exists" }));
    spyOn(component.router, 'navigate').and.stub();
    component.signupFormModel.setValue({
      email: 'test@example.com',
      username: 'testuser',
      password: 'Test@1234',
      userType: 'user'
    });
    component.signup();

    expect(component.router.navigate).not.toHaveBeenCalled();
  });
  
});