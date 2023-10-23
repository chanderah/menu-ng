import { Component, OnInit } from '@angular/core';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { Order } from 'src/app/interface/order';
import { PagingInfo } from './../../../../interface/paging_info';
import { User } from './../../../../interface/user';
import SharedUtil from './../../../../lib/shared.util';
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
    dialogBreakpoints = { '768px': '90vw' };
    rowsPerPageOptions: number[] = [20, 50, 100];

    contextMenus: MenuItem[] = [
        // { label: 'View', icon: 'pi pi-fw pi-eye', command: () => this.viewOrder(this.selectedOrder) },
        {
            label: 'Done',
            icon: 'pi pi-fw pi-check',
            command: () => this.markAsDone(this.selectedOrder)
        }
    ];

    user = {} as User;
    pagingInfo = {} as PagingInfo;

    showOrderDetailsDialog: boolean = false;

    selectedOrder = {} as Order;
    orders = [] as Order[];

    timeoutId: any = null;
    lastUpdated: Date = new Date();

    constructor(
        private sharedService: SharedService,
        private apiService: ApiService
    ) {
        super();
    }

    ngOnInit() {
        this.user = this.jsonParse(localStorage.getItem('user'));
    }

    async getOrders(e?: LazyLoadEvent) {
        this.pagingInfo = {
            filter: e?.filters?.global?.value || '',
            limit: e?.rows || 20,
            offset: e?.first || 0,
            sortField: 'id',
            sortOrder: 'DESC'
        };

        this.isLoading = true;
        this.apiService.getOrders(this.pagingInfo).subscribe((res: any) => {
            this.isLoading = false;
            if (res.status === 200) {
                this.checkNewOrders(res.data);
                this.lastUpdated = new Date();
                if (res.rowCount !== this.pagingInfo.rowCount) this.pagingInfo.rowCount = res.rowCount;
            } else {
                this.sharedService.errorToast('Failed to get Orders data.');
            }
        });

        if (this.timeoutId) clearTimeout(this.timeoutId);
        this.timeoutId = setTimeout(() => {
            this.getOrders();
        }, 9000);
    }

    checkNewOrders(newOrders: Order[]) {
        let newData = 0;
        if (this.orders.length > 0) {
            const index = newOrders.findIndex((v) => v.id === this.orders[0].id);
            if (index !== 0) {
                for (let i = 0; i < index; i++) {
                    newOrders[i].isNew = true;
                    this.orders.unshift(newOrders[i]);
                    newData++;
                }
            }
        } else {
            newOrders.forEach((data) => {
                if (!data.hasOwnProperty('isNew')) {
                    data.isNew = false;
                }
            });
            this.orders = newOrders;
        }

        this.orders.forEach((data) => {
            if (this.isEmpty(data.productsName)) {
                let productsName = [];

                data.products.forEach((product) => {
                    productsName.push(product.name);

                    product.options.forEach((option) => {
                        let optionsName = [];
                        option.values.forEach((value) => {
                            optionsName.push(value.value);
                        });
                        option.optionsName = optionsName.length === 1 ? optionsName[0] : optionsName.join(', ');
                    });
                });
                data.productsName = productsName.length === 1 ? productsName[0] : productsName.join(', ');
            }
        });
        if (newData > 0) this.showNewOrdersNotification(newData);
        return newOrders;
    }

    showNewOrdersNotification(count: number) {
        this.sharedService.showNotification(`There is ${count} new order!`, '🛎', 30000);
        this.playSound();
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
        let audio = new Audio();
        audio.src = '../../../../../assets/sound/bell.mp3';
        audio.load();
        audio.play();
    }

    viewOrder(data: Order) {
        this.selectedOrder = data;
        this.showOrderDetailsDialog = true;
        console.log(this.selectedOrder);
    }

    onHideOrderDetailsDialog() {
        // this.getOrders();
    }

    onStart() {}

    onPause() {}

    ngOnDestroy() {
        clearTimeout(this.timeoutId);
    }
}
