import { Injectable } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { ToastrService } from 'ngx-toastr';
import { Product } from 'src/app/interface/product';
import { isEmpty, jsonParse, jsonStringify } from 'src/app/lib/object';

@Injectable({
    providedIn: 'root'
})
export class CartService {
    cart: Product[] = [];

    constructor(
        private toast: HotToastService,
        private toastr: ToastrService
    ) {
        this.cart = jsonParse(localStorage.getItem('cart'));
    }

    getCart() {
        this.cart = jsonParse(localStorage.getItem('cart'));
        return this.cart;
    }

    addToCart(product: Product) {
        this.getCart();
        if (isEmpty(this.cart)) {
            this.cart = [product];
        } else this.cart.push(product);
        localStorage.setItem('cart', jsonStringify(this.cart));

        this.showToast();
    }

    clear() {
        localStorage.removeItem('cart');
    }

    showToast() {
        console.log(this.getCart());
        this.toast.success('Your item is successfully added to cart!');
        // this.toastr.success('Your item is successfully added to cart.', 'Success!');
    }
}
