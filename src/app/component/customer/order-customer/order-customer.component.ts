import { MidtransService } from './../../../service/midtrans.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { interval, startWith, Subscription, switchMap } from 'rxjs';
import { Order } from 'src/app/interface/order';
import { ApiService } from 'src/app/service/api.service';
import { CustomerService } from 'src/app/service/customer.service';
import { OrderService } from 'src/app/service/order.service';
import { SharedService } from 'src/app/service/shared.service';

interface OrderState {
  isCheckout: boolean;
  order: Order;
}

@Component({
  selector: 'app-order-customer',
  templateUrl: './order-customer.component.html',
  styleUrls: ['./order-customer.component.scss'],
})
export class OrderCustomerComponent implements OnInit, OnDestroy {
  isLoading: boolean = true;
  isPolling: boolean = false;
  state!: OrderState;

  subscription!: Subscription;

  constructor(
    // private app: AppComponent,
    private router: Router,
    private midtransService: MidtransService,
    private customerService: CustomerService,
    private orderService: OrderService,
    private apiService: ApiService,
    private sharedService: SharedService
  ) {
    // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.state = router.getCurrentNavigation()?.extras?.state as OrderState;
    console.log('state', this.state);
  }

  ngOnInit(): void {
    if (this.state?.isCheckout) {
      this.customerService.customer = {
        ...this.customerService.customer,
        listOrderId: [...this.customerService.customer.listOrderId, this.state.order.id],
      };

      this.customerService.clearCart();
      this.processCheckout();
    } else {
      this.customerService.loadOrders();
    }
  }

  async processCheckout() {
    const res = await this.midtransService.showSnapTransaction(this.state.order.token);
    const isCancelled = !res.response;
    if (res.isSuccess) {
      this.startPolling();
    } else {
      if (!isCancelled) this.sharedService.showErrorNotification();
      this.customerService.loadOrders();
    }
  }

  startPolling() {
    this.customerService.loadOrders();
    this.subscription = interval(3000)
      .pipe(
        startWith(0),
        switchMap(() => this.apiService.getOrderById(this.state.order.id))
      )
      .subscribe((res) => {
        const isPending = res.data.status === 'pending';
        if (isPending) {
          // keep pooling
        } else {
          this.isLoading = false;
          this.subscription?.unsubscribe();
          this.customerService.loadOrders();

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
