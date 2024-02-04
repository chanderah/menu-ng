import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { isEmpty } from '../lib/shared.util';
import { SharedService } from '../service/shared.service';
import { OrderService } from './../service/order.service';

@Injectable({
    providedIn: 'root'
})
export class TableGuard implements CanActivate {
    constructor(
        private router: Router,
        private sharedService: SharedService,
        private orderService: OrderService
    ) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        if (route.queryParamMap.has('table')) {
            this.orderService.setCustomerInfo({ tableId: Number(route.queryParamMap.get('table')) });
            this.router.navigate(['/']);
        } else {
            if (isEmpty(this.orderService.getCustomerInfo())) {
                if (isEmpty(this.sharedService.getUser())) {
                    this.router.navigateByUrl('/customer', { skipLocationChange: true });
                }
            }
        }
        return true;
    }
}
