import { PaymentType } from './../../../../interface/order';
import { MidtransService } from '../../../../service/midtrans.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppMainComponent } from 'src/app/layout/app.main.component';
import SharedUtil from 'src/app/lib/shared.util';
import { ApiService } from '../../../../service/api.service';
import { SharedService } from '../../../../service/shared.service';
import { CustomerService } from 'src/app/service/customer.service';
import { ProductOptionValue } from 'src/app/interface/product';
import { Order, ProductOrder } from 'src/app/interface/order';
import { HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-order-dialog',
  templateUrl: './order-dialog.component.html',
  styleUrls: ['../../../../../assets/styles/user.styles.scss'],
})
export class OrderDialogComponent extends SharedUtil implements OnInit {
  @Output() onShowCartDialogChange = new EventEmitter<boolean>();
  @Input() showDialog: boolean;
  @Input() data?: Order;

  init: boolean = true;
  isLoading: boolean = true;
  isOrdered: boolean = false;

  form: FormGroup;

  constructor(
    public app: AppMainComponent,
    private router: Router,
    private fb: FormBuilder,
    private midtransService: MidtransService,
    private sharedService: SharedService,
    private apiService: ApiService,
    private customerService: CustomerService
  ) {
    super();
  }

  ngOnInit(): void {
    this.setForm();
    this.isOrdered = !!this.data;
    if (this.isOrdered) {
      // re-payment from order page
      this.data.products.forEach(() => this.addProduct());
      this.form.patchValue(this.data);
    } else {
      // checkout from cart
      this.getTableName();

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
  }

  getTableName() {
    this.apiService.findTableById(this.customerService.customer.tableId).subscribe((res) => {
      this.form.get('tableName').setValue(res.data.name);
    });
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
    if (this.isLoading || this.form.invalid) return;
    else if (this.isOrdered && this.data.status !== 'pending') return this.hideDialog();
    else if (this.sharedService.isLoggedIn) return this.sharedService.showNotification('Customer only!', '🙈');

    this.isLoading = true;
    this.apiService.createOrder(this.form.value).subscribe({
      next: async (res) => {
        this.isLoading = false;
        if (res.status === 200) {
          this.customerService.clearCart();

          const { isSuccess, response } = await this.midtransService.showSnapTransaction(res.data.token);
          this.router
            .navigateByUrl('/order', {
              state: {
                isSuccess,
                response,
                order: res.data,
              },
            })
            .then(() => {
              this.hideDialog(false);
            });
        } else if (res.status === HttpStatusCode.Gone) {
          this.sharedService.showNotification('This transaction is expired, please place your order again.', '🙈');
          this.customerService.loadOrders().subscribe();
        } else {
          this.sharedService.showErrorNotification();
        }
      },
      error: () => {
        this.isLoading = false;
        this.sharedService.showErrorNotification();
      },
    });
  }

  onClickWhatsapp() {
    const message = `Halo, saya ingin menanyakan tentang Order ID: ${this.form.value['orderCode']}.`.replace(' ', '%20');
    const url = `https://api.whatsapp.com/send?phone=${this.sharedService.whatsapp}&text=${message}`;
    window.open(url, '_blank');
  }

  // FORMS
  setForm() {
    this.form = this.fb.group({
      id: [null],
      orderCode: [null],
      tableName: ['', [Validators.required]],
      totalPrice: [0, [Validators.required, Validators.min(1)]],
      products: this.fb.array([]),
      notes: [''],
      token: [''],
      paymentType: [PaymentType.GATEWAY],
      status: [null],
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
    this.sharedService.showConfirm('Are you sure to remove this item from cart?', () => {
      this.products().removeAt(i);
      if (this.products().length === 0) this.hideDialog();
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
    return data.map((v) => v.value).join(', ');
  }

  hideDialog(saveCart: boolean = !this.isOrdered) {
    if (saveCart) this.customerService.cart = this.products().value;
    this.onShowCartDialogChange.emit(false);
  }
}
