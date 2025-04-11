import { Component } from '@angular/core';
import { AppMainComponent } from 'src/app/layout/app.main.component';
import { CustomerService } from '../service/customer.service';
import { SharedService } from '../service/shared.service';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html',
})
export class AppTopBarComponent {
  items: MenuItem[] = [
    // { separator: true },
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      command: () => {},
    },
  ];
  constructor(
    public appMain: AppMainComponent,
    public sharedService: SharedService,
    private customerService: CustomerService
  ) {}

  get cartLength() {
    return this.customerService.cart.length.toString();
  }
}
