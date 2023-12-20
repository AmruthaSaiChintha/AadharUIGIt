import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.css']
})
export class LandingpageComponent {

  constructor(public router:Router)
  {

  }

  navigate()
    {
      this.router.navigateByUrl("signup")
    }
    navigate1()
    {
      this.router.navigateByUrl("contactus")
    }
    navigate2()
    {
      this.router.navigateByUrl("users")
    }
}


