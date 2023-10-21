import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Injectable, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, HammerGestureConfig, HammerModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { QrCodeModule } from 'ng-qrcode';
import { ToastrModule } from 'ngx-toastr';
import { ContextMenuModule } from 'primeng/contextmenu';
import { AppRoutingModule } from './app-routing.module';
import { OrderLiveComponent } from './component/admin/order/order-live/order-live.component';
import { CartDialogComponent } from './component/dialog/cart-dialog/cart-dialog.component';
import { CustomCurrencyPipe } from './component/pipe/currency.pipe';
import { SkeletonComponent } from './component/skeleton/skeleton.component';
import { AppTopBarComponent } from './layout/app.topbar.component';
import { SharedService } from './service/shared.service';

import { AccordionModule } from 'primeng/accordion';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { BadgeModule } from 'primeng/badge';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { ChartModule } from 'primeng/chart';
import { CheckboxModule } from 'primeng/checkbox';
import { ChipModule } from 'primeng/chip';
import { ChipsModule } from 'primeng/chips';
import { CodeHighlighterModule } from 'primeng/codehighlighter';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { FileUploadModule } from 'primeng/fileupload';
import { GalleriaModule } from 'primeng/galleria';
import { ImageModule } from 'primeng/image';
import { InplaceModule } from 'primeng/inplace';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { KnobModule } from 'primeng/knob';
import { LightboxModule } from 'primeng/lightbox';
import { ListboxModule } from 'primeng/listbox';
import { MegaMenuModule } from 'primeng/megamenu';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { MultiSelectModule } from 'primeng/multiselect';
import { OrderListModule } from 'primeng/orderlist';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PaginatorModule } from 'primeng/paginator';
import { PanelModule } from 'primeng/panel';
import { PanelMenuModule } from 'primeng/panelmenu';
import { PasswordModule } from 'primeng/password';
import { PickListModule } from 'primeng/picklist';
import { ProgressBarModule } from 'primeng/progressbar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ScrollTopModule } from 'primeng/scrolltop';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SidebarModule } from 'primeng/sidebar';
import { SkeletonModule } from 'primeng/skeleton';
import { SlideMenuModule } from 'primeng/slidemenu';
import { SliderModule } from 'primeng/slider';
import { SplitButtonModule } from 'primeng/splitbutton';
import { SplitterModule } from 'primeng/splitter';
import { StepsModule } from 'primeng/steps';
import { StyleClassModule } from 'primeng/styleclass';
import { TableModule } from 'primeng/table';
import { TabMenuModule } from 'primeng/tabmenu';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { TerminalModule } from 'primeng/terminal';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { TimelineModule } from 'primeng/timeline';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { TreeModule } from 'primeng/tree';
import { TreeSelectModule } from 'primeng/treeselect';
import { TreeTableModule } from 'primeng/treetable';
import { VirtualScrollerModule } from 'primeng/virtualscroller';

import { AppComponent } from './app.component';

import { DashboardComponent } from './component/dashboard/dashboard.component';
import { EmptyComponent } from './component/demo/empty/empty.component';

import * as Hammer from 'hammerjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { SwiperModule } from 'swiper/angular';
import { LoginComponent } from './component/admin/auth/login/login.component';
import { RegisterComponent } from './component/admin/auth/register/register.component';
import { CategoryComponent } from './component/admin/category/category.component';
import { OrderComponent } from './component/admin/order/order.component';
import { ProductComponent } from './component/admin/product/product.component';
import { TableComponent } from './component/admin/table/table.component';
import { AccessComponent } from './component/demo/access/access.component';
import { AppCodeModule } from './component/demo/app-code/app.code.component';
import { BlocksComponent } from './component/demo/blocks/blocks.component';
import { BlockViewer } from './component/demo/blockviewer/blockviewer.component';
import { ButtonComponent } from './component/demo/button/button.component';
import { ChartsComponent } from './component/demo/charts/charts.component';
import { CrudComponent } from './component/demo/crud/crud.component';
import { DocumentationComponent } from './component/demo/documentation/documentation.component';
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
import { ConfirmationComponent } from './component/demo/menus/confirmation.component';
import { MenusComponent } from './component/demo/menus/menus.component';
import { PaymentComponent } from './component/demo/menus/payment.component';
import { PersonalComponent } from './component/demo/menus/personal.component';
import { SeatComponent } from './component/demo/menus/seat.component';
import { MessagesComponent } from './component/demo/messages/messages.component';
import { MiscComponent } from './component/demo/misc/misc.component';
import { NotfoundComponent } from './component/demo/notfound/notfound.component';
import { OverlaysComponent } from './component/demo/overlays/overlays.component';
import { PanelsComponent } from './component/demo/panels/panels.component';
import { TimelineComponent } from './component/demo/timeline/timeline.component';
import { TreeComponent } from './component/demo/tree/tree.component';
import { CategoryDialogComponent } from './component/dialog/category-dialog/category-dialog.component';
import { NotificationDialogComponent } from './component/dialog/notification/notification-dialog.component';
import { OrderDialogComponent } from './component/dialog/order-dialog/order-dialog.component';
import { ProductDialogComponent } from './component/dialog/product-dialog/product-dialog.component';
import { OrderCompleteComponent } from './component/order-complete/order-complete.component';
import { AppFooterComponent } from './layout/app.footer.component';
import { AppMainComponent } from './layout/app.main.component';
import { AppMenuComponent } from './layout/app.menu.component';
import { AppMenuitemComponent } from './layout/app.menuitem.component';
import { AppConfigComponent } from './layout/config/app.config.component';
import { ConfigService } from './layout/service/app.config.service';
import { MenuService } from './layout/service/app.menu.service';
import { ApiService } from './service/api.service';
import { CountryService } from './service/countryservice';
import { CustomerService } from './service/customerservice';
import { EventService } from './service/eventservice';
import { IconService } from './service/iconservice';
import { NodeService } from './service/nodeservice';
import { OrderService } from './service/order.service';
import { PhotoService } from './service/photoservice';
import { ProductService } from './service/productservice';

