
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
 
@Component({
  selector: 'app-signup1',
  templateUrl: './signup1.component.html',
  styleUrls: ['./signup1.component.css']
})
export class Signup1Component implements OnInit {
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

 this.people.user(this.signupFormModel.value).subscribe((res)=> {
  console.log(res);
  console.log("Verified!!");
  this.router.navigate(['login'])
 },
 (err)=> {
  console.log(err);
 })
      
    }
  }
