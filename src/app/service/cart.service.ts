import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Product } from 'src/app/interface/product';
import { isEmpty, jsonParse, jsonStringify } from 'src/app/lib/object';

@Injectable({
    providedIn: 'root'
})
export class CartService {
    cart: Product[] = [];

    constructor(public messageService: MessageService) {
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
    }

    clear() {
        localStorage.removeItem('cart');
    }
}