@Injectable()
export class MyHammerConfig extends HammerGestureConfig {
    overrides = <any>{
        swipe: { direction: Hammer.DIRECTION_ALL }
    };
}

@NgModule({
    declarations: [
        AppComponent,
        AppMainComponent,
        AppTopBarComponent,
        AppFooterComponent,
        AppConfigComponent,
        AppMenuComponent,
        AppMenuitemComponent,
        FormLayoutComponent,
        FloatLabelComponent,
        InvalidStateComponent,
        InputComponent,
        ButtonComponent,
        ListComponent,
        TreeComponent,
        PanelsComponent,
        OverlaysComponent,
        MenusComponent,
        MessagesComponent,
        MessagesComponent,
        MiscComponent,
        ChartsComponent,
        EmptyComponent,
        FileComponent,
        IconsComponent,
        DocumentationComponent,
        CrudComponent,
        TimelineComponent,
        BlocksComponent,
        BlockViewer,
        MediaComponent,
        PaymentComponent,
        ConfirmationComponent,
        PersonalComponent,
        SeatComponent,
        LandingComponent,
        ErrorComponent,
        NotfoundComponent,
        AccessComponent,
        /* PIPE */
        CustomCurrencyPipe,
        /* DIALOG */
        NotificationDialogComponent,
        ProductDialogComponent,
        OrderDialogComponent,
        CategoryDialogComponent,
        CartDialogComponent,
        /* USER */
        SkeletonComponent,
        RegisterComponent,
        LoginComponent,
        DashboardComponent,
        /* ADMIN */
        ProductComponent,
        CategoryComponent,
        TableComponent,
        OrderComponent,
        OrderLiveComponent,
        OrderCompleteComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        AccordionModule,
        AutoCompleteModule,
        AvatarModule,
        AvatarGroupModule,
        BadgeModule,
        BreadcrumbModule,
        ButtonModule,
        CalendarModule,
        CardModule,
        CarouselModule,
        CascadeSelectModule,
        ChartModule,
        CheckboxModule,
        ChipsModule,
        ChipModule,
        CodeHighlighterModule,
        ConfirmDialogModule,
        ConfirmPopupModule,
        ColorPickerModule,
        ContextMenuModule,
        DataViewModule,
        DialogModule,
        DividerModule,
        DropdownModule,
        FieldsetModule,
        FileUploadModule,
        GalleriaModule,
        ImageModule,
        InplaceModule,
        InputNumberModule,
        InputMaskModule,
        InputSwitchModule,
        InputTextModule,
        InputTextareaModule,
        KnobModule,
        LightboxModule,
        ListboxModule,
        MegaMenuModule,
        MenuModule,
        MenubarModule,
        MessageModule,
        MessagesModule,
        MultiSelectModule,
        OrderListModule,
        OrganizationChartModule,
        OverlayPanelModule,
        PaginatorModule,
        PanelModule,
        PanelMenuModule,
        PasswordModule,
        PickListModule,
        ProgressBarModule,
        RadioButtonModule,
        RatingModule,
        RippleModule,
        ScrollPanelModule,
        ScrollTopModule,
        SelectButtonModule,
        SidebarModule,
        SkeletonModule,
        SlideMenuModule,
        SliderModule,
        SplitButtonModule,
        SplitterModule,
        StepsModule,
        TagModule,
        TableModule,
        TabMenuModule,
        TabViewModule,
        TerminalModule,
        TieredMenuModule,
        TimelineModule,
        ToastModule,
        ToggleButtonModule,
        ToolbarModule,
        TooltipModule,
        TreeModule,
        TreeSelectModule,
        TreeTableModule,
        VirtualScrollerModule,
        AppCodeModule,
        StyleClassModule,
        // User Defined Modules
        DialogModule,
        SwiperModule,
        ToastrModule.forRoot(),
        // HotToastModule.forRoot({
        //     dismissible: true,
        //     duration: 3000,
        //     position: 'bottom-left',
        //     autoClose: true
        // }),
        ReactiveFormsModule,
        HammerModule,
        ScrollPanelModule,
        QrCodeModule,
        ContextMenuModule
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
        CountryService,
        CustomerService,
        EventService,
        IconService,
        NodeService,
        PhotoService,
        ProductService,
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
