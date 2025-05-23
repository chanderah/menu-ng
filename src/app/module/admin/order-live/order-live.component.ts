import { ApplicationRef, Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Order } from 'src/app/interface/order';
import { PagingInfo } from '../../../interface/paging_info';
import { ApiService } from '../../../service/api.service';
import { SharedService } from '../../../service/shared.service';
import { filterUniqueArr } from 'src/app/lib/utils';
import SharedUtil from 'src/app/lib/shared.util';
import { ToastService } from 'src/app/service/toast.service';
import { StorageService } from 'src/app/storage.service';
import { WsMessage } from 'src/app/interface/ws';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-order-live',
  templateUrl: './order-live.component.html',
  styleUrls: [
    './order-live.component.scss',
    // '../../../../assets/styles/user.styles.scss'
  ],
})
export class OrderLiveComponent extends SharedUtil implements OnInit {
  ws!: WebSocket;
  pagingInfo = {} as PagingInfo;
  audio = new Audio('/assets/sound/bell.mp3');

  isLoading: boolean = true;
  showOrderDetailsDialog: boolean = false;

  selectedOrder = {} as Order;
  orders: Order[] = [];

  timeoutId!: any;
  refreshTimer: number = 120000;
  lastUpdated: Date = new Date();
  contextMenus: MenuItem[] = [
    {
      label: 'Done',
      icon: 'pi pi-fw pi-check',
      command: () => this.markAsDone([this.selectedOrder.id]),
    },
  ];

  isVisibleWindow: boolean = false;
  visibilityChangeHandler = () => (this.isVisibleWindow = document.visibilityState === 'visible');

  constructor(
    private appRef: ApplicationRef,
    private sharedService: SharedService,
    private toastService: ToastService,
    private apiService: ApiService,
    private storageService: StorageService
    // private messagingService: MessagingService,
  ) {
    super();
  }

  ngOnInit() {
    document.addEventListener('visibilitychange', this.visibilityChangeHandler);

    const pageSize = this.storageService.get('liveOrderPageSize');
    this.pagingInfo.limit = Number(pageSize) || this.defaultPageOptions[0];

    this.getOrders();
  }

  async initNotification() {
    if (this.ws?.readyState === WebSocket.OPEN) return;

    const permission = await Notification.requestPermission();
    if (permission === 'denied') {
      this.sharedService.showNotification('Please allow our browser notification and refresh page!', '😢', 90000);
    } else if (permission === 'granted') {
      // const fcmToken = await this.messagingService.registerFcm(environment.firebaseConfig);
      // if (fcmToken) {
      //   const user = { ...this.sharedService.user, fcmToken };
      //   this.apiService.updateFcmToken(user).subscribe((res) => {
      //     if (res.status === 200) {
      //       this.isListening = true;
      //       this.sharedService.user = user;
      //       this.sharedService.showNotification(`You will be notified when new orders is coming!`, '🥳', 900000);

      //       this.messagingService.messages$.pipe(debounceTime(300)).subscribe((res) => {
      //         const isNewOrderNotif = res.length && res[res.length - 1].notification.title.toLowerCase().includes('new order');
      //         if (isNewOrderNotif) this.getOrders();
      //       });
      //     }
      //   });
      // } else this.refreshPage();

      this.ws = new WebSocket(environment.wsUrl);
      this.ws.onmessage = (e) => {
        const res = this.jsonParse<WsMessage>(e.data);
        if (res.type === 'new_order') {
          this.getOrders();

          if (!this.isVisibleWindow) {
            const notification = new Notification('Menu Kita - New Order', {
              icon: '/assets/layout/images/logo-white.svg',
              body: 'You have new orders!',
              silent: true,
            });

            notification.onclick = () => {
              window.focus();
              notification.close();
            };
          }
        }
      };

      this.ws.onopen = () => {
        this.sharedService.showNotification(`You will be notified when new orders is coming!`, '🥳', 900000);
      };
    }
  }

  async getOrders(lastFetchedId: number = this.getLastFetchedId()) {
    this.isLoading = true;
    this.storageService.set('liveOrderPageSize', this.pagingInfo.limit);

    this.apiService.getLiveOrders(lastFetchedId, this.pagingInfo.limit).subscribe((res) => {
      this.isLoading = false;
      if (res.status === 200) {
        this.initNotification();
        this.lastUpdated = new Date();
        if (lastFetchedId === 0) {
          this.orders = res.data;
        } else {
          this.orders = filterUniqueArr([...res.data, ...this.orders], 'id').slice(0, this.pagingInfo.limit);
          this.showNewOrdersNotification(res.data.length);
        }
      } else this.toastService.errorToast('Failed to get orders data');
    });

    if (this.timeoutId) clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => this.getOrders(), this.refreshTimer);
  }

  getLastFetchedId() {
    if (!this.orders.length) return 0;
    return Math.max(...this.orders.map((v) => v.id));
  }

  showNewOrdersNotification(count: number) {
    if (count) {
      this.playSound();
      this.sharedService.showNotification(`There is ${count} new order!`, '🛎', 30000).then(() => this.appRef.tick());
    }
  }

  markAsDone(listId: number[]) {
    if (!listId.length) return;

    this.isLoading = true;
    this.apiService.markOrderAsDone(listId).subscribe((res) => {
      this.isLoading = false;
      if (res.status === 200) {
        this.showOrderDetailsDialog = false;
        this.orders.filter((v) => listId.includes(v.id)).forEach((v) => (v.isServed = true));
      } else this.toastService.errorToast('Failed to update orders');
    });
  }

  markAllAsDone() {
    this.sharedService.showConfirm('Are you sure to mark all orders as done?', () => {
      const listId = this.orders.filter((v) => !v.isServed).map((v) => v.id);
      this.markAsDone(listId);
    });
  }

  playSound() {
    this.audio.load();
    this.audio.play();
  }

  viewOrder(data: Order) {
    this.selectedOrder = data;
    this.showOrderDetailsDialog = true;
  }

  onHideOrderDetailsDialog() {}

  onStart() {}

  onPause() {}

  get awaitingOrdersCount() {
    return this.orders.filter((v) => !v.isServed).length;
  }

  ngOnDestroy() {
    clearTimeout(this.timeoutId);
    document.removeEventListener('visibilitychange', this.visibilityChangeHandler);
  }
}
