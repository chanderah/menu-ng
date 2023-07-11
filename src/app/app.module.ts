import { CommonModule, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { RippleModule } from 'primeng/ripple';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CartComponent } from './component/cart/cart.component';
import { NotfoundComponent } from './component/notfound/notfound.component';
import { AppLayoutModule } from './layout/app.layout.module';
import { CartService } from './service/cart.service';
import { CountryService } from './service/country.service';
import { CustomerService } from './service/customer.service';
import { EventService } from './service/event.service';
import { IconService } from './service/icon.service';
import { NodeService } from './service/node.service';
import { PhotoService } from './service/photo.service';
import { ProductService } from './service/product.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [AppComponent, NotfoundComponent, CartComponent],
  imports: [AppRoutingModule, AppLayoutModule, CommonModule, ButtonModule, RippleModule, BrowserAnimationsModule],
  providers: [
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    CountryService,
    CustomerService,
    EventService,
    IconService,
    NodeService,
    PhotoService,
    ProductService,
    DialogService,
    CartService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
