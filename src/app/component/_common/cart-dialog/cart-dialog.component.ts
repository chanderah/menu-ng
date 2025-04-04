import { CustomCurrencyPipe } from './../../../pipe/currency.pipe';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppMainComponent } from 'src/app/layout/app.main.component';
import SharedUtil from 'src/app/lib/shared.util';
import { disableBodyScroll, enableBodyScroll } from 'src/app/lib/utils';
import { ApiService } from '../../../service/api.service';
import { OrderService } from '../../../service/order.service';
import { SharedService } from '../../../service/shared.service';
import { CustomerService } from 'src/app/service/customer.service';
import { ProductOptionValue } from 'src/app/interface/product';
import { ProductOrder } from 'src/app/interface/order';

@Component({
  selector: 'app-cart-dialog',
  templateUrl: './cart-dialog.component.html',
  styleUrls: ['../../../../assets/user.styles.scss'],
})
export class CartDialogComponent extends SharedUtil implements OnInit {
  @Output() onShowCartDialogChange = new EventEmitter<boolean>();
  @Input() showDialog: boolean;

  init: boolean = true;
  isLoading: boolean = true;

  form: FormGroup;

  constructor(
    public app: AppMainComponent,
    private router: Router,
    private fb: FormBuilder,
    private orderService: OrderService,
    private sharedService: SharedService,
    private apiService: ApiService,
    private customerService: CustomerService,
    private customCurrencyPipe: CustomCurrencyPipe
  ) {
    super();
  }

  ngOnInit(): void {
    disableBodyScroll();

    // this.products().valueChanges.subscribe((products: Product[]) => {
    //   if (!this.init) {
    //     // count total
    //     let totalPrice = 0;

    //     products.forEach((product) => {
    //       let price = product.price;
    //       product?.options?.forEach((option) => {
    //         option?.values?.forEach((data) => {
    //           if (data?.selected) price += data?.price;
    //         });
    //       });
    //       totalPrice += price * product.quantity;
    //     });
    //     this.form.get('totalPrice').setValue(totalPrice);
    //   }
    // });

    this.setForm();
  }

  increment(i: number) {
    const value = this.product(i).get('quantity').value;
    this.product(i).get('quantity').setValue(value + 1); // prettier-ignore
  }

  decrement(i: number) {
    const value = this.product(i).get('quantity').value;
    this.product(i).get('quantity').setValue(value - 1 || 1); // prettier-ignore
  }

  onSubmit() {
    if (this.isDisabledBtn) return;

    this.isLoading = true;

    // transaction_details: {
    //   gross_amount: 123500,
    //   order_id: `ORDER-${new Date().getTime()}`,
    // },
    // customer_details: {
    //   first_name: 'Chandra',
    //   last_name: 'Sukmagalih Arifin',
    //   phone: '087798992777',
    // },

    console.log('this.form.value', this.form.value);
    // this.orderService.createOrder(this.form.value).subscribe((res) => {
    //   this.isLoading = false;
    //   if (res.status === 200) {
    //     this.app.hideTopMenu();
    //     this.showDialog = false;
    //     this.router.navigate(['/order-complete'], {
    //       state: {
    //         totalPrice: this.form.get('totalPrice').value,
    //       },
    //     });
    //   } else this.sharedService.showErrorNotification();
    // });
  }

  // FORMS
  setForm() {
    this.form = this.fb.group({
      id: [null],
      orderCode: [null],
      tableId: [this.customerService.customer.tableId, [Validators.required]],
      totalPrice: [0, [Validators.required, Validators.min(1)]],
      products: this.fb.array([]),
      notes: [''],
      createdAt: [null, []],
      status: [true],
    });

    this.customerService.cart.forEach(() => this.addProduct());

    this.products().valueChanges.subscribe((v: ProductOrder[]) => {
      // 1. calculate product total price -> product.price * product.quantity
      // 2. calculate order total price -> sum product.totalPrice

      let orderTotalPrice = 0;
      v.forEach((v, i) => {
        let productTotalPrice = this.getProductTotalPrice(v);
        orderTotalPrice += productTotalPrice;
        this.product(i).get('totalPrice').setValue(productTotalPrice, { emitEvent: false });
      });
      this.form.get('totalPrice').setValue(orderTotalPrice, { emitEvent: false });

      // clo
    });

    this.products().patchValue(this.customerService.cart);
  }

  products() {
    return this.form.get('products') as FormArray;
  }

  product(i: number) {
    return this.products().at(i);
  }

  addProduct() {
    this.products().push(
      this.fb.group({
        id: [0],
        image: [''],
        code: [''],
        name: [''],
        categoryId: [0],
        price: [0],
        options: [[]],

        notes: [''],
        quantity: [1, [Validators.required, Validators.min(1)]],
        totalPrice: [0, [Validators.required, Validators.min(1)]],
      })
    );
  }

