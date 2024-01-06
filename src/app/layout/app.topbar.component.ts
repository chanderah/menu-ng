import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { isEmpty, jsonParse } from '../lib/shared.util';
import { Product } from './../interface/product';
import { AppMainComponent } from './app.main.component';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {
    items: MenuItem[];

    constructor(public appMain: AppMainComponent) {}

    getCountCartItems() {
        const cartItems: any[] = jsonParse(localStorage.getItem('cart')) as Product[];
        if (isEmpty(cartItems)) return '0';
        return cartItems.length.toString();
    }

    onClickCart() {
        // disableBodyScroll();
        this.appMain.showCartDialog = true;
    }
}
