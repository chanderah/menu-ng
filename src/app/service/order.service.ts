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

    clearCart() {
        localStorage.removeItem('cart');
    }

    getCart(): Product[] {
        const data = this.jsonParse(localStorage.getItem('cart'));
        if (!this.isEmpty(data)) {
            this.cart = data;
        } else this.cart = [];
        return this.cart;
    }

    setCart(products: Product[]) {
        localStorage.setItem('cart', this.jsonStringify(products));
    }

    addToCart(product: Product) {
        this.getCart();
        this.getCustomerInfo();

        product = this.filterProductOptions(product);
        this.cart.push(product);

        localStorage.setItem('cart', this.jsonStringify(this.cart));
        localStorage.setItem('customer', this.jsonStringify(this.customerInfo));

        this.sharedService.showSuccess('Your item is successfully added to cart!');
    }

    removeFromCart(productIndex: number) {
        this.getCart();
        this.cart.splice(productIndex, 1);
    }

    filterProductOptions(product: Product) {
        product.options.forEach((option) => {
            option.values.forEach((value, i) => {
                if (!value.selected) {
                    option.values.splice(i, 1);
                }
            });
        });
        console.log(product);
        return product;
    }

    // calculateTotalPrice(product: Product) {
    //     return product;
    // }
}
