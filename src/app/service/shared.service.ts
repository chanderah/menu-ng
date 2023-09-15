import { Injectable } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { lastValueFrom } from 'rxjs';
import { NotificationDialogComponent } from './../component/dialog/notification/notification-dialog.component';
import { sortArrayByLabelProperty } from './../lib/shared.util';
import { ApiService } from './api.service';

@Injectable({
    providedIn: 'root'
})
export class SharedService {
    categories: any[];

    constructor(
        public messageService: MessageService,
        public dialogService: DialogService,
        public confirmationService: ConfirmationService,
        private apiService: ApiService // private notificationDialogComponent: NotificationDialogComponent
    ) {
        // super();
    }

    async getCategories() {
        await lastValueFrom(this.apiService.getCategories()).then((res: any) => {
            if (res.status === 200) this.categories = res.data.sort(sortArrayByLabelProperty);
        });
        return this.categories;
    }

    refreshPage() {
        window.location.reload();
    }

    /* TOAST */
    showToast(
        severity: 'success' | 'error' | 'warn' | 'info' = 'success',
        detail: string,
        summary: string = 'Success'
    ) {
        this.messageService.add({ severity, summary, detail });
    }

    showInfo(message: string) {
        this.showToast('info', message, 'Information');
    }

    showSuccess(message: string) {
        this.showToast('success', message);
    }

    showWarn(message: string) {
        this.showToast('warn', message, 'Warn');
    }

    showError(message: string) {
        this.showToast('error', message, 'Failed');
    }

    showNotification(message: string) {
        this.dialogService
            .open(NotificationDialogComponent, {
                // header: 'Success!',
                showHeader: false,
                width: '70%',
                modal: true,
                closeOnEscape: true,
                dismissableMask: true,
                data: message
            })
            .onClose.subscribe((res) => {
                return res;
            });
    }

    showConfirm(message: string = 'Are you sure to proceed?') {
        return new Promise((resolve) => {
            this.confirmationService.confirm({
                icon: 'pi pi-exclamation-triangle',
                header: `Caution`,
                message: message,
                accept: () => {
                    resolve(true);
                },
                reject: () => {
                    resolve(false);
                }
            });
        });
    }
}
