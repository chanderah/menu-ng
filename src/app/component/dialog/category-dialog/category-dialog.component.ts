import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Product } from 'src/app/interface/product';

@Component({
    selector: 'app-category-dialog',
    templateUrl: './category-dialog.component.html',
    styleUrls: ['./category-dialog.component.scss']
})
export class CategoryDialogComponent implements OnInit {
    display: boolean = true;
    isLoading: boolean = true;
    product!: Product;

    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig
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
