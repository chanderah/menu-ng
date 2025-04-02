import { AfterViewInit, ApplicationRef, Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Order } from 'src/app/interface/order';
import { MessagingService } from 'src/app/service/messaging.service';
import { environment } from '../../../../environments/environment';
import { PagingInfo } from '../../../interface/paging_info';
import { User } from '../../../interface/user';
import { ApiService } from '../../../service/api.service';
import { SharedService } from '../../../service/shared.service';
import { isEmpty, jsonParse, refreshPage } from 'src/app/lib/utils';

@Component({
  selector: 'app-order-live',
  templateUrl: './order-live.component.html',
  styleUrls: ['./order-live.component.scss', '../../../../assets/user.styles.scss'],
})
export class OrderLiveComponent implements OnInit, AfterViewInit {
  isLoading: boolean = true;
  rowsPerPageOptions: number[] = [20, 50, 100];
  dialogBreakpoints = { '768px': '90vw' };

  user = {} as User;
  pagingInfo = {} as PagingInfo;
  audio = new Audio('../../../../../assets/sound/bell.mp3');

  showOrderDetailsDialog: boolean = false;

  selectedOrder = {} as Order;
  orders = [] as Order[];

  timeoutId!: any;
  lastUpdated: Date = new Date();
  contextMenus: MenuItem[] = [
    {
      label: 'Done',
      icon: 'pi pi-fw pi-check',
      command: () => this.markAsDone(this.selectedOrder.id, this.selectedOrder.id),
    },
  ];

  awaitingOrdersCount: number = 0;

  constructor(
    private appRef: ApplicationRef,
    private sharedService: SharedService,
    private apiService: ApiService,
    private messagingService: MessagingService
  ) {}

  ngOnInit() {
    this.user = jsonParse(localStorage.getItem('user')) as User;
    this.pagingInfo.limit = this.rowsPerPageOptions[0];
  }

  ngAfterViewInit(): void {
    this.initFcm();
  }

  initFcm() {
    Notification.requestPermission(async (permission: NotificationPermission) => {
      if (permission === 'denied') {
        this.sharedService.showNotification('Please refresh page & allow our browser notification!', '😢', 90000);
      } else if (permission === 'granted') {
        this.sharedService.showNotification(`You will be notified when new orders is coming!`, '🥳', 900000);
        const fcmToken = await this.messagingService.registerFcm(environment.firebaseConfig);
        if (fcmToken) {
          if (fcmToken != this.sharedService.user.fcmToken) {
            const user = { ...this.sharedService.user };
            user.fcmToken = fcmToken;
            this.apiService.updateFcmToken(user).subscribe((res: any) => {
              if (res.status === 200) this.sharedService.user = user;
            });
          }
        } else refreshPage();

        this.messagingService.messages.subscribe((res) => {
          if (res) this.getOrders();
        });

        navigator.serviceWorker.addEventListener('message', (e) => {
          if (e.data === 'new-order') return this.getOrders();
        });
      }
    });
  }

  async getOrders(lastFetchedId?: number) {
    this.isLoading = true;

    if (!lastFetchedId) lastFetchedId = this.getLastFetchedId();
    this.apiService.getLiveOrders(lastFetchedId, this.pagingInfo.limit).subscribe((res) => {
      this.isLoading = false;
      if (res.status === 200) {
        this.lastUpdated = new Date();
        if (res.data.length > 0) {
          if (this.orders.length > 0) {
            if (lastFetchedId === 0) {
              this.orders = res.data;
            } else {
              this.orders = res.data.concat(this.orders).slice(0, this.pagingInfo.limit);
              this.showNewOrdersNotification(res.data.length);
            }
          } else this.orders = res.data;
          this.countAwaitingOrders();
        }
      } else this.sharedService.errorToast('Failed to get orders data');
    });

    if (this.timeoutId) clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => this.getOrders(), 120000);
  }

  getLastFetchedId() {
    return this.orders.length > 0 ? Math.max(...this.orders.map((v) => v.id)) : 0;
  }

  showNewOrdersNotification(count: number) {
    this.playSound();
    this.sharedService.showNotification(`There is ${count} new order!`, '🛎', 30000).then(() => this.appRef.tick());
  }

  countAwaitingOrders() {
    this.awaitingOrdersCount = this.orders.filter((v) => !v.isCompleted).length;
  }

  markAsDone(fromId: number, toId: number) {
    this.apiService.markOrderAsDone(fromId, toId).subscribe((res: any) => {
      if (res.status === 200) {
        this.orders.filter((v) => !v.isCompleted && v.id >= fromId && v.id <= toId).forEach((v) => (v.isCompleted = true));
        this.countAwaitingOrders();
      } else this.sharedService.errorToast('Failed to update orders');
    });
  }

  markAllAsDone() {
    const ids = this.orders.filter((v) => !v.isCompleted).map((v) => v.id);
    if (ids.length > 0) this.markAsDone(Math.min(...ids), Math.max(...ids));
  }

  playSound() {
    this.audio.load();
    this.audio.play();
  }

  viewOrder(data: Order) {
    if (isEmpty(data.productsName)) {
      let productsName = [];
      data.products.forEach((product) => {
        productsName.push(product.name);
        product.options.forEach((option) => {
          let optionsName = [];
          option.values.forEach((value) => optionsName.push(value.value));
          option.optionsName = optionsName.length === 1 ? optionsName[0] : optionsName.join(', ');
        });
      });
      data.productsName = productsName.length === 1 ? productsName[0] : productsName.join(', ');
    }
    this.selectedOrder = data;
    this.showOrderDetailsDialog = true;
  }

  onHideOrderDetailsDialog() {}

  onStart() {}

  onPause() {}

  ngOnDestroy() {
    clearTimeout(this.timeoutId);
  }
}
