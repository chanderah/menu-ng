import { AfterViewInit, ApplicationRef, Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Order } from 'src/app/interface/order';
import SharedUtil, { jsonParse } from 'src/app/lib/shared.util';
import { MessagingService } from 'src/app/service/messaging.service';
import { environment } from './../../../../../environments/environment';
import { PagingInfo } from './../../../../interface/paging_info';
import { User } from './../../../../interface/user';
import { ApiService } from './../../../../service/api.service';
import { SharedService } from './../../../../service/shared.service';

@Component({
    selector: 'app-order-live',
    templateUrl: './order-live.component.html',
    styleUrls: [
        // './order-live.component.scss',
        '../../../../../assets/user.styles.scss',
        '../../../../../assets/demo/badges.scss'
    ],
    styles: [
        `
            :host ::ng-deep {
                .p-paginator {
                    .p-paginator-first {
                        display: none;
                        // pointer-events: none;
                        // color: gray;
                    }
                    .p-paginator-prev {
                        display: none;
                        // pointer-events: none;
                        // color: gray;
                    }
                    .p-paginator-next {
                        display: none;
                        // pointer-events: none;
                        // color: gray;
                    }
                    .p-paginator-last {
                        display: none;
                        // pointer-events: none;
                        // color: gray;
                    }
                }
            }
        `
    ]
})
export class OrderLiveComponent extends SharedUtil implements OnInit, AfterViewInit {
    isLoading: boolean = true;
    rowsPerPageOptions: number[] = [20, 50, 100];
    dialogBreakpoints = { '768px': '90vw' };

    user = {} as User;
    pagingInfo = {} as PagingInfo;
    audio = new Audio('../../../../../assets/sound/bell.mp3');

    showOrderDetailsDialog: boolean = false;

    selectedOrder = {} as Order;
    orders = [] as Order[];

    timeoutId: any = null;
    lastUpdated: Date = new Date();
    contextMenus: MenuItem[] = [
        {
            label: 'Done',
            icon: 'pi pi-fw pi-check',
            command: () => this.markAsDone(this.selectedOrder)
        }
    ];

    constructor(
        private appRef: ApplicationRef,
        private sharedService: SharedService,
        private apiService: ApiService,
        private messagingService: MessagingService
    ) {
        super();
    }

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
                this.sharedService.showNotification(
                    'Please refresh page & allow our browser notification!',
                    '😢',
                    90000
                );
            } else if (permission === 'granted') {
                this.sharedService.showNotification(`You will be notified when new orders is coming!`, '🥳', 900000);
                const fcmToken = await this.messagingService.registerFcm(environment.firebaseConfig);
                //prettier-ignore
                if (fcmToken) {
                    if (fcmToken != this.sharedService.getUser().fcmToken) {
                        const user = this.sharedService.getUser();
                        user.fcmToken = fcmToken;
                        this.apiService.updateFcmToken(user).subscribe((res: any) => {
                            if (res.status === 200) this.sharedService.setUser(user);

                        })
                    }
                } else window.location.reload();

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
        lastFetchedId = lastFetchedId ?? this.getLastFetchedId();
        this.apiService.getLiveOrders(lastFetchedId, this.pagingInfo.limit).subscribe((res: any) => {
            if (res.status === 200) {
                this.lastUpdated = new Date();
                if (res.data.length > 0) {
                    if (this.orders.length > 0) {
                        if (lastFetchedId === 0) {
                            this.orders = res.data;
                        } else {
                            console.log('orders', this.orders);
                            console.log('newOrders', res.data);
                            this.orders = res.data.concat(this.orders).slice(0, this.pagingInfo.limit);
                            console.log('concat', this.orders);
                            this.showNewOrdersNotification(res.data.length);
                        }
                    } else this.orders = res.data;
                }
            } else this.sharedService.errorToast('Failed to get orders data');
        });
        this.isLoading = false;
    }

    getLastFetchedId() {
        return this.orders.length > 0 ? this.orders[0].id : 0;
    }

    showNewOrdersNotification(count: number) {
        this.playSound();
        this.sharedService.showNotification(`There is ${count} new order!`, '🛎', 30000);
        this.appRef.tick();
    }

    markAsDone(selectedOrder: Order) {
        this.orders[this.orders.indexOf(selectedOrder)].isNew = false;
    }

    markAllAsDone() {
        this.orders.forEach((data) => {
            data.isNew = false;
        });
    }

    playSound() {
        this.audio.load();
        this.audio.play();
    }

    viewOrder(data: Order) {
        if (this.isEmpty(data.productsName)) {
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
