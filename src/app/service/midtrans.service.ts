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
    response: null,
  });
  transaction$ = this._transaction.asObservable();

  constructor() {}

  showSnapTransaction(token: string): Promise<boolean> {
    return new Promise((resolve) => {
      snap.pay(token, {
        onSuccess: (res: SnapResponse) => {
          this.transaction.response = res;
          resolve(true);
        },
        onClose: (_res: SnapResponse) => {
          this.transaction.isLoading = false;
          resolve(false);
        },
        onError: (_res: SnapResponse) => {
          this.transaction.isLoading = false;
          resolve(false);
        },
        onPending: (_res: SnapResponse) => {
          this.transaction.isLoading = false;
          resolve(false);
        },
      });
    });
  }

  onCloseSnapTransaction(isSuccess: boolean, res: SnapResponse) {
    this.transaction.isLoading = false;
  }

  get transaction() {
    return this._transaction.getValue();
  }

  set transaction(value: Transaction) {
    this._transaction.next(value);
  }
}
