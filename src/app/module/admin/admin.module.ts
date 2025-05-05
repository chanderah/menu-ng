import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { UserComponent } from './user/user.component';
import { OrderComponent } from './order/order.component';
import { OrderLiveComponent } from './order-live/order-live.component';
import { ProductComponent } from './product/product.component';
import { CategoryComponent } from './category/category.component';
import { TableComponent } from './table/table.component';
import { PaymentComponent } from './payment/payment.component';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { InputNumberModule } from 'primeng/inputnumber';
import { FileUploadModule } from 'primeng/fileupload';
import { ContextMenuModule } from 'primeng/contextmenu';
import { BadgeModule } from 'primeng/badge';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TruncatePipe } from 'src/app/pipe/truncate.pipe';
import { CustomCurrencyPipe } from 'src/app/pipe/currency.pipe';
import { LoadingContainerComponent } from 'src/app/component/loading-container/loading-container.component';
import { InputTextModule } from 'primeng/inputtext';
import { StripePipe } from 'src/app/pipe/stripe.pipe';

@NgModule({
  declarations: [UserComponent, OrderComponent, OrderLiveComponent, ProductComponent, CategoryComponent, TableComponent, PaymentComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    DropdownModule,
    PasswordModule,
    CheckboxModule,
    DialogModule,
    TableModule,
    InputNumberModule,
    FileUploadModule,
    ContextMenuModule,
    BadgeModule,
    DragDropModule,
    InputTextModule,
    InputNumberModule,
    // QrCodeComponent,

    LoadingContainerComponent,
    TruncatePipe,
    CustomCurrencyPipe,
    StripePipe,
  ],
})
export class AdminModule {}
