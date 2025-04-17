import { ApplicationRef, Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Order } from 'src/app/interface/order';
import { MessagingService } from 'src/app/service/messaging.service';
import { PagingInfo } from '../../../interface/paging_info';
import { ApiService } from '../../../service/api.service';
import { SharedService } from '../../../service/shared.service';
import { filterUniqueArr } from 'src/app/lib/utils';
import SharedUtil from 'src/app/lib/shared.util';
import { environment } from 'src/environments/environment';
import { debounceTime } from 'rxjs';
import { ToastService } from 'src/app/service/toast.service';
import { StorageService } from 'src/app/storage.service';

@Component({
  selector: 'app-order-live',
  templateUrl: './order-live.component.html',
  styleUrls: ['./order-live.component.scss', '../../../../assets/styles/user.styles.scss'],
})
export class OrderLiveComponent extends SharedUtil implements OnInit {
  rowsPerPageOptions: number[] = [20, 50, 100];

  pagingInfo = {} as PagingInfo;
  audio = new Audio('/assets/sound/bell.mp3');

  isLoading: boolean = true;
  isListening: boolean = false;
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

  constructor(
    private appRef: ApplicationRef,
    private sharedService: SharedService,
    private toastService: ToastService,
    private apiService: ApiService,
    private messagingService: MessagingService,
    private storageService: StorageService
  ) {
    super();
  }

  ngOnInit() {
    const pageSize = this.storageService.get('liveOrderPageSize');
    this.pagingInfo.limit = Number(pageSize) || this.rowsPerPageOptions[0];
    this.getOrders();
  }

  async initFcm() {
    if (this.isListening) return;

    const permission = await Notification.requestPermission();
    if (permission === 'denied') {
      this.sharedService.showNotification('Please allow our browser notification and refresh page!', '😢', 90000);
    } else if (permission === 'granted') {
      const fcmToken = await this.messagingService.registerFcm(environment.firebaseConfig);
      if (fcmToken) {
        const user = { ...this.sharedService.user, fcmToken };
        this.apiService.updateFcmToken(user).subscribe((res) => {
          if (res.status === 200) {
            this.isListening = true;
            this.sharedService.user = user;
            this.sharedService.showNotification(`You will be notified when new orders is coming!`, '🥳', 900000);

            this.messagingService.messages$.pipe(debounceTime(300)).subscribe((res) => {
              const isNewOrderNotif = res.length && res[res.length - 1].notification.title.toLowerCase().includes('new order');
              if (isNewOrderNotif) this.getOrders();
            });
          }
        });
      } else this.refreshPage();
    }
  }

  async getOrders(lastFetchedId: number = this.getLastFetchedId()) {
    this.isLoading = true;
    this.storageService.set('liveOrderPageSize', this.pagingInfo.limit);

    this.apiService.getLiveOrders(lastFetchedId, this.pagingInfo.limit).subscribe((res) => {
      this.isLoading = false;
      if (res.status === 200) {
        this.initFcm();
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
    return this.orders.length ? Math.max(...this.orders.map((v) => v.id)) : 0;
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

  ngOnDestroy() {
    clearTimeout(this.timeoutId);
  }

  get awaitingOrdersCount() {
    return this.orders.filter((v) => !v.isServed).length;
  }
}
