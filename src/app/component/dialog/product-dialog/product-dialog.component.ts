import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Product } from 'src/app/interface/product';
import { environment } from './../../../../environments/environment';

@Component({
    templateUrl: './product-dialog.component.html',
    styleUrls: ['../../../../assets/user.styles.scss']
})
export class ProductDialogComponent implements OnInit {
    env = environment;

    isLoading: boolean = true;
    product!: Product;

    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig
    ) {}

    ngOnInit() {
        this.product = this.config.data;
    }

    addToCart(data: Product) {
        this.ref.close(data);
    }
}
