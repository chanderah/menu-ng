import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';
import { Injectable } from '@angular/core';
import { User } from 'src/app/interface/user';
import { NotificationDialogComponent } from '../component/_common/dialog/notification-dialog/notification-dialog.component';
import { clearLocalStorage, sortArrayByLabelProperty } from '../lib/utils';
import { BehaviorSubject, tap } from 'rxjs';
import { Category } from '../interface/category';
import { ApiService } from './api.service';
import { StorageService } from '../storage.service';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private _user = new BehaviorSubject<User>(this.storageService.getWithExpiry('user', {}));
  user$ = this._user.asObservable();

  private _categories = new BehaviorSubject<Category[]>([]);
  categories$ = this._categories.asObservable();

  constructor(
    public dialogService: DialogService,
    public confirmationService: ConfirmationService,
    private apiService: ApiService,
    private storageService: StorageService
  ) {
    this.load();
  }

  load() {
    this.loadCategories();
  }

  loadCategories() {
    return this.apiService
      .getCategories()
      .pipe(tap((res) => (this.categories = res.data?.sort(sortArrayByLabelProperty))))
      .subscribe();
  }

  logoutUser() {
    clearLocalStorage();
    this.user = null;
  }

  get isLoggedIn() {
    return !!this.user?.id;
  }

  get user() {
    return this._user.getValue();
  }

  set user(data: User) {
    if (data?.token) {
      this.storageService.setWithExpiry('user', data);
      this._user.next(data);
    } else {
      this._user.next(null);
    }
  }

  get categories() {
    return this._categories.getValue();
  }

  set categories(data: Category[]) {
    this._categories.next(data);
  }

  showNotification(message: string, icon: string, timeout?: number): Promise<any> {
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
    });
  }

  showErrorNotification() {
    this.showNotification('Something went wrong. Please try again :(', '🥵', 5000);
  }

  showConfirm(message: string, acceptEvent: () => void, rejectEvent?: () => void) {
    this.confirmationService.confirm({
      icon: 'pi pi-exclamation-triangle md:mx-2',
      header: 'Confirmation',
      message: message ?? 'Are you sure to proceed?',
      dismissableMask: true,
      closeOnEscape: true,
      acceptLabel: 'Yes',
      acceptButtonStyleClass: 'p-button-danger p-button-outlined',
      rejectLabel: 'Cancel',
      rejectButtonStyleClass: 'p-button-outlined',
      defaultFocus: 'none',
      accept: () => acceptEvent(),
      reject: () => rejectEvent?.(),
    });
  }

  // showConfirm(message: string = 'Are you sure to proceed?') {
  //   return new Promise((resolve) => {
  //     this.confirmationService.confirm({
  //       message,
  //       header: 'Confirmation',
  //       icon: 'pi pi-exclamation-triangle',
  //       dismissableMask: true,
  //       closeOnEscape: true,
  //       acceptLabel: 'Yes',
  //       acceptButtonStyleClass: 'p-button-danger p-button-outlined',
  //       rejectLabel: 'Cancel',
  //       rejectButtonStyleClass: 'p-button-outlined',
  //       accept: () => resolve(true),
  //       reject: () => resolve(false),
  //     });
  //   });
  // }

  hasAccess(requiredRoleLevel: number) {
    return this.user?.role?.level >= requiredRoleLevel;
  }

  get roleLevel() {
    return this.user?.role?.level ?? 0;
  }

  get isAdmin() {
    return this.roleLevel >= 1;
  }
}
