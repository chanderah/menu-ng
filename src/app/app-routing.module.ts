import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './component/admin/auth/login/login.component';
import { RegisterComponent } from './component/admin/auth/register/register.component';
import { CategoryComponent } from './component/admin/category/category.component';
import { OrderLiveComponent } from './component/admin/order/order-live/order-live.component';
import { OrderComponent } from './component/admin/order/order.component';
import { ProductComponent } from './component/admin/product/product.component';
import { TableComponent } from './component/admin/table/table.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { OrderCompleteComponent } from './component/order-complete/order-complete.component';
import { UnauthorizedComponent } from './component/unauthorized/unauthorized.component';
import { AppMainComponent } from './layout/app.main.component';

@NgModule({
    imports: [
        RouterModule.forRoot(
            [
                {
                    path: '',
                    // canActivate: [CustomerGuard],
                    component: AppMainComponent,
                    children: [
                        { path: '', component: DashboardComponent },
                        { path: 'order', component: OrderComponent },
                        { path: 'order/live', component: OrderLiveComponent },
                        { path: 'product', component: ProductComponent },
                        { path: 'category', component: CategoryComponent },
                        { path: 'table', component: TableComponent },
                        { path: 'order-complete', component: OrderCompleteComponent }
                    ]
                },
                { path: 'unauthorized', component: UnauthorizedComponent },
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
