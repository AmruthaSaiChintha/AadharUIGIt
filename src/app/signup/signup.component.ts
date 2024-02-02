import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupFormModel!: FormGroup;
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
          this.comEmailValidator
        ]
      ],
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(20),
          Validators.pattern(/^[^\d\s!@#$%^&*(),.?":{}|<>]+$/)
        ]
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/), // At least one uppercase, one lowercase, one digit, and one special character, with exactly one special character
        ],
      ],
      userType: ['user']
    });
  }

  comEmailValidator(control: any): { [key: string]: boolean } | null {
    const email = control.value;
    if (!/.com$/.test(email.toLowerCase())) {
      return { 'invalidEmail': true };
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
