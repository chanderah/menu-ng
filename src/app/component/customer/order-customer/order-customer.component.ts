import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { interval, startWith, Subscription, switchMap } from 'rxjs';
import { SnapResponse } from 'src/app/interface/midtrans';
import { Order } from 'src/app/interface/order';
import SharedUtil from 'src/app/lib/shared.util';
import { enableBodyScroll, filterUniqueArr } from 'src/app/lib/utils';
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
    private router: Router,
    private apiService: ApiService,
    private sharedService: SharedService
  ) {
    super();
    // this.router.routeReuseStrategy.shouldReuseRoute = (future) => {
    //   const targetUrl = future['_routerState'].url;
    //   const result = targetUrl !== '/order';
    //   return result;
    // };

    router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.state = this.router.getCurrentNavigation()?.extras?.state as OrderState;
  }
  
  ngOnInit(): void {
    enableBodyScroll();
    
    if (!this.state?.order) return this.getOrders();
    
    this.customerService.customer = {
      ...this.customerService.customer,
      listOrderId: filterUniqueArr([...this.customerService.customer.listOrderId, this.state.order.id]),
    };
    
    if (this.state.isSuccess) {
      this.startPolling();
    } else {
      this.getOrders();
      if (this.state.response && this.state.response.transaction_status !== 'pending') {
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
        this.stopPolling();
        this.getOrders();
        
        const isSuccess = ['settlement', 'capture'].includes(res.data.status);
        if (isSuccess) {
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
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }
}
