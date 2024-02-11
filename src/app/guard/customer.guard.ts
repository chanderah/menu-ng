import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { isEmpty } from '../lib/shared.util';
import { OrderService } from '../service/order.service';
import { SharedService } from '../service/shared.service';

@Injectable({
    providedIn: 'root'
})
export class CustomerGuard implements CanActivate {
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
            this.orderService.setCustomerInfo({
                tableId: Number(route.queryParamMap.get('table')),
                createdAt: new Date()
            });
            this.router.navigateByUrl('/');
        } else {
            if (isEmpty(this.orderService.getCustomerInfo())) {
                if (isEmpty(this.sharedService.getUser())) {
                    this.router.navigateByUrl('/customer', { skipLocationChange: true });
                }
            } else this.checkExpiry();
        }
        return true;
    }

    checkExpiry() {
        const customerInfo = this.orderService.getCustomerInfo();
        if (
            isNaN(customerInfo.tableId) ||
            !customerInfo.createdAt ||
            new Date(customerInfo.createdAt).getDate() < new Date().getDate()
        ) {
            localStorage.removeItem('customer');
        }
    }
}
