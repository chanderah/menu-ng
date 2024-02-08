import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AppMainComponent } from 'src/app/layout/app.main.component';
import { isEmpty, jsonParse } from '../lib/shared.util';
import { Product } from './../interface/product';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {
    items: MenuItem[];

    constructor(public appMain: AppMainComponent) {}

    getCountCartItems() {
        const cartItems: any[] = jsonParse(localStorage.getItem('cart')) as Product[];
        return isEmpty(cartItems) ? '0' : cartItems.length.toString();
    }

    onClickCart() {
        // disableBodyScroll();
        this.appMain.showCartDialog = true;
    }
}
