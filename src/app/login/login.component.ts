// Import necessary modules
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  hide = true;
  loginForm: FormGroup;
  responseMsg: string = '';
  token: any = '';

  constructor(
    private fb: FormBuilder,
    private api: UserService,
    private router: Router,
    private cookieService: CookieService
  ) {
    this.loginForm = fb.group({
      email: fb.control('', [Validators.required, Validators.email]),
      password: fb.control('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(15),
      ]),
    });
  }

  login() {
    let loginInfo = {
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value,
    };

    this.api.login(loginInfo).subscribe(
      (Response) => {
        this.token = Response;

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
      },
      (error) => {
        console.error("not verified");

        // Check if the error status is 401 (Unauthorized)
        if (error.status === 401) {
          // Handle incorrect password
          this.responseMsg = 'Invalid password. Please check your password and try again.';
        } else {
          // Handle other errors
          this.responseMsg = 'An error occurred. Please try again later.';
        }
      }
    );
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
    if (this.Password.hasError('maxlength'))
      return 'Maximum 15 characters are required!';
    return '';
  }

  get Email(): FormControl {
    return this.loginForm.get('email') as FormControl;
  }
  get Password(): FormControl {
    return this.loginForm.get('password') as FormControl;
  }
}
