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
    this.cart = this.cartService.getCart();
  }

  onClear() {
    this.cartService.clear();
  }
}
