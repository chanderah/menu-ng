import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LazyLoadEvent } from 'primeng/api';
import { Order } from 'src/app/interface/order';
import SharedUtil, { jsonParse } from 'src/app/lib/shared.util';
import { PaymentMethod } from './../../../interface/order';
import { PagingInfo } from './../../../interface/paging_info';
import { User } from './../../../interface/user';
import { ApiService } from './../../../service/api.service';
import { SharedService } from './../../../service/shared.service';

@Component({
    selector: 'app-order',
    templateUrl: './order.component.html',
    styleUrls: ['./order.component.scss']
})
export class OrderComponent extends SharedUtil implements OnInit {
    isLoading: boolean = true;
    dialogBreakpoints = { '768px': '90vw' };

    user = {} as User;
    pagingInfo = {} as PagingInfo;

    showOrderDetailsDialog: boolean = false;
    showPrintReceiptDialog: boolean = false;

    selectedOrder = {} as Order;
    orders = [] as Order[];

    lastUpdated: Date = new Date();

    paymentMethods = [] as PaymentMethod[];
    formReceipt: FormGroup = this.formBuilder.group({
        paymentMethod: ['', Validators.required],
        receivedAmount: ['', Validators.required]
    });

    constructor(
        private sharedService: SharedService,
        private apiService: ApiService,
        private formBuilder: FormBuilder
    ) {
        super();
    }

    ngOnInit() {
        this.user = jsonParse(localStorage.getItem('user')) as User;
        this.apiService.getPaymentMethods().subscribe((res: any) => {
            if (res.status === 200) this.paymentMethods = res.data;
        });
    }

    get paymentMethod() {
        return this.formReceipt.get('paymentMethod');
    }

    getOrders(e?: LazyLoadEvent) {
        this.isLoading = true;
        this.pagingInfo = {
            filter: e?.filters?.global?.value || '',
            limit: e?.rows || 10,
            offset: e?.first || 0,
            sortField: e?.sortField || 'id',
            sortOrder: e?.sortOrder ? (e.sortOrder === 1 ? 'ASC' : 'DESC') : 'DESC'
        };

        this.apiService.getOrders(this.pagingInfo).subscribe((res: any) => {
            this.isLoading = false;
            if (res.status === 200) {
                // this.orders = res.data;
                this.orders = this.getProductsName(res.data);
                this.lastUpdated = new Date();
                if (res.rowCount !== this.pagingInfo.rowCount) this.pagingInfo.rowCount = res.rowCount;
            } else {
                this.sharedService.errorToast('Failed to get Orders data.');
            }
        });
    }

    viewOrder(data: Order) {
        if (!data) return;
        data.products.forEach((product) => {
            product.options.forEach((option) => {
                let optionsName = [];
                option.values.forEach((value) => {
                    optionsName.push(value.value);
                });
                option.optionsName = optionsName.length === 1 ? optionsName[0] : optionsName.join(', ');
            });
        });

        this.selectedOrder = data;
        this.showOrderDetailsDialog = true;
    }

    onClickReceipt() {
        this.showPrintReceiptDialog = true;
        console.log(this.selectedOrder);
    }

    onPrintReceipt() {
        console.log(this.formReceipt.value);
    }

    getProductsName(orders: Order[]) {
        orders.forEach((data) => {
            let productsName = [];
            data.products.forEach((product) => productsName.push(product.name));
            data.productsName = productsName.length === 1 ? productsName[0] : productsName.join(', ');
        });
        return orders;
    }

    getRowStyle(data: boolean) {
        return {
            background: data ? '#c8e6c9' : '#ffcdd2',
            color: data ? '#256029' : '#c63737'
            // width: this.app.isDesktop() ? '50vw' : '100vw',
            // height: 'auto',
            // left: this.app.isDesktop() ? '25vw' : 0,
            // overflow: 'scroll'
        };
    }

    onStart() {}

    onPause() {}
}
