import { Component, OnInit } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { Order } from 'src/app/interface/order';
import { Table } from 'src/app/interface/table';
import { PagingInfo } from './../../../../interface/paging_info';
import { User } from './../../../../interface/user';
import SharedUtil from './../../../../lib/shared.util';
import { ApiService } from './../../../../service/api.service';
import { SharedService } from './../../../../service/shared.service';

@Component({
    selector: 'app-order-live',
    templateUrl: './order-live.component.html',
    styleUrls: ['../../../../../assets/user.styles.scss', '../../../../../assets/demo/badges.scss'],
    styles: [
        `
            order-new {
                display: none;
            }

            order-done {
                display: none;
            }
        `
    ]
})
export class OrderLiveComponent extends SharedUtil implements OnInit {
    isLoading: boolean = true;
    // dialogBreakpoints = { '768px': '90vw' };
    rowsPerPageOptions: number[] = [20, 50, 100];

    user = {} as User;
    pagingInfo = {} as PagingInfo;

    tables = [] as Table[];

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

    getOrders(e?: LazyLoadEvent) {
        this.pagingInfo = {
            filter: e?.filters?.global?.value || '',
            limit: e?.rows || 20,
            offset: e?.first || 0,
            sortField: e?.sortField || 'created_at',
            sortOrder: e?.sortOrder ? (e.sortOrder === 1 ? 'ASC' : 'DESC') : 'DESC'
        };

        this.apiService.getOrders(this.pagingInfo).subscribe((res: any) => {
            if (res.status === 200) {
                this.orders = this.checkNewOrders(res.data);
                this.lastUpdated = new Date();
                this.sharedService.successToast('Data is updated!');
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
            for (let i = 0; i < newOrders.length; i++) {
                if (this.orders[i].id === newOrders[i].id) {
                    newOrders[i].isNew = false;
                } else {
                    newOrders[i].isNew = true;
                    newData++;
                }
            }
        }
        if (newData > 0) this.showNewOrdersNotification(newData);
        console.log('data:', newOrders);
        return newOrders;
    }

    showNewOrdersNotification(count: number) {
        console.log(`There is ${count} new order!`);
    }

    markAsDone(orderIndex: number) {}

    markAllAsDone() {
        this.orders.forEach((data) => {
            data.isNew = false;
        });
    }

    onStart() {}

    onPause() {}

    ngOnDestroy() {
        clearTimeout(this.timeoutId);
    }
}
