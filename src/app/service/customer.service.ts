import { Order, ProductOrder } from 'src/app/interface/order';
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { SharedService } from './shared.service';
import { BehaviorSubject } from 'rxjs';
import { Customer } from '../interface/customer';
import { jsonParse, jsonStringify } from '../lib/utils';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private _customer = new BehaviorSubject<Customer>({} as Customer);
  customer$ = this._customer.asObservable();

  private _cart = new BehaviorSubject<ProductOrder[]>([]);
  cart$ = this._cart.asObservable();

  private _orders = new BehaviorSubject<Order[]>([]);
  orders$ = this._orders.asObservable();

  constructor(
    private sharedService: SharedService,
    private apiService: ApiService
  ) {
    this.load();
  }

  load() {
    this.customer = jsonParse<Customer>(localStorage.getItem('customer'));
    this.cart = jsonParse<ProductOrder[]>(localStorage.getItem('cart')) ?? [];

    if (this.isCustomer) this.loadOrders();
  }

  loadOrders() {
    if (!this.customer.listOrderId?.length) return;
    return this.apiService
      .getOrders({
        limit: 100,
        condition: [
          { column: 'is_served', value: false },
          { column: 'id', value: this.customer.listOrderId },
        ],
      })
      .subscribe((res) => {
        this.orders = res.data;
      });
  }

  addToCart(value: ProductOrder) {
    const data = [...this.cart, value];
    data.forEach((v) => {
      v.options = v.options
        .map((v) => ({
          ...v,
          values: v.values.filter((v) => v.selected),
        }))
        .filter((v) => v.values.length > 0);
    });
    this.cart = data;
  }

  clearCart() {
    this.cart = [];
  }

  get isCustomer() {
    return !!this.customer?.table?.id;
  }

  get customer() {
    return this._customer.getValue();
  }

  get cart() {
    return this._cart.getValue();
  }

  get orders() {
    return this._orders.getValue();
  }

  set customer(data: Customer) {
    if (data.table?.id && !data.table?.name) {
      this.apiService.findTableById(data.table.id).subscribe((res) => {
        console.log('data', data);
        const value: Customer = { ...data, table: res.data };
        localStorage.setItem('customer', jsonStringify(value));
        this._customer.next(value);
      });
    } else {
      console.log('data', data);
      localStorage.setItem('customer', jsonStringify(data));
      this._customer.next(data);
    }
  }

  set cart(data: ProductOrder[]) {
    localStorage.setItem('cart', jsonStringify(data));
    this._cart.next(data);
  }

  set orders(data: Order[]) {
    this._orders.next(data);
  }

  // set customer(customer: Customer) {}
  // set orders(orders: Order[]) {}
  // set orders(orders: Order[]) {}

  // getOrders(): Order {
  //   const data = jsonParse(localStorage.getItem('order')) as Order;
  //   if (!isEmpty(data)) this.order = data;
  //   return this.order;
  //   // SHOULD BE DB!!
  // }

  // getMyOrders(): Order {
  //   const data = jsonParse(localStorage.getItem('order')) as Order;
  //   if (!isEmpty(data)) this.order = data;
  //   return this.order;
  // }

  // setMyOrders(order: Order) {
  //   localStorage.setItem('order', jsonStringify(order));
  // }

  // finishOrder(totalPrice: number) {
  //   localStorage.setItem(
  //     'order',
  //     jsonStringify({
  //       products: this.getCart(),
  //       tableId: this.getCustomerInfo().tableId,
  //       totalPrice: totalPrice,
  //       createdAt: new Date(),
  //     } as Order)
  //   );
  //   this.clearCart();
  // }

  // createOrder(order: Order) {
  //   this.getCustomerInfo();
  //   order = {
  //     ...order,
  //     tableId: this.customerInfo.tableId,
  //     createdAt: new Date(),
  //   };
  //   this.setCart(order.products);
  //   this.setMyOrders(order);
  //   return this.apiService.createOrder(order);
  // }

  // async generateOrderReceipt(order: OrderReceipt): Promise<OrderReceipt> {
  //   return new Promise((resolve) => {
  //     order.changes = order.receivedAmount - order.total;
  //     resolve(order);
  //   });
  // }

  // getCustomerInfo(): CustomerInfo {
  //   const data: CustomerInfo = jsonParse(localStorage.getItem('customer')) as CustomerInfo;
  //   if (!isEmpty(data)) this.customerInfo = data;
  //   else this.customerInfo = null;
  //   return this.customerInfo;
  // }

  // setCustomerInfo(data: CustomerInfo) {
  //   localStorage.setItem('customer', jsonStringify(data));
  // }

  // clearCart() {
  //   localStorage.removeItem('cart');
  // }

  // getCart(): Product[] {
  //   const data = jsonParse(localStorage.getItem('cart')) as Product[];
  //   if (!isEmpty(data)) this.cart = data;
  //   return this.cart;
  // }

  // setCart(products: Product[]) {
  //   localStorage.setItem('cart', jsonStringify(products));
  // }

  // addToCart(product: Product) {
  //   this.getCart();
  //   this.getCustomerInfo();
  //   this.cart.push(this.filterProductOptions(product));

  //   localStorage.setItem('cart', jsonStringify(this.cart));
  //   localStorage.setItem('customer', jsonStringify(this.customerInfo));

  //   this.sharedService.showNotification('The item is successfully added to cart!');
  // }

  // filterProductOptions(product: Product) {
  //   for (let i = product.options.length - 1; i >= 0; i--) {
  //     for (let j = product.options[i].values.length - 1; j >= 0; j--) {
  //       if (!product.options[i].values[j].selected) {
  //         product.options[i].values.splice(j, 1);
  //       }
  //     }
  //     if (product.options[i].values.length === 0) product.options.splice(i, 1);
  //   }
  //   return product;
  // }
}
