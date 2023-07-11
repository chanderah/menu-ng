import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Product } from 'src/app/api/product';
import { CartService } from './../../../service/cart.service';

@Component({
  template: `
    <div class="text-center">
      <img
        #imageDialog
        [alt]="product.name"
        src="assets/images/product/{{ product.image }}"
        class="shadow-4"
        width="100%" />
      <div>
        <h6 class="mt-0 my-3 text-primary">Rp{{ product.price }}</h6>
        <p class="my-2">{{ product.description }}</p>
        <div class="mt-4 mb-2">
          <button icon="pi pi-cog" class="p-button-rounded p-button-info" (click)="addToCart(product)">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  `
})
export class ImageDialogComponent implements OnInit {
  product!: Product;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private cartService: CartService
  ) {
    const { data } = config;
    console.log(data);
    this.product = data;
  }

  ngOnInit(): void {
    console.log('i called');
  }

  addToCart(data: any) {
    // console.log(data);
    const res = this.cartService.addToCart(data);
    // console.log(res);
  }
}
