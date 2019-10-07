import { CanActivate , ActivatedRouteSnapshot , RouterStateSnapshot, Router} from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api.service'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private apiService: ApiService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    const isAuth = this.apiService.getIsAuth();
    if (!isAuth) {
      this.router.navigate(['/Login']);
    }
    return isAuth;
  }
}
