import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    CanActivateChild,
    Router,
    RouterStateSnapshot,
    UrlTree
} from '@angular/router';
import { Observable } from 'rxjs';
import { User } from 'src/app/interface/user';
import { isEmpty } from 'src/app/lib/shared.util';
import { SharedService } from '../service/shared.service';

@Injectable({
    providedIn: 'root'
})
export class AdminGuard implements CanActivate, CanActivateChild {
    constructor(
        private sharedService: SharedService,
        private router: Router
    ) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        if (state.url.substring(state.url.lastIndexOf('/')) === '/admin') {
            this.router.navigateByUrl('/');
            return false;
        }
        return true;
    }

    canActivateChild(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.isAuthorized();
    }

    isAuthorized() {
        const user = this.sharedService.getUser();
        if (!user || isEmpty(user) || !this.isValid(user)) {
            this.router.navigateByUrl('/unauthorized', { skipLocationChange: true });
            return false;
        }
        return true;
    }

    isValid(user: User): boolean {
        Object.values(user).forEach((v) => {
            if (isEmpty(v)) return false;
        });
        return true;
    }
}
