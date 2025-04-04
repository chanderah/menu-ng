import { Component } from '@angular/core';
import { AppMainComponent } from 'src/app/layout/app.main.component';
import { CustomerService } from '../service/customer.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html',
})
export class AppTopBarComponent {
  constructor(
    public appMain: AppMainComponent,
    private customerService: CustomerService
  ) {}

  get cartLength() {
    return this.customerService.cart.length.toString();
  }
}
