import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AdminGuard } from './guard/admin.guard';
import { CustomerGuard } from './guard/customer.guard';
import { AppMainComponent } from './layout/app.main.component';
import { LoginComponent } from './component/login/login.component';

const routes: Route[] = [
  {
    path: '',
    component: AppMainComponent,
    children: [
      {
        path: '',
        canActivate: [CustomerGuard],
        loadChildren: () => import('./module/customer/customer.module').then((m) => m.CustomerModule),
      },
      {
        path: 'admin',
        canActivate: [AdminGuard],
        canActivateChild: [AdminGuard],
        loadChildren: () => import('./module/admin/admin.module').then((m) => m.AdminModule),
      },
    ],
  },
  { path: 'customer', component: CustomerComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '' },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
      onSameUrlNavigation: 'reload',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
