import Swal from 'sweetalert2';
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-emailpage',
  templateUrl: './emailpage.component.html',
  styleUrls: ['./emailpage.component.css']
})

export class EmailpageComponent {

  @ViewChild('passportInput') passportInput: any;
  @ViewChild('otpInput') otpInput: any;
 
  otpButton: boolean = false;
  showButton: boolean = true;
  errorMessage: string = '';
  otpGenerated: boolean = false;
  showInputField: boolean = false;
  viewdetailsFlag: string = "false";
  button:boolean=true
 emailForm!:FormGroup
  tdetails = {
    email: '',
    otp: ''
  };
  showError: boolean = false;
 
  details = {
    aadhar: ''
  };
 
  token: string = ''; // Variable to store the token
  errorMsg: string = '';
 
  constructor(
    private userService: UserService,
    private router: Router
  ) { }
 
  ngOnInit(): void {
  }
 
  generateotp() {
    return Math.floor(100000 + Math.random() * 900000).toString().substring(0, 6);
  }
 
  otpclick() {
    this.showInputField = true;
    this.showButton = false; // Hide the "Generate OTP" button
    this.otpButton = true;
    const passportNumber = this.passportInput.nativeElement.value;

    this.userService.getuserbyaadhar(passportNumber).subscribe(
      (Response: any) => {
        this.errorMessage = ''
        this.showError = false;
        this.tdetails.email = Response.email;
        this.tdetails.otp = this.generateotp();

        this.userService.sendEmail(this.tdetails).subscribe((res) => {
          console.log("Email sent successfully");
        });

        this.showInputField = true;
        this.otpButton = false;
        this.showError = false;
      },
      (err: any) => {
        console.log(err);
        this.showError = true;
        this.errorMessage = 'Invalid Aadhar Number. Please check and Try again!!';

        // Set showGeneratedButton to true only if there is an error
        this.otpButton = !!err;
        this.showButton = true; // Show the "Generate OTP" button again
      }
    );
  }
 
 
 
  navigate() {
    const passportNumber = this.passportInput.nativeElement.value;
    const otpInput = this.otpInput.nativeElement.value;
 
    if (otpInput == this.tdetails.otp) {
      this.viewdetailsFlag = "true" + passportNumber;
      localStorage.setItem("flag", this.viewdetailsFlag);
      console.log(this.viewdetailsFlag);
 
      this.userService.getuserbyaadhar(passportNumber).subscribe(
        (res: any) => {
          console.log(res);
          console.log("navigating...!!");
          this.router.navigate(['/viewpage', passportNumber]);
        },
        (err: any) => {
          console.error('Error fetching user details by passport number:', err);
          this.errorMessage = 'The provided passport number could not be verified or may be empty. Please ensure the correctness of the number and proceed to view register details.';
        }
      );
 
      this.details.aadhar = passportNumber;
    } else {
      this.errorMessage = 'Invalid OTP!!';
    }
  }

 
  navigate3() {
    this.router.navigateByUrl('emailpage');
  }

  navigate1() {
    this.router.navigateByUrl('contactus');
  }

  navigate2() {
    this.router.navigateByUrl('users');
  }
}
