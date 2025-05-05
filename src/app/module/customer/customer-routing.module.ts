import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderCustomerComponent } from 'src/app/module/customer/dashboard/order-customer/order-customer.component';
import { OrderCompleteComponent } from './dashboard/order-complete/order-complete.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'order', component: OrderCustomerComponent },
  { path: 'order-complete', component: OrderCompleteComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerRoutingModule {}
