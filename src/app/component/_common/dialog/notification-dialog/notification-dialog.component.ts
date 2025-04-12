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

    document.getElementsByClassName('p-dialog-content')[0].className += ' rounded-radius';
    this.ref.onClose.subscribe(() => enableBodyScroll());
    setTimeout(() => this.dismiss(), this.notification.timeout);
  }

  dismiss() {
    document.getElementsByClassName('p-dialog-content')[0].className = document
      .getElementsByClassName('p-dialog-content')[0]
      .className.replace('rounded-radius', '');

    enableBodyScroll();
    this.ref.close();
  }
}
