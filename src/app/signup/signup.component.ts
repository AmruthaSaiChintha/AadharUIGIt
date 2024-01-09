
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
  signupFormModel!:FormGroup
   
  email!:string;
   
   
  password!:string;
 
  constructor(private router: Router,
    public people:UserService, private fb:FormBuilder) {}
  ngOnInit(): void {
    this.signupFormModel = this.fb.group({ // Use 'group' instead of calling 'this.fb'
      email: ['', [Validators.required, Validators.email]], // Add Validators for validation
      username: ['', Validators.required], // Add Validators for validation
      password: ['', Validators.required] ,
      userType: ['user']// Add Validators for validation
    });
  }
   
  
    
  signup() {
    console.log("SignupFormClicked");
    console.log(this.signupFormModel.value);
    if(this.signupFormModel.valid){

 this.people.user(this.signupFormModel.value).subscribe((res)=> {
  console.log(res);
  console.log("Verified!!");
  this.router.navigate(['login'])
 },
 (err)=> {
  console.log(err);
 })
      
    }
    else {
      // Mark all form controls as touched to display error messages
      this.signupFormModel.markAllAsTouched();
    }
  }
  
}
