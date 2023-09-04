import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppMainComponent } from 'src/app/layout/app.main.component';
import SharedUtil from 'src/app/lib/shared.util';
import { Product, ProductOptions, ProductOptionValues } from './../../../interface/product';
import { capitalize } from './../../../lib/shared.util';
import { CartService } from './../../../service/cart.service';
import { SharedService } from './../../../service/shared.service';

@Component({
    selector: 'app-order-dialog',
    templateUrl: './order-dialog.component.html',
    styleUrls: ['../../../../assets/user.styles.scss']
})
export class OrderDialogComponent extends SharedUtil implements OnInit {
    @Output() onChange = new EventEmitter<boolean>();
    @Input() selectedProduct: Product;
    @Input() showDialog: boolean;

    orderForm: FormGroup;
    productPrice: number = 0;
    addonPrice: number = 0;

    constructor(
        public app: AppMainComponent,
        private router: Router,
        private formBuilder: FormBuilder,
        private cartService: CartService,
        private sharedService: SharedService
    ) {
        super();
        // this.orderForm = this.formBuilder.group({
        //     // categoryId: [{ value: null, disabled: true }],
        //     tableId: [{ value: null, disabled: true }, [Validators.required]],
        //     notes: ['', [Validators.maxLength(255)]],
        //     listProduct: this.formBuilder.array([])
        // });

        this.orderForm = this.formBuilder.group({
            id: [null, []],
            image: [null, []],
            name: ['', [Validators.required]],
            code: ['', []],
            categoryId: [null, []],
            description: ['', []],
            price: [0, [Validators.required]],
            options: this.formBuilder.array([]),

            notes: ['', []],
            qty: [1, []]
        });

        // this.orderForm.valueChanges.subscribe((data: Product) => {
        //     // const productPrice = this.orderForm.get("price").value
        //     console.log(data);
        // });

        this.orderForm.get('qty').valueChanges.subscribe((qty: number) => {
            this.productPrice = this.orderForm.get('price').value * qty;
        });

        this.orderForm.get('options').valueChanges.subscribe((options: ProductOptions[]) => {
            let price = 0;
            options.forEach((option) => {
                option.values.forEach((data) => {
                    price += data.selected ? data.price : 0;
                });
            });
            this.addonPrice = price;
        });
    }

    ngOnInit(): void {
        for (let i = 0; i < this.selectedProduct?.options.length; i++) {
            this.addOption();
            this.selectedProduct.options[i]?.values.forEach(() => this.addOptionValues(i));
        }
        this.orderForm.patchValue(this.selectedProduct);
        console.log(this.orderForm.value);
    }

    getOptionValuePrice(option: ProductOptionValues) {
        if (this.isEmpty(option.price)) return 'Free';
        // else
    }

    options(): FormArray {
        return this.orderForm.get('options') as FormArray;
    }

    addOption() {
        this.options().push(
            this.formBuilder.group({
                name: ['', [Validators.required]],
                multiple: [false, [Validators.required]],
                required: [false, [Validators.required]],
                values: this.formBuilder.array([])
            })
        );
    }

    optionValues(optionIndex: number): FormArray {
        return this.options().at(optionIndex).get('values') as FormArray;
    }

    addOptionValues(optionIndex: number) {
        this.optionValues(optionIndex).push(
            this.formBuilder.group({
                value: ['', [Validators.required]],
                price: [null, [Validators.required]],
                selected: [false, [Validators.required]]
            })
        );
    }

    increment() {
        this.orderForm.get('qty').setValue(this.orderForm.get('qty').value + 1);
    }

    decrement() {
        this.orderForm.get('qty').setValue(this.orderForm.get('qty').value - 1);
    }

    onClickWa() {
        let url =
            'https://api.whatsapp.com/send?phone=6287798992777&text=Halo,%20saya%20ingin%20menanyakan%20tentang%20';
        window.open(url + capitalize(this.selectedProduct.name) + '.', '_blank');
    }

    insertToCart() {
        // this.sharedService.showConfirm().then((res) => {
        //     if (res) {
        this.cartService.addToCart(this.selectedProduct);
        this.hideDialog();
        // }
        // });
    }

    getSidebarStyle() {
        return {
            width: this.app.isDesktop() ? '50vw' : '100vw',
            left: this.app.isDesktop() ? 'unset' : 0
        };
    }

    hideDialog() {
        this.onChange.emit((this.showDialog = false));
    }

    resetForm() {
        this.orderForm.reset();
    }

    // @HostListener('window:scroll')
    // onWindowScroll() {
    //     const offset = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    //     console.log(offset);
    // }
}
