import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
    selector: 'app-notification',
    templateUrl: './notification-dialog.component.html',
    styleUrls: ['./notification-dialog.component.scss', '../../../../assets/user.styles.scss']
})
export class NotificationDialogComponent implements OnInit {
    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig
    ) {}

    ngOnInit(): void {
        console.log(this.config.data);
        setTimeout(() => this.ref.close(), 9999999);
    }
}
