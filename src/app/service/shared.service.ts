import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { User } from 'src/app/interface/user';
import { environment } from 'src/environments/environment.prod';
import { NotificationDialogComponent } from '../component/_common/notification-dialog/notification-dialog.component';
import { ShopConfig } from '../interface/shop_config';
import { isEmpty, jsonParse, jsonStringify } from '../lib/utils';
import { ApiService } from './api.service';

const ALGORITHM = 'aes-256-cbc';
const CIPHER_KEY = 'abcdefghijklmnopqrstuvwxyz012345'; // Same key used in Golang
const BLOCK_SIZE = 16;

@Injectable({
    providedIn: 'root'
})
export class SharedService {
    private AES_BLOCK_SIZE: number = 16;
    private AES_ALGORITHM: string = 'aes-256-cfb';
    private AES_IV = '1010101010101010';
    private AES_KEY = environment.aesKey;

    constructor(
        public messageService: MessageService,
        public dialogService: DialogService,
        public confirmationService: ConfirmationService,
        private apiService: ApiService // private notificationDialogComponent: NotificationDialogComponent
    ) {
        // super();
    }

    encrypt(data: any) {
        return CryptoJS.AES.encrypt(data, CryptoJS.enc.Utf8.parse(environment.aesKey), {
            iv: CryptoJS.enc.Utf8.parse(environment.aesIv),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        }).ciphertext.toString(CryptoJS.enc.Base64);
    }

    decrypt(data: string) {
        return CryptoJS.AES.decrypt(data, CryptoJS.enc.Utf8.parse(environment.aesKey), {
            iv: CryptoJS.enc.Utf8.parse(environment.aesKey),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        }).toString(CryptoJS.enc.Utf8);
    }

    encode(data: any) {
        return typeof data === 'string' ? btoa(data) : btoa(jsonStringify(data));
    }

    decode(data: string) {
        return atob(data);
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
