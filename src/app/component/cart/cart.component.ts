import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/api/product';
import { CartService } from './../../service/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html'
})
export class CartComponent implements OnInit {
  cart: Product[] = [];
  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.initData();
  }

  initData() {
    const data = this.cartService.getCart();
    if (data) this.cart = data;
    else this.cart.length = 0;
  }

  onClear() {
    this.cartService.clear();
    this.initData();
  }
}
