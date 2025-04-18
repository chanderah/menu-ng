import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LazyLoadEvent } from 'primeng/api';
import { Order } from 'src/app/interface/order';
import { OrderReceipt, PaymentMethod } from './../../../interface/order';
import { PagingInfo } from './../../../interface/paging_info';
import { ApiService } from './../../../service/api.service';
import { SharedService } from './../../../service/shared.service';

import SharedUtil from 'src/app/lib/shared.util';
import { ToastService } from 'src/app/service/toast.service';
import { DialogService } from 'primeng/dynamicdialog';
import { OrderDetailsDialogComponent } from '../../_common/dialog/order-details-dialog/order-details-dialog.component';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent extends SharedUtil implements OnInit, OnDestroy {
  isLoading: boolean = true;
  pagingInfo: PagingInfo = {
    filter: '',
    limit: 10,
    offset: 0,
    sortField: 'id',
    sortOrder: 'DESC',
  };

  showOrderDetailsDialog: boolean = false;
  showPrintReceiptDialog: boolean = false;

  paymentMethods: PaymentMethod[] = [];
  orders: Order[] = [];
  selectedOrder!: Order;
  selectedOrderReceipt!: OrderReceipt;

  lastUpdated: Date = new Date();

  form: FormGroup = this.formBuilder.group({
    paymentMethod: ['', Validators.required],
    receivedAmount: [null, Validators.required],
  });

  visibilityChangeHandler = () => {
    if (document.visibilityState === 'visible' && this.pagingInfo.offset === 0) {
      this.getOrders();
    }
  };

  constructor(
    private apiService: ApiService,
    private sharedService: SharedService,
    private toastService: ToastService,
    private formBuilder: FormBuilder,
    private dialogService: DialogService
  ) {
    super();
  }

  ngOnInit() {
    document.addEventListener('visibilitychange', this.visibilityChangeHandler);
    this.apiService.getPaymentMethods().subscribe((res) => {
      this.paymentMethods = res.data;
    });
  }

  getOrders(e?: LazyLoadEvent) {
    this.isLoading = true;
    if (e) {
      this.pagingInfo = {
        filter: e.globalFilter,
        limit: e.rows,
        offset: e.first,
        sortField: e.sortField,
        sortOrder: e.sortOrder === 1 ? 'ASC' : 'DESC',
      };
    }

    this.apiService.getOrders(this.pagingInfo).subscribe((res) => {
      this.isLoading = false;
      if (res.status === 200) {
        this.lastUpdated = new Date();
        this.pagingInfo.rowCount = res.rowCount;
        this.orders = res.data;
      } else this.toastService.errorToast('Failed to get orders data.');
    });
  }

  onClickOrder(data: Order) {
    this.dialogService
      .open(OrderDetailsDialogComponent, {
        ...this.defaultDialogConfig,
        closable: false,
        closeOnEscape: false,
        dismissableMask: false,
        maximizable: false,
        showHeader: false,
        // draggable: true,
        data: {
          order: data,
          paymentMethods: this.paymentMethods,
        },
      })
      .onClose.subscribe((res: Order) => {
        const order = this.orders.find((v) => v.id === res.id);
        if (order?.status !== res.status) {
          this.getOrders();
        }
      });
  }

  ngOnDestroy() {
    document.removeEventListener('visibilitychange', this.visibilityChangeHandler);
  }
}
