import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { isEmpty, jsonParse } from '../lib/shared.util';
import { Order } from './../interface/order';
import { AppMainComponent } from './app.main.component';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {
    items: MenuItem[];

    constructor(public appMain: AppMainComponent) {}

    getCartItems() {
        const cartItems: Order[] = jsonParse(localStorage.getItem('cart'));
        if (isEmpty(cartItems)) return '0';
        return cartItems.length.toString();
    }
}
