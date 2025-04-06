import { MidtransService } from './../../../service/midtrans.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { interval, startWith, Subscription, switchMap } from 'rxjs';
import { SnapResponse } from 'src/app/interface/midtrans';
import { Order } from 'src/app/interface/order';
import SharedUtil from 'src/app/lib/shared.util';
import { enableBodyScroll } from 'src/app/lib/utils';
import { ApiService } from 'src/app/service/api.service';
import { CustomerService } from 'src/app/service/customer.service';
import { SharedService } from 'src/app/service/shared.service';

interface OrderState {
  isSuccess: boolean;
  response: SnapResponse;
  order: Order;
}

@Component({
  selector: 'app-order-customer',
  templateUrl: './order-customer.component.html',
  styleUrls: ['./order-customer.component.scss'],
})
export class OrderCustomerComponent extends SharedUtil implements OnInit, OnDestroy {
  isLoading: boolean = true;
  isPolling: boolean = false;

  state!: OrderState;
  subscription!: Subscription;

  constructor(
    private router: Router,
    private midtransService: MidtransService,
    private apiService: ApiService,
    private sharedService: SharedService,
    public customerService: CustomerService
  ) {
    super();
    // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.state = this.router.getCurrentNavigation()?.extras?.state as OrderState;
  }

  ngOnInit(): void {
    enableBodyScroll();

    if (!this.state?.order) return this.getOrders();

    this.customerService.customer = {
      ...this.customerService.customer,
      listOrderId: [...this.customerService.customer.listOrderId, this.state.order.id],
    };

    this.customerService.clearCart();
    if (this.state.isSuccess) this.startPolling();
    else {
      if (this.state.response) this.sharedService.showErrorNotification();
      this.getOrders();
    }
  }

  getOrders() {
    this.isLoading = true;
    this.customerService.loadOrders().subscribe(() => {
      this.isLoading = false;
    });
  }

  startPolling() {
    this.subscription = interval(3000)
      .pipe(
        startWith(),
        switchMap(() => this.apiService.getOrderById(this.state.order.id))
      )
      .subscribe((res) => {
        const isPending = res.data.status === 'pending';
        if (isPending) {
          // keep pooling
        } else {
          this.isLoading = false;
          this.subscription?.unsubscribe();
          this.getOrders();

          console.log('res.data', res.data);
          alert(`Your last transaction status is: ${res.data.status}`);
        }
      });
  }

  stopPolling() {
    console.log('stop polling');
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
