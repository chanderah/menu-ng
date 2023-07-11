import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CartComponent } from './component/cart/cart.component';
import { NotfoundComponent } from './component/notfound/notfound.component';
import { AppLayoutComponent } from "./layout/app.layout.component";

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '', component: AppLayoutComponent,
                children: [
                    { path: '', loadChildren: () => import('./component/dashboard/dashboard.module').then(m => m.DashboardModule) },
                    { path: 'uikit', loadChildren: () => import('./component/uikit/uikit.module').then(m => m.UIkitModule) },
                    { path: 'utilities', loadChildren: () => import('./component/utilities/utilities.module').then(m => m.UtilitiesModule) },
                    { path: 'documentation', loadChildren: () => import('./component/documentation/documentation.module').then(m => m.DocumentationModule) },
                    { path: 'pages', loadChildren: () => import('./component/pages/pages.module').then(m => m.PagesModule) },

                    { path: 'cart', component: CartComponent }
                ]
            },
            { path: 'auth', loadChildren: () => import('./component/auth/auth.module').then(m => m.AuthModule) },
            { path: 'landing', loadChildren: () => import('./component/landing/landing.module').then(m => m.LandingModule) },
            { path: 'error', component: NotfoundComponent },
            { path: '**', redirectTo: '/' },
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
