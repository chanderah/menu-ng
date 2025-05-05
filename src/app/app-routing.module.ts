import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AdminGuard } from './guard/admin.guard';
import { CustomerGuard } from './guard/customer.guard';
import { AppMainComponent } from './layout/app.main.component';

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
  {
    path: 'unauthorized',
    loadComponent: () => import('./component/unauthorized/unauthorized.component').then((c) => c.UnauthorizedComponent),
  },
  { path: 'login', loadComponent: () => import('./component/login/login.component').then((c) => c.LoginComponent) },
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
