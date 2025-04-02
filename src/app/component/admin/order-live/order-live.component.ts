import { AfterViewInit, ApplicationRef, Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Order } from 'src/app/interface/order';
import { MessagingService } from 'src/app/service/messaging.service';
import { environment } from '../../../../environments/environment';
import { PagingInfo } from '../../../interface/paging_info';
import { ApiService } from '../../../service/api.service';
import { SharedService } from '../../../service/shared.service';
import { isEmpty, refreshPage } from 'src/app/lib/utils';
import SharedUtil from 'src/app/lib/shared.util';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-order-live',
  templateUrl: './order-live.component.html',
  styleUrls: ['./order-live.component.scss', '../../../../assets/user.styles.scss'],
})
export class OrderLiveComponent extends SharedUtil implements OnInit, AfterViewInit {
  isLoading: boolean = true;
  rowsPerPageOptions: number[] = [20, 50, 100];
  dialogBreakpoints = { '768px': '90vw' };

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
      command: () => this.markAsDone([this.selectedOrder.id]),
    },
  ];

  awaitingOrdersCount: number = 0;

  constructor(
    private appRef: ApplicationRef,
    private sharedService: SharedService,
    private apiService: ApiService,
    private messagingService: MessagingService
  ) {
    super();
  }

  ngOnInit() {
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
            this.apiService.updateFcmToken(user).subscribe((res) => {
              if (res.status === 200) this.sharedService.user = user;
            });
          }
        } else refreshPage();

        this.messagingService.messages$.pipe(debounceTime(300)).subscribe((res) => {
          if (res.length && res[res.length - 1].notification.title.toLowerCase().includes('new order')) {
            this.getOrders();
          }
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
              console.log('atas');
            } else {
              console.log('bawah');
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
    this.awaitingOrdersCount = this.orders.filter((v) => !v.isServed).length;
  }

  markAsDone(listId: number[]) {
    if (!listId.length) return;
    this.apiService.markOrderAsDone(listId).subscribe((res) => {
      if (res.status === 200) {
        this.showOrderDetailsDialog = false;
        this.orders.filter((v) => listId.includes(v.id)).forEach((v) => (v.isServed = true));
        this.countAwaitingOrders();
      } else this.sharedService.errorToast('Failed to update orders');
    });
  }

  markAllAsDone() {
    const listId = this.orders.filter((v) => !v.isServed).map((v) => v.id);
    this.markAsDone(listId);
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
