import { AfterViewInit, Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { environment } from './../environments/environment';
import { enableBodyScroll } from './lib/shared.util';
import { ApiService } from './service/api.service';
import { MessagingService } from './service/messaging.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, AfterViewInit {
    menuMode = 'static';
    showCartDialog: boolean = false;

    constructor(
        private primengConfig: PrimeNGConfig,
        private messagingService: MessagingService,
        private apiService: ApiService
    ) {}

    ngOnInit() {
        this.primengConfig.ripple = true;
        document.documentElement.style.fontSize = '14px';
    }

    ngAfterViewInit() {
        this.initFcm();
    }

    initFcm() {
        // prettier-ignore
        Notification.requestPermission(
            async (permission: NotificationPermission) => {
                if (permission === 'denied') alert('Please allow our browser notification');
                else if (permission === 'granted') {
                    const fcmToken = await this.messagingService.registerFcm(
                        environment.firebaseConfig,
                    );

                    if (fcmToken != localStorage.getItem('fcmToken')) {
                        localStorage.setItem("fcmToken", fcmToken)
                    }
                    console.log(fcmToken);

                    this.messagingService.messages.subscribe((res) => {
                        if (res) console.log(res);
                    });
                }
            },
        );
    }

    onShowCartDialogChange(bool: boolean) {
        if (bool === false) enableBodyScroll();
        this.showCartDialog = bool;
    }
}
