import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { interval, startWith, Subscription, switchMap } from 'rxjs';
import { SnapResponse } from 'src/app/interface/midtrans';
import { Order } from 'src/app/interface/order';
import SharedUtil from 'src/app/lib/shared.util';
import { filterUniqueArr } from 'src/app/lib/utils';
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

  showOrderDialog: boolean = false;
  selectedOrder!: Order;

  state!: OrderState;
  subscription!: Subscription;

  constructor(
    public customerService: CustomerService,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private sharedService: SharedService
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.url.subscribe(() => {
      this.state = history.state;
      this.processOrder();
    });
  }

  processOrder() {
    if (!this.state?.order) return this.getOrders();
    this.customerService.customer = {
      ...this.customerService.customer,
      listOrderId: filterUniqueArr([...this.customerService.customer.listOrderId, this.state.order.id]),
    };

    if (this.state.isSuccess) {
      this.startPolling();
    } else {
      this.getOrders();
      if (this.state.response && !this.isOrderPending(this.state.response.transaction_status)) {
        this.sharedService.showErrorNotification();
      }
    }
  }

  getOrders() {
    this.isLoading = true;
    this.customerService.loadOrders().subscribe(() => {
      this.isLoading = false;
    });
  }

  onClickOrder(order: Order) {
    this.selectedOrder = order;
    this.showOrderDialog = true;
  }

  startPolling() {
    this.isLoading = true;

    this.stopPolling();
    this.subscription = interval(2000)
      .pipe(
        startWith(0),
        switchMap(() => this.apiService.getOrderById(this.state.order.id))
      )
      .subscribe((res) => {
        if (this.isOrderPending(res.data.status)) {
          // keep pooling
        } else {
          this.stopPolling();
          this.getOrders();

          if (this.isOrderPaid(res.data.status)) {
            this.sharedService.showNotification(`Your order is placed!`, '😘');
          } else {
            this.sharedService.showNotification(
              `We are sorry, your transaction is ${this.CONSTANTS.ORDER_STATUS[res.data.status] ?? 'failed'}`,
              '😢'
            );
          }
        }
      });
  }

  stopPolling() {
    this.subscription?.unsubscribe();
  }

  get isPolling() {
    return !!this.subscription && !this.subscription.closed;
  }

  ngOnDestroy(): void {
    this.stopPolling();
  }
}
