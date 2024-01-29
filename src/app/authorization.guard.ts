import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from './user.service';
 
 
@Injectable({
  providedIn: 'root',
})
export class authorizationguard implements CanActivate {
  constructor(private api: UserService,private router:Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    
      if (this.api.getTokenUserInfo()?.userType === "admin") {
        return true;
      }
      Swal.fire({
        title: 'UnAuthorizedAction',
        text: `You are not an Authorized User`,
        icon: 'error',
        confirmButtonText: 'OK'
      }).then(() => {
        // Navigate to the user view page
        this.router.navigate(['login']);
      });
      return false;
    

  }
}