import { Injectable } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { lastValueFrom } from 'rxjs';
import { sortArrayByLabelProperty } from './../lib/shared.util';
import { ApiService } from './api.service';

@Injectable({
    providedIn: 'root'
})
export class SharedService {
    categories: any[];

    constructor(
        public messageService: MessageService,
        public confirmationService: ConfirmationService,
        private apiService: ApiService
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
