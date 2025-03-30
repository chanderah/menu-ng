import { DialogService } from 'primeng/dynamicdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Injectable } from '@angular/core';
import { User } from 'src/app/interface/user';
import { NotificationDialogComponent } from '../component/_common/notification-dialog/notification-dialog.component';
import { ShopConfig } from '../interface/shop_config';
import { jsonParse, jsonStringify, sortArrayByLabelProperty } from '../lib/utils';
import { BehaviorSubject, map } from 'rxjs';
import { Category } from '../interface/category';
import { ApiService } from './api.service';

@Injectable({
    providedIn: 'root',
})
export class SharedService {
    private _user = new BehaviorSubject<User>({} as User);
    user$ = this._user.asObservable();

    private _categories = new BehaviorSubject<Category[]>([]);
    categories$ = this._categories.asObservable();

    constructor(
        private apiService: ApiService,
        public messageService: MessageService,
        public dialogService: DialogService,
        public confirmationService: ConfirmationService
    ) {
        this.load();
    }

    load() {
        this.loadCategories();
        this.user = jsonParse(localStorage.getItem('user')) as User;
    }

    loadCategories() {
        return this.apiService
            .getCategories()
            .pipe(
                map((res) => {
                    this.categories = res.data.sort(sortArrayByLabelProperty);
                    return res;
                })
            )
            .subscribe();
    }

    get user() {
        return this._user.getValue();
    }

    set user(user: User) {
        if (user?.id) {
            localStorage.setItem('user', jsonStringify(user));
            this._user.next(user);
        }
    }

    get categories() {
        return this._categories.getValue();
    }

    set categories(data: Category[]) {
        this._categories.next(data);
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
                    timeout: timeout,
                },
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
                },
            });
        });
    }

    get isAdmin() {
        return this.user?.role?.level >= 1;
    }
}
