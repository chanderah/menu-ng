import { Injectable } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';
import { Product } from 'src/app/interface/product';
import { CustomerInfo } from '../interface/customer_info';
import CommonUtil from '../lib/shared.util';
import { ApiService } from './api.service';
import { SharedService } from './shared.service';

@Injectable({
    providedIn: 'root'
})
export class CartService extends CommonUtil {
    customerInfo = {} as CustomerInfo;
    cart: Product[] = [];

    constructor(
        private toast: HotToastService,
        private toastr: ToastrService,
        private sharedService: SharedService,
        private apiService: ApiService
    ) {
        super();
    }

    getCustomerInfo() {
        return this.jsonParse(localStorage.getItem('customer'));
    }

    async getOrders() {
        this.customerInfo.tableId = 1;
        await lastValueFrom(this.apiService.getOrders(this.customerInfo)).then((res: any) => {
            return res;
        });
    }

    getCart() {
        this.cart = this.jsonParse(localStorage.getItem('cart'));
        return this.cart;
    }

    addToCart(product: Product) {
        this.getCart();
        if (this.isEmpty(this.cart)) {
            this.cart = [product];
        } else this.cart.push(product);
        localStorage.setItem('cart', this.jsonStringify(this.cart));

        localStorage.setItem('customer', this.jsonStringify('aaa'));

        this.sharedService.showSuccess('Your item is successfully added to cart!');
    }

    clear() {
        localStorage.removeItem('cart');
    }
}
