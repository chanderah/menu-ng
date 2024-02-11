import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './component/admin/auth/login/login.component';
import { RegisterComponent } from './component/admin/auth/register/register.component';
import { CategoryComponent } from './component/admin/category/category.component';
import { OrderLiveComponent } from './component/admin/order-live/order-live.component';
import { OrderComponent } from './component/admin/order/order.component';
import { ProductComponent } from './component/admin/product/product.component';
import { TableComponent } from './component/admin/table/table.component';
import { UserComponent } from './component/admin/user/user.component';
import { CustomerComponent } from './component/customer/customer.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { OrderCompleteComponent } from './component/dashboard/order-complete/order-complete.component';
import { AdminGuard } from './guard/admin.guard';
import { CustomerGuard } from './guard/customer.guard';
import { AppMainComponent } from './layout/app.main.component';

@NgModule({
    imports: [
        RouterModule.forRoot(
            [
                {
                    path: '',
                    component: AppMainComponent,
                    children: [
                        { path: '', canActivate: [CustomerGuard], component: DashboardComponent },
                        { path: 'order-complete', component: OrderCompleteComponent },
                        {
                            path: 'admin',
                            canActivate: [AdminGuard],
                            canActivateChild: [AdminGuard],
                            children: [
                                { path: 'user', component: UserComponent },
                                { path: 'order', component: OrderComponent },
                                { path: 'order/live', component: OrderLiveComponent },
                                { path: 'product', component: ProductComponent },
                                { path: 'category', component: CategoryComponent },
                                { path: 'table', component: TableComponent }
                            ]
                        }
                    ]
                },
                { path: 'customer', component: CustomerComponent },
                { path: 'login', component: LoginComponent },
                { path: 'register', component: RegisterComponent },
                { path: '**', redirectTo: '' }
            ],
            { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' }
        )
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {}
