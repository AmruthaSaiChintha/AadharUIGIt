import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.css']
})
export class OtpComponent implements OnInit {
  otpForm!: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.otpForm = this.fb.group({
      phoneNumber: ['', [Validators.required, Validators.pattern('^\\d{10}$')]],
      otp: ['', [Validators.required, Validators.pattern('^\\d{6}$')]]
    });
  }

  generateOtp(): void {
    const phoneNumber = this.otpForm.get('phoneNumber')!.value;

    this.http.post<any>('https://localhost:44348/api/otp/generate', { phoneNumber }).subscribe(
      response => {
        console.log(response);
      },
      error => {
        console.error(error);
      }
    );
  }

  verifyOtp(): void {
    const phoneNumber = this.otpForm.get('phoneNumber')!.value;
    const otp = this.otpForm.get('otp')!.value;

    this.http.post<any>('https://localhost:44348/api/otp/verify', { phoneNumber, otp }).subscribe(
      response => {
        console.log(response);
        if (response.message === 'OTP verified successfully') {
          // Redirect to the login page or perform further actions
          this.router.navigate(['/login']);
        } else {
          // Handle invalid OTP
          console.error('Invalid OTP');
        }
      },
      error => {
        console.error(error);
      }
    );
  }
}
