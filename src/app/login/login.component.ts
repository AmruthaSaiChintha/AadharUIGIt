import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { CookieService } from 'ngx-cookie-service';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Subscription, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

function passwordFormatValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.value;
  const passwordFormat = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordFormat.test(password)) {
    return { 'invalidPasswordFormat': true };
  }
  return null;
}
function emailFormatValidator(control: AbstractControl): ValidationErrors | null {
  const email = control.value;

  // Updated regular expression to include a dot (`.`)
  const emailFormat = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailFormat.test(email)) {
    return { 'invalidEmailFormat': true };
  }
  return null;
}

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnDestroy, OnInit {
  hide = true;
  loginForm: FormGroup;
  responseMsg: string = '';
  token: any = '';
  showpassword: boolean = false;
  maxAttempts = 3;
  attempts = 0;
  lockoutTime = 30; // in seconds
  isLocked = false;
  countdown: number | undefined;
  private countdownSubscription: Subscription | undefined;

  constructor(
    private fb: FormBuilder,
    private api: UserService,
    private router: Router,
    private cookieService: CookieService
  ) {
    this.loginForm = fb.group({
      email: fb.control('', [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/), emailFormatValidator]),
      password: fb.control('', [
        Validators.required,
        Validators.minLength(8),
        passwordFormatValidator
      ]),
    });
  }
  ngOnInit(): void {
  }
  login() {
    if (this.isLocked) {
      this.responseMsg = `Account is locked. Please try again in ${this.countdown} seconds.`;
      return;
    }
  let loginInfo = {
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value,
    };
  this.api.login(loginInfo).subscribe(
      (Response) => {
        this.token = Response;
        console.log(this.token);
        this.cookieService.set('Authorization', `Bearer ${Response.token}`, undefined, '/', undefined, true, 'Strict');
        localStorage.setItem("role", Response.role);
        this.responseMsg = '';
        const user = this.api.getTokenUserInfo();
        console.log('User Type:', user?.userType);
        if (user && user.userType === 'admin') {
          this.router.navigate(['/users']);
        } else {
          this.router.navigate(['/emailpage']);
        }
    this.resetAttempts();
      },
      (error) => {
        console.error("not verified");
        this.attempts++;
        if (this.attempts >= this.maxAttempts) {
          this.isLocked = true;
          this.startCountdown();
        }
        if (error.status === 401) {
          this.responseMsg = 'Invalid password. Please check your password and try again.';
        } else {
          this.responseMsg = 'An error occurred. Please try again later.';
        }
      }
    );
  }
 toggleShowPassword() {
    this.showpassword = !this.showpassword;
  }
getEmailErrors() {
    if (this.Email.hasError('required')) return 'Email is required!';
    if (this.Email.hasError('email')) return 'Email is invalid.';
    return '';
  }
getPasswordErrors() {
    if (this.Password.hasError('required')) return 'Password is required!';
    if (this.Password.hasError('minlength'))
      return 'Minimum 8 characters are required!';
    if (this.Password.hasError('invalidPasswordFormat'))
      return 'Password must have uppercase, lowercase, number, and special character';
    return '';
  }
get Email(): FormControl {
    return this.loginForm.get('email') as FormControl;
  }

  get Password(): FormControl {
    return this.loginForm.get('password') as FormControl;
  }

  private startCountdown() {
    this.countdown = this.lockoutTime;
  this.countdownSubscription = timer(1000, 1000)
      .pipe(takeUntil(timer(this.lockoutTime * 1000 + 1000)))
      .subscribe(
        () => {
          if (this.countdown) {
            this.countdown--;
            this.responseMsg = `Account is locked. Please try again in ${this.countdown} seconds.`;
          }
        },
        () => { },
        () => {
          this.isLocked = false;
          this.countdown = undefined;
          this.countdownSubscription?.unsubscribe();
          this.responseMsg = ''
        }
      );
  }


  private resetAttempts() {
    this.attempts = 0;
    this.isLocked = false;
    this.countdown = undefined;
    this.countdownSubscription?.unsubscribe();
  }

  ngOnDestroy() {
    this.countdownSubscription?.unsubscribe();
  }
}
