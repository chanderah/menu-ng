import { Aes256Service } from './../service/aes256.service';
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
    private customerService: CustomerService,
    private aes256Service: Aes256Service
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const tableParam = route.queryParamMap.get('table');
    if (tableParam?.length) {
      this.customerService.clearCart();

      try {
        const decoded = decodeURIComponent(tableParam);
        const tableId = this.aes256Service.decrypt(decoded);
        this.customerService.customer = {
          ...this.customerService.customer,
          tableId: Number(tableId),
          createdAt: new Date(),
        };
      } catch (err) {
        // invalid table param
      }
      this.router.navigateByUrl('/', { replaceUrl: true });
      return true;
    } else if (!this.sharedService.isLoggedIn && !this.customerService.isCustomer) {
      console.log('called');
      this.router.navigateByUrl('/customer', { skipLocationChange: true });
      return false;
    }
    return true;
  }
}
