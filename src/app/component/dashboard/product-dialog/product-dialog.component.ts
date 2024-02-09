import { AfterViewInit, Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Product } from 'src/app/interface/product';
import SharedUtil from 'src/app/lib/shared.util';

@Component({
    templateUrl: './product-dialog.component.html',
    styleUrls: ['../../../../assets/user.styles.scss'],
    styles: [
        `
            .p-dialog-content {
                border-bottom-left-radius: 6px;
                border-bottom-right-radius: 6px;
            }
        `
    ]
})
export class ProductDialogComponent extends SharedUtil implements OnInit, AfterViewInit {
    isLoading: boolean = true;
    product!: Product;

    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig
    ) {
        super();
    }

    ngOnInit() {
        this.product = this.config.data;
    }

    ngAfterViewInit() {
        document.getElementsByClassName('p-dialog-content')[0].className += ' bottom-radius';
    }

    addToCart(data: Product) {
        this.ref.close(data);
    }
}
