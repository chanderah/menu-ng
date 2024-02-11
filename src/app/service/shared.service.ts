import { Injectable } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { User } from 'src/app/interface/user';
import { isEmpty } from 'src/app/lib/shared.util';
import { NotificationDialogComponent } from '../component/_common/notification-dialog/notification-dialog.component';
import { ShopConfig } from './../interface/shop_config';
import { jsonParse, jsonStringify } from './../lib/shared.util';
import { ApiService } from './api.service';

@Injectable({
    providedIn: 'root'
})
export class SharedService {
    constructor(
        public messageService: MessageService,
        public dialogService: DialogService,
        public confirmationService: ConfirmationService,
        private apiService: ApiService // private notificationDialogComponent: NotificationDialogComponent
    ) {
        // super();
    }

    isAdmin() {
        const user = this.getUser();
        if (!user || isEmpty(user) || !this.isValidUser(user)) {
            return false;
        }
        return true;
    }

    isValidUser(user: User): boolean {
        Object.values(user).forEach((v) => {
            if (isEmpty(v)) return false;
        });
        return true;
    }

    getUser(): User {
        // return jsonParse(db.getAppData('user').then((res) => res));
        return jsonParse(localStorage.getItem('user')) as User;
    }

    setUser(user?: User) {
        // return db.setAppData('user', user);
        localStorage.setItem('user', jsonStringify(user));
        return;
    }

    removeUser() {
        localStorage.removeItem('user');
        return;
    }

    getShopConfig(): ShopConfig {
        return jsonParse(localStorage.getItem('shopConfig'));
    }

    setShopConfig(shopConfig: ShopConfig) {
        localStorage.setItem('shopConfig', jsonStringify(shopConfig));
        return;
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

    showNotification(message: string, icon?: string, timeout?: number): Promise<any> {
        return new Promise((resolve) => {
            this.dialogService.open(NotificationDialogComponent, {
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
            });
            resolve(true);
            // .onClose.subscribe((res) => {
            //     resolve(res);
            // });
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
