import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent {

  constructor(public userservice:UserService,private router:Router){}
  logout()
  {
    this.userservice.deleteToken();
    this.router.navigate(['landingpage'])

  }
}
