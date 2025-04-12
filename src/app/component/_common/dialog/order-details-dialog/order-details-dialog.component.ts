import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Order } from 'src/app/interface/order';
import SharedUtil from 'src/app/lib/shared.util';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-order-details-dialog',
  templateUrl: './order-details-dialog.component.html',
  styleUrls: ['./order-details-dialog.component.scss'],
})
export class OrderDetailsDialogComponent extends SharedUtil implements OnInit {
  isLoading: boolean = true;
  showPaymentDialog: boolean = false;
  showReceiptDialog: boolean = false;

  data!: Order;
  isDataUpdated: boolean = false;

  constructor(
    // private dialogService: DialogService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig<Order>,
    private apiService: ApiService
  ) {
    super();
  }

  ngOnInit(): void {
    this.data = this.dialogConfig.data;
    this.apiService.getOrderById(this.dialogConfig.data.id).subscribe((res) => {
      this.isLoading = false;
      this.data = res.data;
    });
  }

  onClickPayment() {
    // payment
  }

  onClickReceipt() {
    // receipt
  }

  close() {
    this.dialogRef.close(this.data);
  }
}
