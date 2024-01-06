import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Order } from 'src/app/interface/order';
import { PagingInfo } from './../../../../interface/paging_info';
import { User } from './../../../../interface/user';
import SharedUtil, { jsonParse } from './../../../../lib/shared.util';
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
export class OrderLiveComponent extends SharedUtil implements OnInit {
    isLoading: boolean = true;
    isPaginationChange: boolean = true;
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
        private sharedService: SharedService,
        private apiService: ApiService
    ) {
        super();
    }

    ngOnInit() {
        this.user = jsonParse(localStorage.getItem('user')) as User;
        this.pagingInfo.limit = this.rowsPerPageOptions[0];
        this.sharedService.showNotification(`You will be notified when new orders is coming!`, '🛎', 900000);
    }

    onPaginateChange() {
        this.isPaginationChange = true;
        return this.getOrders();
    }

    async getOrders() {
        this.isLoading = true;
        this.apiService.getLiveOrders(this.getLastFetchedId(), this.pagingInfo.limit).subscribe((res: any) => {
            if (res.status === 200) {
                this.lastUpdated = new Date();
                if (res.data.length > 0) {
                    if (this.orders.length > 0) {
                        if (this.isPaginationChange) {
                            this.orders = res.data;
                            this.isPaginationChange = false;
                        } else {
                            this.orders = res.data.concat(this.orders).slice(0, this.pagingInfo.limit);
                            this.showNewOrdersNotification(res.data.length);
                        }
                    } else this.orders = res.data;
                }
            } else this.sharedService.errorToast('Failed to get Orders data.');
            this.isLoading = false;
        });
        if (this.timeoutId) clearTimeout(this.timeoutId);
        this.timeoutId = setTimeout(() => this.getOrders(), 9000);
    }

    getLastFetchedId() {
        if (this.isPaginationChange) return 0;
        else return this.orders.length > 0 ? this.orders[0].id : 0;
    }

    showNewOrdersNotification(count: number) {
        this.playSound();
        this.sharedService.showNotification(`There is ${count} new order!`, '🛎', 30000);
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
