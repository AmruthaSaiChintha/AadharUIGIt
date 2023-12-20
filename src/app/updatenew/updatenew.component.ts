import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-updatenew',
  templateUrl: './updatenew.component.html',
  styleUrls: ['./updatenew.component.css']
})
export class UpdatenewComponent {

  id!: number;
  details: any;
  form!: FormGroup;

  constructor(
    private user: UserService,
    private router: ActivatedRoute,
    private route: Router,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      id:0,
      firstName: [''],
      lastName: [''],
      age: [''],
      address: [''],
      aadharNumber: [''],
      phone: [''],
      email: [''],
    });
  }

  ngOnInit(): void {
    this.router.paramMap.subscribe((params) => {
      const id = params.get('id');
      console.log(id);
      if (id != null) {
        const Id = +id; // Make sure id is converted to a number
        console.log(Id);
        this.user.getUser(Id).subscribe((res) => {
          this.details = res;
          console.log(res);
          this.initializeForm();
        });
      }
    });
  }

  initializeForm() {
    this.form.patchValue({
      firstName: this.details?.firstName || '',
      lastName: this.details?.lastName || '',
      age: this.details?.age || '',
      address: this.details?.address || '',
      aadharNumber: this.details?.aadharNumber || '',
      phone: this.details?.phone || '',
      email: this.details?.email || '',
    });
  }

  submit(id: number, formValue: any) {
    if(this.form.valid){
      this.details.phone=this.form.get('phone')?.value;
      this.details.email=this.form.get('email')?.value;
    }
    console.log(this.details,"updated");

    this.user.updateUser(this.details.id, this.details).subscribe((res) => {
      console.log(res);
      this.route.navigate(['users'])

    });
  }
}

