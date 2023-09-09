import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './component/admin/login/login.component';
import { ProductComponent } from './component/admin/product/product.component';
import { RegisterComponent } from './component/admin/register/register.component';
import { CartComponent } from './component/cart/cart.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { AccessComponent } from './component/demo/access/access.component';
import { BlocksComponent } from './component/demo/blocks/blocks.component';
import { ButtonComponent } from './component/demo/button/button.component';
import { ChartsComponent } from './component/demo/charts/charts.component';
import { CrudComponent } from './component/demo/crud/crud.component';
import { DocumentationComponent } from './component/demo/documentation/documentation.component';
import { EmptyComponent } from './component/demo/empty/empty.component';
import { ErrorComponent } from './component/demo/error/error.component';
import { FileComponent } from './component/demo/file/file.component';
import { FloatLabelComponent } from './component/demo/floatlabel/floatlabel.component';
import { FormLayoutComponent } from './component/demo/formlayout/formlayout.component';
import { IconsComponent } from './component/demo/icons/icons.component';
import { InputComponent } from './component/demo/input/input.component';
import { InvalidStateComponent } from './component/demo/invalidstate/invalidstate.component';
import { LandingComponent } from './component/demo/landing/landing.component';
import { ListComponent } from './component/demo/list/list.component';
import { MediaComponent } from './component/demo/media/media.component';
import { MessagesComponent } from './component/demo/messages/messages.component';
import { MiscComponent } from './component/demo/misc/misc.component';
import { NotfoundComponent } from './component/demo/notfound/notfound.component';
import { OverlaysComponent } from './component/demo/overlays/overlays.component';
import { PanelsComponent } from './component/demo/panels/panels.component';
import { TableComponent } from './component/demo/table/table.component';
import { TimelineComponent } from './component/demo/timeline/timeline.component';
import { TreeComponent } from './component/demo/tree/tree.component';
import { AppMainComponent } from './layout/app.main.component';

@NgModule({
    imports: [
        RouterModule.forRoot(
            [
                {
                    path: '',
                    component: AppMainComponent,
                    children: [
                        { path: '', component: DashboardComponent },
                        { path: 'product', component: ProductComponent },
                        { path: 'cart', component: CartComponent },
                        { path: 'product', component: ProductComponent },

                        /*** DEMO ***/
                        {
                            path: 'uikit/formlayout',
                            component: FormLayoutComponent,
                        },
                        { path: 'uikit/input', component: InputComponent },
                        {
                            path: 'uikit/floatlabel',
                            component: FloatLabelComponent,
                        },
                        {
                            path: 'uikit/invalidstate',
                            component: InvalidStateComponent,
                        },
                        { path: 'uikit/button', component: ButtonComponent },
                        { path: 'uikit/table', component: TableComponent },
                        { path: 'uikit/list', component: ListComponent },
                        { path: 'uikit/tree', component: TreeComponent },
                        { path: 'uikit/panel', component: PanelsComponent },
                        { path: 'uikit/overlay', component: OverlaysComponent },
                        { path: 'uikit/media', component: MediaComponent },
                        {
                            path: 'uikit/menu',
                            loadChildren: () =>
                                import('./component/demo/menus/menus.module').then(
                                    (m) => m.MenusModule
                                ),
                        },
                        { path: 'uikit/message', component: MessagesComponent },
                        { path: 'uikit/misc', component: MiscComponent },
                        { path: 'uikit/charts', component: ChartsComponent },
                        { path: 'uikit/file', component: FileComponent },
                        { path: 'pages/crud', component: CrudComponent },
                        {
                            path: 'pages/timeline',
                            component: TimelineComponent,
                        },
                        { path: 'pages/empty', component: EmptyComponent },
                        { path: 'icons', component: IconsComponent },
                        { path: 'blocks', component: BlocksComponent },
                        {
                            path: 'documentation',
                            component: DocumentationComponent,
                        },
                    ],
                },
                { path: 'portfolio', redirectTo: 'public/assets/portfolio.pdf'},
                { path: 'login', component: LoginComponent },
                { path: 'register', component: RegisterComponent },

                { path: 'pages/landing', component: LandingComponent },
                // { path: 'pages/login', component: LoginComponent },
                { path: 'pages/error', component: ErrorComponent },
                { path: 'pages/access', component: AccessComponent },
                { path: 'notfound', component: NotfoundComponent },
                { path: '**', redirectTo: 'notfound' },
            ],
            { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' }
        ),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
