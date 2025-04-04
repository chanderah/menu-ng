import { Injectable } from '@angular/core';
import { FirebaseOptions, initializeApp } from 'firebase/app';
import { Messaging, getMessaging, getToken } from 'firebase/messaging';
import { BehaviorSubject } from 'rxjs';

export interface FirebaseConfig extends FirebaseOptions {
  vapidKey: string;
}

export interface FcmMessage {
  fcmMessageId: string;
  priority: string;
  from: string;
  isFirebaseMessaging: boolean;
  messageType: string;
  notification: {
    title: string;
    body: string;
    click_action: string;
  };
}

@Injectable({
  providedIn: 'root',
})
/**
 * @author: chandraa01 2/2/24
 * FCM Notification Service
 */
export class MessagingService {
  private client!: Messaging;
  private _messages = new BehaviorSubject<FcmMessage[]>([]);
  messages$ = this._messages.asObservable();

  constructor() {}

  async registerFcm(firebaseConfig: FirebaseConfig, retry: boolean = true): Promise<string> {
    return new Promise(async (resolve, reject) => {
      const firebaseApp = initializeApp(firebaseConfig);
      this.client = getMessaging(firebaseApp);

      const serviceWorkerRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      await navigator.serviceWorker.ready;

      getToken(this.client, {
        serviceWorkerRegistration,
        vapidKey: firebaseConfig.vapidKey,
      })
        .then((token) => {
          navigator.serviceWorker.addEventListener('message', (e) => (this.messages = [...this.messages, e.data]));
          resolve(token);
        })
        .catch((err) => {
          if (retry) {
            this.unregisterFcm().then(() => setTimeout(() => this.registerFcm(firebaseConfig, false), 1000));
          } else reject(err);
        });
    });
  }

  async unregisterFcm(): Promise<boolean> {
    return new Promise((resolve) => {
      navigator.serviceWorker
        .getRegistrations()
        .then((reg) => reg.map((r) => r.unregister()))
        .then(() => resolve(true));
    });
  }

  get messages() {
    return this._messages.getValue();
  }

  set messages(data: FcmMessage[]) {
    this._messages.next(data);
  }
}
