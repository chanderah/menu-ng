import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Notification } from 'src/app/interface/notification';
import { disableBodyScroll, enableBodyScroll } from 'src/app/lib/utils';

@Component({
  selector: 'app-notification',
  templateUrl: './notification-dialog.component.html',
  styleUrls: ['./notification-dialog.component.scss', '../../../../../assets/styles/user.styles.scss'],
})
export class NotificationDialogComponent implements OnInit {
  icons: string[] = ['😎', '👏 ', '😍', '🥰'];
  notification: Notification;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {}

  ngOnInit(): void {
    disableBodyScroll();

    this.notification = {
      icon: this.config.data?.icon ?? this.icons[new Date().getTime() % this.icons.length],
      message: this.config.data.message,
      timeout: this.config.data?.timeout ?? 3000,
    };

    this.ref.onClose.subscribe(() => enableBodyScroll());
    setTimeout(() => this.dismiss(), this.notification.timeout);
  }

  dismiss() {
    enableBodyScroll();
    this.ref.close();
  }
}
