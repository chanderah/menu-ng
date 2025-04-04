import { MidtransService } from './../../../service/midtrans.service';
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
import { interval, switchMap } from 'rxjs';

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
    private midtransService: MidtransService,
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

    this.setForm();
    this.customerService.cart.forEach(() => this.addProduct());
    this.products().valueChanges.subscribe((v: ProductOrder[]) => {
      let orderTotalPrice = 0; // calculate order total price -> sum product.totalPrice
      v.forEach((v, i) => {
        let productTotalPrice = this.getProductTotalPrice(v); // calculate product total price -> product.price * product.quantity
        orderTotalPrice += productTotalPrice;
        this.product(i).get('totalPrice').setValue(productTotalPrice, { emitEvent: false });
      });
      this.form.get('totalPrice').setValue(orderTotalPrice, { emitEvent: false });
    });

    this.products().patchValue(this.customerService.cart);
  }

  increment(i: number) {
    const value = this.product(i).get('quantity').value;
    this.product(i).get('quantity').setValue(value + 1); // prettier-ignore
  }

  decrement(i: number) {
    const value = this.product(i).get('quantity').value;
    this.product(i).get('quantity').setValue(value - 1 || 1); // prettier-ignore
  }

  async onSubmit() {
    if (this.midtransService.transaction.isLoading) return;
    const isSuccess = await this.orderService.createOrder(this.form.value);
    if (isSuccess) {
      // start polling

      const orderId = this.midtransService.transaction.response.order_id;
      interval(3000)
        .pipe(switchMap(() => this.apiService.getOrderByCode(orderId)))
        .subscribe((res) => {
          if (res.data.status === 'paid') {
            this.midtransService.transaction.isLoading = false;
            alert('SUCCESS!!');
          }
        });
    }
  }

  // FORMS
  setForm() {
    this.form = this.fb.group({
      id: [null],
      orderCode: [null],
      table: [this.customerService.customer.table.name, [Validators.required]],
      totalPrice: [0, [Validators.required, Validators.min(1)]],
      products: this.fb.array([]),
      notes: [''],
      token: [''],
      status: ['pending_payment'],
      createdAt: [null, []],
    });
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

  hideDialog() {
    enableBodyScroll();
    this.customerService.cart = this.products().value;
    this.onShowCartDialogChange.emit(false);
  }
}
