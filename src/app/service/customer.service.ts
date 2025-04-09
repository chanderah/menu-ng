import { Order, ProductOrder } from 'src/app/interface/order';
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { BehaviorSubject, of, tap } from 'rxjs';
import { Customer } from '../interface/customer';
import { StorageService } from '../storage.service';
import { ApiResponse } from '../interface/api';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private _customer = new BehaviorSubject<Customer>(this.storageService.getWithExpiry('customer', {}));
  customer$ = this._customer.asObservable();

  private _cart = new BehaviorSubject<ProductOrder[]>(this.storageService.getWithExpiry('cart', []));
  cart$ = this._cart.asObservable();

  private _orders = new BehaviorSubject<Order[]>([]);
  orders$ = this._orders.asObservable();

  constructor(
    private apiService: ApiService,
    private storageService: StorageService
  ) {
    this.loadOrders().subscribe();
  }

  loadOrders() {
    if (!this.isCustomer || !this.customer?.listOrderId?.length) {
      this.orders = [];
      return of({ data: [] } as ApiResponse<Order[]>);
    }

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
    this.storageService.setWithExpiry('customer', data);
    this._customer.next(data);
  }

  set cart(data: ProductOrder[]) {
    this.storageService.setWithExpiry('cart', data);
    this._cart.next(data);
  }

  set orders(data: Order[]) {
    this._orders.next(data);
  }
}
