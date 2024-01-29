import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
 
import { UserService } from './user.service';
 
@Injectable({
  providedIn: 'root',
})
export class AuthenticationGuard implements CanActivate {
  constructor(private api: UserService, private router:Router) {}
  canActivate(): boolean {
    if (this.api.isLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['/login']); // Redirect to login page if not authenticated
      return false;
    }
  }
}