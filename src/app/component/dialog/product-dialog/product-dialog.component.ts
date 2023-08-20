import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Product } from 'src/app/interface/product';
import { CartService } from 'src/app/service/cart.service';
import { environment } from './../../../../environments/environment';

@Component({
    templateUrl: './product-dialog.component.html'
})
export class ProductDialogComponent implements OnInit {
    @ViewChild('imageDialog') imageDialog: ElementRef;
    env = environment;

    isLoading: boolean = true;
    product!: Product;

    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private cartService: CartService
    ) {
        const { data } = config;
        this.product = data;
        console.log(this.product);
    }

    ngOnInit(): void {
        console.log('i called');
    }

    addToCart(data: any) {
        // const res = this.cartService.addToCart(data);
        this.ref.close(data);
    }
}
