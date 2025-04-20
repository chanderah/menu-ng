import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { OrderComponent } from './order/order.component';
import { OrderLiveComponent } from './order-live/order-live.component';
import { ProductComponent } from './product/product.component';
import { CategoryComponent } from './category/category.component';
import { TableComponent } from './table/table.component';
import { PaymentComponent } from './payment/payment.component';

const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: 'user', component: UserComponent },
  { path: 'order', component: OrderComponent },
  { path: 'order/live', component: OrderLiveComponent },
  { path: 'product', component: ProductComponent },
  { path: 'category', component: CategoryComponent },
  { path: 'table', component: TableComponent },
  { path: 'payment', component: PaymentComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
