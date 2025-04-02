import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SharedService } from '../service/shared.service';
import { CONSTANTS } from '../constants/common';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate, CanActivateChild {
  constructor(
    private sharedService: SharedService,
    private router: Router
  ) {}

  canActivate(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }

  canActivateChild(
    _route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.sharedService.isAdmin || !this.hasAccess(state.url)) {
      this.router.navigateByUrl('/');
      return false;
    }
    return true;
  }

  hasAccess(url: string) {
    const menu = CONSTANTS.ADMIN_MENU.find((v) => v.routerLink === url);
    if (menu) return this.sharedService.hasAccess(menu.role);
    return true;
  }
}
