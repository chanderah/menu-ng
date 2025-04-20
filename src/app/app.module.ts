import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { Injectable, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, HAMMER_GESTURE_CONFIG, HammerGestureConfig } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppTopBarComponent } from './layout/app.topbar.component';

import { AppComponent } from './app.component';

import * as Hammer from 'hammerjs';
import { AppFooterComponent } from './layout/app.footer.component';
import { AppMainComponent } from './layout/app.main.component';
import { AppMenuComponent } from './layout/app.menu.component';
import { AppMenuitemComponent } from './layout/app.menuitem.component';
import { AppConfigComponent } from './layout/config/app.config.component';
import { ConfigService } from './layout/service/app.config.service';
import { MenuService } from './layout/service/app.menu.service';
import { ApiInterceptor } from './interceptor/api.interceptor';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { OrderDialogComponent } from './component/dialog/order-dialog/order-dialog.component';

@Injectable()
export class MyHammerConfig extends HammerGestureConfig {
  overrides = <any>{
    swipe: { direction: Hammer.DIRECTION_ALL },
  };
}

@NgModule({
  declarations: [
    AppComponent,
    AppConfigComponent,
    AppMainComponent,
    AppTopBarComponent,
    AppFooterComponent,
    AppMenuComponent,
    AppMenuitemComponent,

    /* PIPE */
    // CustomCurrencyPipe,
    // StripePipe,
    // TruncatePipe,

    /* DIALOG */
    // NotificationDialogComponent,
    // ProductDialogComponent,
    // AddToCartDialogComponent,

    /* MAIN COMPONENT */
    // LoginComponent,
    // DashboardComponent,
    // OrderCustomerComponent,
    // LoadingContainerComponent,
    // BadgeComponent,
    // OrderDetailsDialogComponent,
    // ChoosePaymentDialogComponent,
    // PrintDialogComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,

    BadgeModule,
    ButtonModule,
    CheckboxModule,

    ConfirmDialogModule,
    ToastModule,

    OrderDialogComponent,

    // DataViewModule,
    // DividerModule,
    // PasswordModule,
    // SidebarModule,
    // SkeletonModule,
    // SwiperModule,
    // HammerModule,
    // ScrollPanelModule,
    // QrCodeModule,
    // ContextMenuModule,
    // AutoFocusModule,
    // InputTextModule,
    // InputTextareaModule,
    // InputNumberModule,
    // InputMaskModule,
    // InputSwitchModule,
    // CheckboxModule,
    // DropdownModule,
    // DialogModule,
    // TableModule,
    // TreeModule,
    // RadioButtonModule,
    // FileUploadModule,
    // ProgressSpinnerModule,
    // ChipModule,
    // ScrollToBottomDirective,
    // MenuModule,
    // DragDropModule,
    // TagModule,
  ],
  providers: [
    // { provide: LOCALE_ID, useValue: 'id-ID' },
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: MyHammerConfig,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true,
    },
    MenuService,
    ConfigService,

    MessageService,
    ConfirmationService,
    DialogService,

    // /* SHARED */
    // SharedService,
    // CustomCurrencyPipe,
    // StripePipe,
    // TruncatePipe,
    // TreeDragDropService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
