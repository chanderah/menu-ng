import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { isEmpty } from 'src/app/lib/shared.util';
import { OrderService } from '../service/order.service';
import { SharedService } from './../service/shared.service';

@Injectable({
    providedIn: 'root'
})
export class CustomerGuard implements CanActivate {
    constructor(
        private sharedService: SharedService,
        private orderService: OrderService,
        private router: Router
    ) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.isAuthorized();
    }

    isAuthorized() {
        const customer = this.orderService.getCustomerInfo();
        const user = this.sharedService.getUser();

        if (user) {
            if (isEmpty(user.id) || user.id == 0) return false;
        } else {
            const data = this.orderService.getCustomerInfo();
            if (!data.tableId || isEmpty(data.tableId) || data.tableId == 0) {
                this.router.navigate(['/unauthorized']);
                return false;
            }
        }
        return true;
    }
}
