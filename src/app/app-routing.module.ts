import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AccessComponent } from './component/access/access.component';
import { BlocksComponent } from './component/blocks/blocks.component';
import { ButtonComponent } from './component/button/button.component';
import { CartComponent } from './component/cart/cart.component';
import { ChartsComponent } from './component/charts/charts.component';
import { CrudComponent } from './component/crud/crud.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { DocumentationComponent } from './component/documentation/documentation.component';
import { EmptyComponent } from './component/empty/empty.component';
import { ErrorComponent } from './component/error/error.component';
import { FileComponent } from './component/file/file.component';
import { FloatLabelComponent } from './component/floatlabel/floatlabel.component';
import { FormLayoutComponent } from './component/formlayout/formlayout.component';
import { IconsComponent } from './component/icons/icons.component';
import { InputComponent } from './component/input/input.component';
import { InvalidStateComponent } from './component/invalidstate/invalidstate.component';
import { LandingComponent } from './component/landing/landing.component';
import { ListComponent } from './component/list/list.component';
import { LoginComponent } from './component/login/login.component';
import { MediaComponent } from './component/media/media.component';
import { MessagesComponent } from './component/messages/messages.component';
import { MiscComponent } from './component/misc/misc.component';
import { NotfoundComponent } from './component/notfound/notfound.component';
import { OverlaysComponent } from './component/overlays/overlays.component';
import { PanelsComponent } from './component/panels/panels.component';
import { TableComponent } from './component/table/table.component';
import { TimelineComponent } from './component/timeline/timeline.component';
import { TreeComponent } from './component/tree/tree.component';
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
                        { path: 'cart', component: CartComponent },
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
                                import('./component/menus/menus.module').then(
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
                { path: 'pages/landing', component: LandingComponent },
                { path: 'pages/login', component: LoginComponent },
                { path: 'pages/error', component: ErrorComponent },
                { path: 'pages/notfound', component: NotfoundComponent },
                { path: 'pages/access', component: AccessComponent },
                { path: '**', redirectTo: 'pages/notfound' },
            ],
            { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' }
        ),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
