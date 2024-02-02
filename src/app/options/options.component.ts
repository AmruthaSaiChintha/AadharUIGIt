import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css']
})
export class OptionsComponent {
  constructor(public userservice:UserService,private router:Router){}
  logout()
  {
    this.userservice.deleteToken();
    localStorage.clear();
    this.router.navigate(['landingpage'])

  }
}
