import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private messageService: MessageService) {}

  /* TOAST */
  showToast(severity: 'success' | 'error' | 'warn' | 'info' = 'success', detail: string, summary: string = 'Success') {
    this.messageService.clear();
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
}
