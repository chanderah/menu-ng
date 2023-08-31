import { Injectable } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { ToastrService } from 'ngx-toastr';
import { Product } from 'src/app/interface/product';
import CommonUtil from '../lib/shared.util';
import { SharedService } from './shared.service';
@Injectable({
    providedIn: 'root'
})
export class CartService extends CommonUtil {
    cart: Product[] = [];

    constructor(
        private toast: HotToastService,
        private toastr: ToastrService,
        private sharedService: SharedService
    ) {
        super();
        this.cart = this.jsonParse(localStorage.getItem('cart'));
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

        this.sharedService.showSuccess('Your item is successfully added to cart!');
    }

    clear() {
        localStorage.removeItem('cart');
    }
}
