import { Injectable } from '@angular/core';
import { FirebaseOptions, initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { BehaviorSubject, Subject } from 'rxjs';

export interface FirebaseConfig extends FirebaseOptions {
    vapidKey: string;
}

@Injectable({
    providedIn: 'root'
})
/**
 * @author: chandraa01 2/2/24
 * FCM Notification Service
 */
export class MessagingService {
    private messages$: Subject<any> = new BehaviorSubject(null);
    private fcmUrl: string = 'https://fcm.googleapis.com/v1/projects/menukita-56209/messages:send';
    private fcmToken!: any;

    constructor() {}

    get messages() {
        return this.messages$.asObservable();
    }

    async registerFcm(firebaseConfig: FirebaseConfig, retry: boolean = true): Promise<string> {
        return new Promise((resolve, reject) => {
            const firebaseApp = initializeApp(firebaseConfig);
            getToken(getMessaging(firebaseApp), {
                vapidKey: firebaseConfig.vapidKey
            })
                .then((token) => {
                    onMessage(getMessaging(), (res) => this.messages$.next(res));
                    resolve(token);
                })
                .catch((err) => {
                    if (retry) this.unregisterFcm().then(() => this.registerFcm(firebaseConfig, false));
                    else resolve(err);
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
}
