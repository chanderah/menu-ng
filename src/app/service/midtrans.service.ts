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

  showSnapTransaction(token: string): Promise<{ isSuccess: boolean; response: SnapResponse }> {
    return new Promise((resolve) => {
      snap.pay(token, {
        onSuccess: (response: SnapResponse) => resolve({ isSuccess: true, response }),
        onPending: (response: SnapResponse) => resolve({ isSuccess: false, response }),
        onClose: (response: SnapResponse) => resolve({ isSuccess: false, response }),
        onError: (response: SnapResponse) => resolve({ isSuccess: false, response }),
      });
    });
  }

  get transaction() {
    return this._transaction.getValue();
  }

  set transaction(value: Transaction) {
    this._transaction.next(value);
  }
}
