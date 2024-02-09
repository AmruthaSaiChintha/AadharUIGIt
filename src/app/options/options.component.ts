import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css']
})
export class OptionsComponent {
  constructor(public userservice:UserService,private router:Router,private cookieService: CookieService){}
  logout()
  {
    this.userservice.deleteToken();
    localStorage.clear();
    this.cookieService.deleteAll();

    this.router.navigate(['landingpage'])

  }
}
