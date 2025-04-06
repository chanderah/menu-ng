import { Order, ProductOrder } from 'src/app/interface/order';
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { BehaviorSubject, tap } from 'rxjs';
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

  constructor(private apiService: ApiService) {
    this.load();
  }

  load() {
    this.cart = jsonParse<ProductOrder[]>(localStorage.getItem('cart')) ?? [];
    this.customer = jsonParse<Customer>(localStorage.getItem('customer'));
    if (this.isCustomer) this.loadOrders()?.subscribe();
  }

  loadOrders() {
    if (!this.customer?.listOrderId?.length) return;
    return this.apiService
      .getOrders({
        limit: 100,
        condition: [
          // { column: 'is_served', value: false },
          { column: 'id', value: this.customer.listOrderId },
        ],
        sortField: 'created_at',
        sortOrder: 'DESC',
      })
      .pipe(tap((res) => (this.orders = res.data)));
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
    return !!this.customer?.tableId;
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

  set customer(value: Customer) {
    const data: Customer = {
      ...value,
      listOrderId: value?.listOrderId ?? [],
    };

    localStorage.setItem('customer', jsonStringify(data));
    this._customer.next(data);
  }

  set cart(data: ProductOrder[]) {
    localStorage.setItem('cart', jsonStringify(data));
    this._cart.next(data);
  }

  set orders(data: Order[]) {
    this._orders.next(data);
  }
}
