import { Injectable } from '@angular/core';
import { SnapResponse, Transaction } from '../interface/midtrans';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MidtransService {
  private _transaction = new BehaviorSubject<Transaction>({
    isLoading: false,
    type: null,
  });
  transaction$ = this._transaction.asObservable();

  constructor() {}

  showSnapTransaction(token: string) {
    snap.pay(token, {
      onClose: (res: SnapResponse) => this.onCloseSnapTransaction(false, res),
      onError: (res: SnapResponse) => this.onCloseSnapTransaction(false, res),
      onPending: (res: SnapResponse) => this.onCloseSnapTransaction(false, res),
      onSuccess: (res: SnapResponse) => this.onCloseSnapTransaction(true, res),
    });
  }

  onCloseSnapTransaction(isSuccess: boolean, res: SnapResponse) {
    this.transaction.isLoading = false;
    console.log('isSuccess, res', isSuccess, res);
  }

  get transaction() {
    return this._transaction.getValue();
  }

  set transaction(value: Transaction) {
    this._transaction.next(value);
  }
}
