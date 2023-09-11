import { Injectable } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { ToastrService } from 'ngx-toastr';
import { Product } from 'src/app/interface/product';
import { CustomerInfo } from '../interface/customer_info';
import SharedUtil from '../lib/shared.util';
import { Order } from './../interface/order';
import { ApiService } from './api.service';
import { SharedService } from './shared.service';

@Injectable({
    providedIn: 'root'
})
export class OrderService extends SharedUtil {
    customerInfo = {} as CustomerInfo;
    order = {} as Order;
    cart = [] as Product[];

    constructor(
        private toast: HotToastService,
        private toastr: ToastrService,
        private sharedService: SharedService,
        private apiService: ApiService
    ) {
        super();
    }

    getIssuedOrders(): Order {
        const data = this.jsonParse(localStorage.getItem('order'));
        if (!this.isEmpty(data)) this.order = data;
        return this.order;

        // SHOULD BE DB!!
    }

    getMyOrders(): Order {
        const data = this.jsonParse(localStorage.getItem('order'));
        if (!this.isEmpty(data)) this.order = data;
        return this.order;
    }

    getCustomerInfo(): CustomerInfo {
        const data = this.jsonParse(localStorage.getItem('customer'));
        if (!this.isEmpty(data)) this.customerInfo = data;
        else this.customerInfo = {};
        return this.customerInfo;
    }

    setCustomerInfo(data: CustomerInfo) {
        localStorage.setItem('customer', this.jsonStringify(data));
    }

    getCart(): Product[] {
        const data = this.jsonParse(localStorage.getItem('cart'));
        if (!this.isEmpty(data)) {
            this.cart = data;
        } else this.cart = [];
        return this.cart;
    }

    addToCart(product: Product) {
        this.getCart();
        this.getCustomerInfo();
        this.cart.push(product);

        localStorage.setItem('cart', this.jsonStringify(this.cart));
        localStorage.setItem('customer', this.jsonStringify(this.customerInfo));

        this.sharedService.showSuccess('Your item is successfully added to cart!');
    }

    clear() {
        localStorage.removeItem('cart');
    }
}
