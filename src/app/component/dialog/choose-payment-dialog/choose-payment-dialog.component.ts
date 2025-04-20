import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Dropdown, DropdownModule } from 'primeng/dropdown';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PaymentMethod } from 'src/app/interface/order';
import { SharedService } from 'src/app/service/shared.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule],
  selector: 'app-choose-payment-dialog',
  templateUrl: './choose-payment-dialog.component.html',
  styleUrls: ['./choose-payment-dialog.component.scss'],
})
export class ChoosePaymentDialogComponent implements AfterViewInit {
  @ViewChild('dropdown') dropdown!: Dropdown;

  paymentMethod!: PaymentMethod;
  paymentMethods: PaymentMethod[] = [];

  constructor(
    private dialogRef: DynamicDialogRef,
    private dialogConfig: DynamicDialogConfig<PaymentMethod[]>,
    private sharedService: SharedService
  ) {
    this.paymentMethods = this.dialogConfig.data;
    this.paymentMethod = this.paymentMethods[0];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.dropdown.applyFocus();
    });
  }

  onConfirm() {
    this.sharedService.showConfirm(`Are you sure to proceed with ${this.paymentMethod.label}?`, () => {
      this.dialogRef.close(this.paymentMethod);
    });
  }

  onClose() {
    this.dialogRef.close();
  }
}
