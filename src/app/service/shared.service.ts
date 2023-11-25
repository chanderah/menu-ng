import { Injectable } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { lastValueFrom } from 'rxjs';
import { User } from 'src/app/interface/user';
import { NotificationDialogComponent } from './../component/dialog/notification/notification-dialog.component';
import { jsonParse, sortArrayByLabelProperty } from './../lib/shared.util';
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

    getUser(): User {
        return jsonParse(localStorage.getItem('user')) as User;
    }

    removeUser() {
        localStorage.removeItem('user');
        return;
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

    infoToast(message: string) {
        this.showToast('info', message, 'Information');
    }

    successToast(message: string) {
        this.showToast('success', message);
    }

    warnToast(message: string) {
        this.showToast('warn', message, 'Warn');
    }

    errorToast(message: string) {
        this.showToast('error', message, 'Failed');
    }

    showNotification(message: string, icon?: string, timeout?: number) {
        this.dialogService
            .open(NotificationDialogComponent, {
                showHeader: false,
                width: 'auto',
                modal: true,
                closeOnEscape: true,
                dismissableMask: true,
                data: {
                    icon: icon,
                    message: message,
                    timeout: timeout
                }
            })
            .onClose.subscribe((res) => {
                return res;
            });
    }

    showErrorNotification() {
        this.showNotification('Something went wrong. Please try again :(', '🥵', 5000);
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
