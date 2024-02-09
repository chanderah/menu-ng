import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { Injectable, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, HAMMER_GESTURE_CONFIG, HammerGestureConfig, HammerModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { QrCodeModule } from 'ng-qrcode';
import { BadgeModule } from 'primeng/badge';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { InputMaskModule } from 'primeng/inputmask';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PasswordModule } from 'primeng/password';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { SidebarModule } from 'primeng/sidebar';
import { SkeletonModule } from 'primeng/skeleton';
import { ToastModule } from 'primeng/toast';
import { TreeModule } from 'primeng/tree';
import { AppRoutingModule } from './app-routing.module';
import { CartDialogComponent } from './component/_common/cart-dialog/cart-dialog.component';
import { SkeletonComponent } from './component/skeleton/skeleton.component';
import { AppTopBarComponent } from './layout/app.topbar.component';
import { OrderService } from './service/order.service';
import { SharedService } from './service/shared.service';

import { AutoFocusModule } from 'primeng/autofocus';

import { AppComponent } from './app.component';

import { DashboardComponent } from './component/dashboard/dashboard.component';

import * as Hammer from 'hammerjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { DialogService } from 'primeng/dynamicdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { SwiperModule } from 'swiper/angular';
import { NotificationDialogComponent } from './component/_common/notification-dialog/notification-dialog.component';
import { LoginComponent } from './component/admin/auth/login/login.component';
import { RegisterComponent } from './component/admin/auth/register/register.component';
import { CategoryComponent } from './component/admin/category/category.component';
import { OrderLiveComponent } from './component/admin/order-live/order-live.component';
import { OrderComponent } from './component/admin/order/order.component';
import { ProductComponent } from './component/admin/product/product.component';
import { TableComponent } from './component/admin/table/table.component';
import { UserComponent } from './component/admin/user/user.component';
import { OrderDialogComponent } from './component/dashboard/order-dialog/order-dialog.component';
import { ProductDialogComponent } from './component/dashboard/product-dialog/product-dialog.component';
import { AppFooterComponent } from './layout/app.footer.component';
import { AppMainComponent } from './layout/app.main.component';
import { AppMenuComponent } from './layout/app.menu.component';
import { AppMenuitemComponent } from './layout/app.menuitem.component';
import { AppConfigComponent } from './layout/config/app.config.component';
import { ConfigService } from './layout/service/app.config.service';
import { MenuService } from './layout/service/app.menu.service';
import { CustomCurrencyPipe } from './pipe/currency.pipe';
import { ApiService } from './service/api.service';

@Injectable()
export class MyHammerConfig extends HammerGestureConfig {
    overrides = <any>{
        swipe: { direction: Hammer.DIRECTION_ALL }
    };
}

const layoutComponents: any[] = [
    AppComponent,
    AppConfigComponent,
    AppMainComponent,
    AppTopBarComponent,
    AppFooterComponent,
    AppMenuComponent,
    AppMenuitemComponent
];

const adminComponents: any[] = [
    UserComponent,
    OrderComponent,
    OrderLiveComponent,
    ProductComponent,
    CategoryComponent,
    TableComponent
];

@NgModule({
    declarations: [
        ...layoutComponents,
        ...adminComponents,

        /* PIPE */
        CustomCurrencyPipe,

        /* DIALOG */
        NotificationDialogComponent,
        ProductDialogComponent,
        OrderDialogComponent,
        CartDialogComponent,

        /* MAIN COMPONENT */
        SkeletonComponent,
        RegisterComponent,
        LoginComponent,
        DashboardComponent
    ],
    imports: [
        AppRoutingModule,
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        BadgeModule,
        ConfirmDialogModule,
        DataViewModule,
        DividerModule,
        PasswordModule,
        SidebarModule,
        SkeletonModule,
        ToastModule,
        SwiperModule,
        HammerModule,
        ScrollPanelModule,
        QrCodeModule,
        ContextMenuModule,
        AutoFocusModule,
        InputTextModule,
        InputTextareaModule,
        InputNumberModule,
        InputMaskModule,
        InputSwitchModule,
        CheckboxModule,
        DropdownModule,
        DialogModule,
        TableModule,
        TreeModule,
        RadioButtonModule
    ],
    providers: [
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        // { provide: LOCALE_ID, useValue: 'id-ID' },
        {
            provide: HAMMER_GESTURE_CONFIG,
            useClass: MyHammerConfig
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ApiService,
            multi: true
        },
        MenuService,
        ConfigService,

        ConfirmationService,
        MessageService,
        DialogService,
        OrderService,

        /* SHARED */
        SharedService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}

// AccordionModule,
// AutoCompleteModule,
// AvatarModule,
// AvatarGroupModule,

// BreadcrumbModule,
// ButtonModule,
// CalendarModule,
// CardModule,
// CarouselModule,
// CascadeSelectModule,
// ChartModule,
// CheckboxModule,
// ChipsModule,
// ChipModule,
// CodeHighlighterModule,

// ConfirmPopupModule,
// ColorPickerModule,
// ContextMenuModule,
// DialogModule,

// DropdownModule,
// FieldsetModule,
// FileUploadModule,
// GalleriaModule,
// ImageModule,
// InplaceModule,
// InputNumberModule,
// InputMaskModule,
// InputSwitchModule,
// InputTextModule,
// InputTextareaModule,
// KnobModule,
// LightboxModule,
// ListboxModule,
// MegaMenuModule,
// MenuModule,
// MenubarModule,
// MessageModule,
// MessagesModule,
// MultiSelectModule,
// OrderListModule,
// OrganizationChartModule,
// OverlayPanelModule,
// PaginatorModule,
// PanelModule,
// PanelMenuModule,

// PickListModule,
// ProgressBarModule,
// RadioButtonModule,
// RatingModule,
// RippleModule,
// ScrollPanelModule,
// ScrollTopModule,
// SelectButtonModule,

// SlideMenuModule,
// SliderModule,
// SplitButtonModule,
// SplitterModule,
// StepsModule,
// TagModule,
// TableModule,
// TabMenuModule,
// TabViewModule,
// TerminalModule,
// TieredMenuModule,
// TimelineModule,

// ToggleButtonModule,
// ToolbarModule,
// TooltipModule,
// TreeModule,
// TreeSelectModule,
// TreeTableModule,
// VirtualScrollerModule,
// StyleClassModule,

// ToastrModule.forRoot(),
