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
    // styleUrls: ['./order-live.component.scss']
    styleUrls: ['../../../../../assets/user.styles.scss', '../../../../../assets/demo/badges.scss']
})
export class OrderLiveComponent extends SharedUtil implements OnInit {
    isLoading: boolean = true;
    // dialogBreakpoints = { '768px': '90vw' };

    user = {} as User;
    pagingInfo = {} as PagingInfo;

    tables = [] as Table[];

    selectedOrder = {} as Order;
    orders = [] as Order[];

    constructor(
        private sharedService: SharedService,
        private apiService: ApiService
    ) {
        super();
    }

    ngOnInit() {
        this.user = this.jsonParse(localStorage.getItem('user'));
    }

    getTables(e?: LazyLoadEvent) {
        this.isLoading = true;
        this.pagingInfo = {
            filter: e?.filters?.global?.value || '',
            limit: e?.rows || 20,
            offset: e?.first || 0,
            sortField: e?.sortField || 'name',
            sortOrder: e?.sortOrder ? (e.sortOrder === 1 ? 'ASC' : 'DESC') : 'ASC'
        };

        this.apiService.getTables(this.pagingInfo).subscribe((res: any) => {
            this.isLoading = false;
            if (res.status === 200) {
                this.tables = res.data;

                this.sharedService.successToast('Data is updated!');
                if (res.rowCount !== this.pagingInfo.rowCount) this.pagingInfo.rowCount = res.rowCount;
            } else {
                this.sharedService.errorToast('Failed to get Tables data.');
            }
        });

        setTimeout(() => {
            this.getTables();
        }, 10000);
    }
}