  removeProduct(i: number) {
    this.sharedService.showConfirm('Are you sure to remove this item from cart?').then((res) => {
      if (res) {
        this.products().removeAt(i);
        if (this.products().length === 0) this.hideDialog();
      }
    });
  }

  getProductTotalPrice(data: ProductOrder) {
    let productTotalPrice = data.price;
    data.options.forEach((v) => {
      v.values.forEach((v) => {
        productTotalPrice += v.price;
      });
    });
    return productTotalPrice * data.quantity;
  }

  getOptionValues(data: ProductOptionValue[]) {
    return data.map((v) => `${v.value} (${this.customCurrencyPipe.transform(v.price.toString())})`).join(', ');
  }

  // options(i: number) {
  //   return this.product(i).get('options') as FormArray;
  // }

  // addOption(i: number, data: ProductOption) {
  //   this.options(i).push(
  //     this.fb.group({
  //       name: [''],
  //       multiple: [false],
  //       required: [false],
  //       values: this.fb.array([]),
  //     })
  //   );

  //   const index = this.options(i).length - 1;
  //   data.values.forEach(() => this.addOptionValue(index));
  // }

  // optionValues(i: number) {
  //   return this.options().at(i).get('values') as FormArray;
  // }

  // addOptionValue(i: number) {
  //   this.optionValues(i).push(
  //     this.fb.group({
  //       value: [''],
  //       price: [0],
  //       selected: [false],
  //     })
  //   );
  // }

  get isDisabledBtn() {
    // const productOrder = this.form.value as ProductOrder;
    // productOrder.options.forEach((option) => {
    //   if (option.required) {
    //     const selectedOption = option.values.filter((v) => v.selected);
    //     if (!selectedOption.length) return true;
    //   }
    // });

    if (this.isLoading) return true;
    return false;
  }

  // increment(productIndex: number) {
  //   const { value } = this.products().at(productIndex).get('quantity');
  //   this.products().at(productIndex).get('quantity').setValue(value + 1); // prettier-ignore
  // }

  // decrement(productIndex: number) {
  //   let currentValue = this.products().at(productIndex).get('quantity').value;
  //   if (currentValue > 1) {
  //     this.products()
  //       .at(productIndex)
  //       .get('quantity')
  //       .setValue(currentValue - 1);
  //   } else {
  //     this.sharedService.showConfirm('Are you sure to remove this item from cart?').then((res) => {
  //       if (res) return this.deleteProduct(productIndex);
  //     });
  //   }
  // }

  // products(): FormArray {
  //   return this.form.get('products') as FormArray;
  // }

  // options(productIndex: number): FormArray {
  //   return this.products().at(productIndex).get('options') as FormArray;
  // }

  // optionValues(productIndex: number, optionIndex: number): FormArray {
  //   return this.options(productIndex).at(optionIndex).get('values') as FormArray;
  // }

  // addProduct() {
  //   this.products().push(
  //     this.fb.group({
  //       id: [null, []],
  //       image: [null, []],
  //       name: ['', [Validators.required]],
  //       code: ['', []],
  //       categoryId: [null, []],
  //       description: ['', []],
  //       price: [0, [Validators.required]],
  //       options: this.fb.array([]),
  //       totalPrice: [0, [Validators.required]],

  //       notes: ['', []],
  //       quantity: [0, []],
  //     })
  //   );
  // }

  // addOption(productIndex: number) {
  //   this.options(productIndex).push(
  //     this.fb.group({
  //       name: ['', [Validators.required]],
  //       multiple: [false, [Validators.required]],
  //       required: [false, [Validators.required]],
  //       values: this.fb.array([]),
  //     })
  //   );
  // }

  // addOptionValues(productIndex: number, optionIndex: number) {
  //   this.optionValues(productIndex, optionIndex).push(
  //     this.fb.group({
  //       value: ['', [Validators.required]],
  //       price: [null, [Validators.required]],
  //       selected: [false, [Validators.required]],
  //     })
  //   );
  // }

  concatOptionValues(productOptionValues: ProductOptionValue[]) {
    return 'wi';
    // if (productOptionValues.length === 1) return productOptionValues[0].value.toString();
    // let value: string = productOptionValues[0].value;
    // for (let i = 1; i < productOptionValues.length; i++) {
    //   value.concat(', ' + productOptionValues[i].value);
    // }
    // return value;
  }

  hideDialog() {
    enableBodyScroll();
    this.customerService.cart = this.products().value;
    this.onShowCartDialogChange.emit(false);
  }

  getSidebarStyle() {
    return {
      width: this.app.isDesktop() ? '50vw' : '100vw',
      height: 'auto',
      left: this.app.isDesktop() ? '25vw' : 0,
      overflow: 'scroll',
    };
  }
}
