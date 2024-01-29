import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

// Custom validator function to check if username contains numbers
function noNumbersValidator(control: AbstractControl): ValidationErrors | null {
  const username = control.value;
  if (/\d/.test(username)) {
    return { 'noNumbers': true };
  }
  return null;
}

function passwordFormatValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.value;

  // Define your regular expression for the password format
  const passwordFormat = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  // Count the occurrences of special characters
  const specialCharCount = (password.match(/[@$!%*?&]/g) || []).length;

  // Return an error if there is not exactly one special character
  if (specialCharCount !== 1) {
    return { 'invalidPasswordFormat': true };
  }

  if (!passwordFormat.test(password)) {
    return { 'invalidPasswordFormat': true };
  }

  return null;
}


// Custom validator function to check if email has .com ending
function comEmailValidator(control: AbstractControl): ValidationErrors | null {
  const email = control.value;
  if (!/.com$/.test(email.toLowerCase())) {
    return { 'invalidEmail': true };
  }
  return null;
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupFormModel!: FormGroup;
  // In your component.ts
isHovered: boolean = false;


  constructor(private router: Router, public people: UserService, private fb: FormBuilder) { }

  showpassword: boolean = false;

  ngOnInit(): void {
    this.signupFormModel = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.maxLength(30),
          this.validateEmailFormat
        ]
      ],      username: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(12)]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(18),
          Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/),
        ],
      ],
      userType: ['user']
    });
  }

  validateEmailFormat(control: AbstractControl): { [key: string]: boolean } | null {
    const email = control.value;
    const atIndex = email.indexOf('@');
    const dotIndex = email.lastIndexOf('.');
  
    // Check for one "@" and one "." in the email
    if (atIndex === -1 || dotIndex === -1 || atIndex !== email.lastIndexOf('@') || dotIndex !== email.lastIndexOf('.')) {
      return { 'invalidEmailFormat': true };
    }
  
    return null;
  }

  signup() {
    console.log("SignupFormClicked");
    console.log(this.signupFormModel.value);
    if (this.signupFormModel.valid) {
      this.people.user(this.signupFormModel.value).subscribe(
        (res) => {
          console.log(res);
          console.log("Verified!!");
          this.router.navigate(['login']);
        },
        (err) => {
          console.log(err);
        }
      );
    } else {
      this.signupFormModel.markAllAsTouched();
      console.log("Form errors:", this.signupFormModel.errors);
    }
  }

  toggleShowPassword() {
    this.showpassword = !this.showpassword;
  }
}
