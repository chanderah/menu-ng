import { Component, OnInit, ViewChild } from '@angular/core';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Order, PaymentMethod, PaymentType } from 'src/app/interface/order';
import SharedUtil from 'src/app/lib/shared.util';
import { ApiService } from 'src/app/service/api.service';
import { ChoosePaymentDialogComponent } from '../choose-payment-dialog/choose-payment-dialog.component';
import { SharedService } from 'src/app/service/shared.service';
import { FormControl, Validators } from '@angular/forms';
import { PrintDialogComponent } from '../print-dialog/print-dialog.component';

@Component({
  selector: 'app-order-details-dialog',
  templateUrl: './order-details-dialog.component.html',
  styleUrls: ['./order-details-dialog.component.scss'],
})
export class OrderDetailsDialogComponent extends SharedUtil implements OnInit {
  @ViewChild(PrintDialogComponent) printDialogComponent!: PrintDialogComponent;

  isLoading: boolean = true;
  isPrinting: boolean = false;
  showPrintDialog: boolean = false;
  showPaymentDialog: boolean = false;

  data!: Order;
  paymentMethods: PaymentMethod[] = [];

  receivedAmountCtrl = new FormControl(0, Validators.required);

  constructor(
    private dialogService: DialogService,
    private apiService: ApiService,
    public sharedService: SharedService,
    public dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig<{
      order: Order;
      paymentMethods: PaymentMethod[];
    }>
  ) {
    super();
  }

  ngOnInit(): void {
    this.data = this.dialogConfig.data.order;
    this.paymentMethods = this.dialogConfig.data.paymentMethods;

    this.apiService.getOrderById(this.data.id).subscribe((res) => {
      this.isLoading = false;
      this.data = res.data;

      this.receivedAmountCtrl.setValidators([Validators.required, Validators.min(this.data.totalPrice)]);
      this.receivedAmountCtrl.setValue(res.data.totalPrice);
    });
  }

  async onClickPayment() {
    const ref = this.dialogService.open(ChoosePaymentDialogComponent, {
      ...this.defaultStackedDialogConfig,
      header: 'Choose Payment Method',
      data: this.paymentMethods,
    });

    ref.onClose.subscribe((res: PaymentMethod) => {
      if (!res) return;

      this.isLoading = true;
      this.apiService
        .completeOrder({
          ...this.data,
          paymentType: PaymentType.COUNTER,
          paymentMethod: res.label,
        })
        .subscribe((res) => {
          this.isLoading = false;
          if (res.status === 200) {
            this.data = res.data;
            this.openPrintDialog();
          } else {
            this.sharedService.showErrorNotification();
          }
        });
    });
  }

  openPrintDialog() {
    this.showPrintDialog = true;
  }

  // onClickReceipt() {
  //   // this.selectedOrderGrandTotal = this.selectedOrder.totalPrice + this.selectedOrder.totalPrice * this.taxesRatio;
  //   // // this.form.get('receivedAmount').setValue(this.selectedOrderGrandTotal);
  //   // this.form.get('paymentMethod').setValue(this.paymentMethods[0]);
  //   // this.form.get('paymentMethod').valueChanges.subscribe((v: PaymentMethod) => {
  //   //   if (v?.id !== 1) {
  //   //     this.form.get('receivedAmount').setValue(this.selectedOrderGrandTotal);
  //   //     this.form.get('receivedAmount').disable();
  //   //   } else this.form.get('receivedAmount').enable();
  //   // });
  //   this.showPrintReceiptDialog = true;
  // }

  // async onPrintReceipt() {
  //   // if ((this.form.get('paymentMethod').value as PaymentMethod).id === 1) {
  //   //   if (this.form.get('receivedAmount').value < this.selectedOrderGrandTotal) {
  //   //     return this.toastService.errorToast("Received amount can't be lower than Grand Total Price.");
  //   //   }
  //   // }
  //   // this.isLoading = true;
  //   // this.form.enable();
  //   // this.orderService
  //   //   .generateOrderReceipt({
  //   //     tableId: this.selectedOrder.tableId,
  //   //     orderCode: this.selectedOrder.orderCode,
  //   //     receivedAmount: this.form.get('receivedAmount').value,
  //   //     paymentMethod: this.form.get('paymentMethod').value,
  //   //     taxes: this.selectedOrder.totalPrice * 0.1, // sharedService
  //   //     subTotal: this.selectedOrder.totalPrice,
  //   //     total: this.selectedOrderGrandTotal,
  //   //     products: this.selectedOrder.products,
  //   //     issuedAt: this.selectedOrder.createdAt,
  //   //     createdAt: new Date(),
  //   //   })
  //   //   .then((res) => {
  //   //     this.selectedOrderReceipt = res;
  //   //     setTimeout(() => this.printAsPdf(), 10);
  //   //   });
  // }

  get orderChanges() {
    return this.receivedAmountCtrl.invalid ? 0 : <number>this.receivedAmountCtrl.value - this.data.totalPrice;
  }

  get businessConfig() {
    return this.sharedService.businessConfig;
  }
  get addresses() {
    return [1, 2, 3, 4, 5, 6].map((v) => this.businessConfig[`address${v}`]).filter(Boolean);
  }

  close() {
    this.dialogRef.close(this.data);
  }
}
