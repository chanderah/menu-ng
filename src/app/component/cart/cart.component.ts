import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/interface/product';
import { OrderService } from '../../service/order.service';

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html'
})
export class CartComponent implements OnInit {
    cart: Product[] = [];
    constructor(private orderService: OrderService) {}

    ngOnInit(): void {
        this.initData();
    }

    initData() {
        const data = this.orderService.getCart();
        if (data) this.cart = data;
        else this.cart.length = 0;
    }

    onClear() {
        this.orderService.clear();
        this.initData();
    }
}
