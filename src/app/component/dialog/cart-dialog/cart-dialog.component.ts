import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Product } from 'src/app/interface/product';
import { AppMainComponent } from 'src/app/layout/app.main.component';
import SharedUtil from 'src/app/lib/shared.util';
import { OrderService } from '../../../service/order.service';
import { ProductOptionValues } from './../../../interface/product';
import { disableBodyScroll } from './../../../lib/shared.util';
import { ApiService } from './../../../service/api.service';
import { SharedService } from './../../../service/shared.service';

@Component({
    selector: 'app-cart-dialog',
    templateUrl: './cart-dialog.component.html',
    styleUrls: ['../../../../assets/user.styles.scss']
})
export class CartDialogComponent extends SharedUtil implements OnInit {
    @Output() onChange = new EventEmitter<boolean>();
    @Input() showDialog: boolean;

    init: boolean = true;
    isLoading: boolean = true;

    cartForm: FormGroup;

    constructor(
        public app: AppMainComponent,
        private router: Router,
        private formBuilder: FormBuilder,
        private orderService: OrderService,
        private sharedService: SharedService,
        private apiService: ApiService
    ) {
        super();

        this.cartForm = formBuilder.group({
            id: [null, []],
            tableId: [null, []],
            totalPrice: [0, []],
            products: this.formBuilder.array([]),
            createdAt: [null, []]
        });

        this.products().valueChanges.subscribe((products: Product[]) => {
            if (!this.init) {
                // count total
                let totalPrice = 0;

                products.forEach((product) => {
                    let price = product.price;
                    product?.options?.forEach((option) => {
                        option?.values?.forEach((data) => {
                            if (data?.selected) price += data?.price;
                        });
                    });
                    totalPrice += price * product.qty;
                });
                this.cartForm.get('totalPrice').setValue(totalPrice);
            }
        });
    }

    ngOnInit(): void {
        disableBodyScroll();
        this.getProductsInCart();
        console.log(this.cartForm.value);
    }

    getProductsInCart() {
        const data: Product[] = this.orderService.getCart();
        for (let i = 0; i < data.length; i++) {
            this.addProduct();
            for (let j = 0; j < data[i].options.length; j++) {
                this.addOption(i);
                for (let k = 0; k < data[i].options[j].values.length; k++) {
                    this.addOptionValues(i, j);
                }
            }
        }
        this.init = false;
        this.products().patchValue(data);
    }

    onCheckout() {
        this.isLoading = true;
        this.orderService.createOrder(this.cartForm.value).then((res: any) => {
            this.isLoading = false;
            if (res.status === 200) {
                this.showDialog = false;
                this.sharedService.showNotification(
                    'Order is placed! Please kindly wait while we are processing your request! :)'
                );
            } else {
                this.sharedService.showErrorNotification();
            }
        });
    }

    increment(productIndex: number) {
        this.products()
            .at(productIndex)
            .get('qty')
            .setValue(this.products().at(productIndex).get('qty').value + 1);
    }

    decrement(productIndex: number) {
        let currentValue = this.products().at(productIndex).get('qty').value;
        if (currentValue > 1) {
            this.products()
                .at(productIndex)
                .get('qty')
                .setValue(currentValue - 1);
        } else {
            this.sharedService.showConfirm('Are you sure to remove this item from cart?').then((res) => {
                if (res) return this.deleteProduct(productIndex);
            });
        }
    }

    getSidebarStyle() {
        return {
            width: this.app.isDesktop() ? '50vw' : '100vw',
            height: 'auto',
            left: this.app.isDesktop() ? 'unset' : 0,
            overflow: 'scroll'
        };
    }

    products(): FormArray {
        return this.cartForm.get('products') as FormArray;
    }

    options(productIndex: number): FormArray {
        return this.products().at(productIndex).get('options') as FormArray;
    }

    optionValues(productIndex: number, optionIndex: number): FormArray {
        return this.options(productIndex).at(optionIndex).get('values') as FormArray;
    }

    deleteProduct(productIndex: number) {
        this.init = true;
        this.products().removeAt(productIndex);
        this.orderService.setCart(this.products().value);
        console.log([this.products().value]);
        if (this.products().length === 0) this.hideDialog();
    }

    addProduct() {
        this.products().push(
            this.formBuilder.group({
                id: [null, []],
                image: [null, []],
                name: ['', [Validators.required]],
                code: ['', []],
                categoryId: [null, []],
                description: ['', []],
                price: [0, [Validators.required]],
                options: this.formBuilder.array([]),
                totalPrice: [0, [Validators.required]],

                notes: ['', []],
                qty: [0, []]
            })
        );
    }

    addOption(productIndex: number) {
        this.options(productIndex).push(
            this.formBuilder.group({
                name: ['', [Validators.required]],
                multiple: [false, [Validators.required]],
                required: [false, [Validators.required]],
                values: this.formBuilder.array([])
            })
        );
    }

    addOptionValues(productIndex: number, optionIndex: number) {
        this.optionValues(productIndex, optionIndex).push(
            this.formBuilder.group({
                value: ['', [Validators.required]],
                price: [null, [Validators.required]],
                selected: [false, [Validators.required]]
            })
        );
    }

    concatOptionValues(productOptionValues: ProductOptionValues[]) {
        if (productOptionValues.length === 1) return productOptionValues[0].value.toString();
        let value: string = productOptionValues[0].value;
        for (let i = 1; i < productOptionValues.length; i++) {
            value.concat(', ' + productOptionValues[i].value);
        }
        return value;
    }

    hideDialog() {
        this.onChange.emit((this.showDialog = false));
    }

    ngOnDestroy() {
        this.onChange.unsubscribe();
    }
}
