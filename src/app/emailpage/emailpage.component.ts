import Swal from 'sweetalert2';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-emailpage',
  templateUrl: './emailpage.component.html',
  styleUrls: ['./emailpage.component.css']
})
export class EmailpageComponent {
  emailForm: FormGroup;
  aadharNotExist: boolean = false; // Add this line to define the variable

  constructor(
    private router: Router,
    private emailverify: UserService,
    private formBuilder: FormBuilder
  ) {
    this.emailForm = this.formBuilder.group({
      AadharNumber: ['', [Validators.required]]
    });
  }

  navigate() {
    if (this.emailForm.valid) {
      const AadharNumber = this.emailForm.value.AadharNumber;
  
      this.emailverify.verifyaadhar(AadharNumber).subscribe(
        (Response) => {
          this.router.navigate(['viewpage', AadharNumber]);
        },
        (error) => {
          if (error.status === 404 && error.error.message === 'Aadhar number does not exist') {
            // Set the variable to true when Aadhar number does not exist
            this.aadharNotExist = true;
            this.showSweetAlert();
          } else {
            console.error('Error:', error);
          }
          // Navigate to the "newUser" route only if Aadhar number exists
          if (!this.aadharNotExist) {
            this.showSweetAlert();
            this.router.navigate(['newUser']);
          }
        },
        () => {
          // Reset the flag after the navigation is complete
          this.aadharNotExist = false;
        }
      );
    }
  }

  showSweetAlert() {
    Swal.fire({
      icon: 'error',
      title: 'Aadhar does not exist',
      text: 'Please check your Aadhar number and try again.',
    });
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
