import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { UserService } from '../user.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockCookieService: jasmine.SpyObj<CookieService>;

  beforeEach(async () => {
    mockUserService = jasmine.createSpyObj('UserService', ['login', 'getTokenUserInfo']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockCookieService = jasmine.createSpyObj('CookieService', ['set']);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: Router, useValue: mockRouter },
        { provide: CookieService, useValue: mockCookieService }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set "hide" to true by default', () => {
    expect(component.hide).toBe(true);
  });

  it('should initialize the login form with email and password controls', () => {
    expect(component.loginForm.get('email')).toBeTruthy();
    expect(component.loginForm.get('password')).toBeTruthy();
  });

  it('should show password when toggleShowPassword is called', () => {
    component.showpassword = false;
    component.toggleShowPassword();
    expect(component.showpassword).toBe(true);
  });

  it('should hide password when toggleShowPassword is called twice', () => {
    component.showpassword = true;
    component.toggleShowPassword();
    expect(component.showpassword).toBe(false);
  });

  it('should call API login method and set token in cookie on successful login', fakeAsync(() => {
    const mockResponse = { token: 'mockToken', role: 'admin' };
    mockUserService.login.and.returnValue(of(mockResponse));

    // Create a mock user object
    const mockUser = { id: 1, username: 'testuser', email: 'test@example.com', password: 'password', userType: 'admin' };
    mockUserService.getTokenUserInfo.and.returnValue(mockUser);

    component.loginForm.setValue({ email: 'test@example.com', password: 'Test@1234' });
    component.login();

    tick();

    expect(mockUserService.login).toHaveBeenCalled();
    expect(mockCookieService.set).toHaveBeenCalledWith('Authorization', `Bearer ${mockResponse.token}`);

    expect(component.responseMsg).toEqual('');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/users']);
  }));

  it('should increment attempts and lock account after reaching max attempts', fakeAsync(() => {
    const mockError = { status: 401 };
    mockUserService.login.and.returnValue(throwError(mockError));

    component.loginForm.setValue({ email: 'test@example.com', password: 'Test@1234' });

    for (let i = 0; i < component.maxAttempts; i++) {
      component.login();
      tick();
    }

    expect(component.responseMsg).toEqual(`Account is locked. Please try again in ${component.lockoutTime} seconds.`);
    expect(component.isLocked).toBe(true);
  }));

  it('should reset attempts and unlock account after countdown finishes', fakeAsync(() => {
    const mockError = { status: 401 };
    mockUserService.login.and.returnValue(throwError(mockError));

    component.loginForm.setValue({ email: 'test@example.com', password: 'Test@1234' });

    for (let i = 0; i < component.maxAttempts; i++) {
      component.login();
      tick();
    }

    tick(component.lockoutTime * 1000 + 1000);

    expect(component.responseMsg).toEqual('');
    expect(component.isLocked).toBe(false);
  }));
  it('should display appropriate error message for network errors', fakeAsync(() => {
    const mockError = { status: 500 };
    mockUserService.login.and.returnValue(throwError(mockError));
  
    component.loginForm.setValue({ email: 'test@example.com', password: 'Test@1234' });
    component.login();
    tick();
  
    expect(component.responseMsg).toEqual('An error occurred. Please try again later.');
  }));
 
  
  
  
});
