import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppMainComponent } from 'src/app/layout/app.main.component';
import SharedUtil from 'src/app/lib/shared.util';
import { Product } from '../../../interface/product';
import { capitalize, disableBodyScroll } from '../../../lib/shared.util';
import { OrderService } from '../../../service/order.service';
import { SharedService } from '../../../service/shared.service';

@Component({
    selector: 'app-order-dialog',
    templateUrl: './order-dialog.component.html',
    styleUrls: ['../../../../assets/user.styles.scss']
})
export class OrderDialogComponent extends SharedUtil implements OnInit {
    @Output() onChange = new EventEmitter<boolean>();
    @Input() selectedProduct: Product;
    @Input() showDialog: boolean;

    init: boolean = true;

    orderForm: FormGroup;
    totalPrice: number = 0;

    constructor(
        public app: AppMainComponent,
        private router: Router,
        private formBuilder: FormBuilder,
        private orderService: OrderService,
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
            quantity: [0, []]
        });

        this.orderForm.valueChanges.subscribe((product: Product) => {
            if (!this.init) {
                // count total
                let price = product.price;
                product.options.forEach((option) => {
                    option.values.forEach((data) => {
                        if (data.selected) price += data.price;
                    });
                });
                this.totalPrice = price * product.quantity;
            }
        });
    }

    ngOnInit(): void {
        disableBodyScroll();
        for (let i = 0; i < this.selectedProduct?.options.length; i++) {
            this.addOption();
            this.selectedProduct.options[i]?.values.forEach(() => this.addOptionValues(i));
        }
        this.orderForm.patchValue(this.selectedProduct);
        console.log(this.orderForm.value);

        this.init = false;
        this.orderForm.get('quantity').setValue(1);
    }

    onClickOptionValuesRow(optionIndex: number, optionValuesIndex: number) {
        this.optionValues(optionIndex)
            .at(optionValuesIndex)
            .get('selected')
            .setValue(!this.optionValues(optionIndex).at(optionValuesIndex).get('selected').value);
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
        this.orderForm.get('quantity').setValue(this.orderForm.get('quantity').value + 1);
    }

    decrement() {
        this.orderForm.get('quantity').setValue(this.orderForm.get('quantity').value - 1);
    }

    onClickWa() {
        let url =
            'https://api.whatsapp.com/send?phone=6287798992777&text=Halo,%20saya%20ingin%20menanyakan%20tentang%20';
        window.open(url + capitalize(this.selectedProduct.name) + '.', '_blank');
    }

    onAddToCart() {
        if (!this.validate(this.orderForm.value)) return;
        this.orderService.addToCart({
            ...this.orderForm.value,
            totalPrice: this.totalPrice
        });
        this.hideDialog();
    }

    validate(product: Product) {
        let result: boolean = true;
        product.options.forEach((option) => {
            let selectedOption = 0;
            option.values.forEach((value) => {
                if (value.selected) selectedOption++;
            });

            if (option.required && selectedOption === 0) {
                this.sharedService.errorToast('Please select the required variant.');
                result = false;
            }
        });
        return result;
    }

    getSidebarStyle() {
        return {
            width: this.app.isDesktop() ? '50vw' : '100vw',
            height: 'auto',
            left: this.app.isDesktop() ? 'unset' : 0,
            overflow: 'scroll'
        };
    }

    hideDialog() {
        this.onChange.emit((this.showDialog = false));
    }

    resetForm() {
        this.orderForm.reset();
    }

    ngOnDestroy() {
        this.onChange.unsubscribe();
    }

    // @HostListener('window:scroll')
    // onWindowScroll() {
    //     const offset = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    //     console.log(offset);
    // }
}
