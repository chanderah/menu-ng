import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SharedService } from '../service/shared.service';
import { CustomerService } from '../service/customer.service';

@Injectable({
  providedIn: 'root',
})
export class CustomerGuard implements CanActivate {
  constructor(
    private router: Router,
    private sharedService: SharedService,
    private customerService: CustomerService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const tableId = Number(route.queryParamMap.get('table'));
    if (tableId > 0) {
      this.customerService.customer = {
        ...this.customerService.customer,
        tableId,
        createdAt: new Date(),
      };
      this.router.navigateByUrl('/');
      return true;
    } else if (!this.sharedService.isLoggedIn && !this.customerService.isCustomer) {
      this.router.navigateByUrl('/customer', { skipLocationChange: true });
      return false;
    } else if (this.customerService.isCustomer) {
      return this.checkExpiry();
    }
    return true;
  }

  checkExpiry() {
    const { customer } = this.customerService;
    if (isNaN(customer.tableId) || !customer.createdAt || new Date(customer.createdAt).getDate() < new Date().getDate()) {
      this.router.navigateByUrl('/customer', { skipLocationChange: true });
      return false;
    }
    return true;
  }
}
