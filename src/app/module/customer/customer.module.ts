import { SidebarModule } from 'primeng/sidebar';
import { DataViewModule } from 'primeng/dataview';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerRoutingModule } from './customer-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OrderCustomerComponent } from 'src/app/module/customer/dashboard/order-customer/order-customer.component';
import { OrderCompleteComponent } from './dashboard/order-complete/order-complete.component';
import { ProductDialogComponent } from './dashboard/product-dialog/product-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { LoadingContainerComponent } from 'src/app/component/loading-container/loading-container.component';
import { InputTextModule } from 'primeng/inputtext';
import { SwiperModule } from 'swiper/angular';
import { TruncatePipe } from 'src/app/pipe/truncate.pipe';
import { CustomCurrencyPipe } from 'src/app/pipe/currency.pipe';
import { AddToCartDialogComponent } from 'src/app/component/dialog/add-to-cart-dialog/add-to-cart-dialog.component';
import { BadgeComponent } from 'src/app/component/badge/badge.component';
import { DividerModule } from 'primeng/divider';
import { OrderDialogComponent } from 'src/app/component/dialog/order-dialog/order-dialog.component';
import { CheckboxModule } from 'primeng/checkbox';

@NgModule({
  declarations: [
    DashboardComponent,
    OrderCustomerComponent,
    OrderCompleteComponent,
    ProductDialogComponent,
    OrderCompleteComponent,
    // dialog
    AddToCartDialogComponent,
  ],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CustomCurrencyPipe,
    TruncatePipe,
    DataViewModule,
    ButtonModule,
    InputTextModule,
    SwiperModule,
    SidebarModule,
    DividerModule,
    CheckboxModule,
    LoadingContainerComponent,
    BadgeComponent,
    OrderDialogComponent,
  ],
})
export class CustomerModule {}
