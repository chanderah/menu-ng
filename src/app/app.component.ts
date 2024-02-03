import { AfterViewInit, Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { environment } from './../environments/environment';
import { enableBodyScroll } from './lib/shared.util';
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
        private messagingService: MessagingService
    ) {}

    ngOnInit() {
        this.primengConfig.ripple = true;
        document.documentElement.style.fontSize = '14px';
    }

    async ngAfterViewInit() {
        const token: string = await this.messagingService.registerFcm(environment.firebaseConfig);
        if (token != localStorage.getItem('token')) {
            localStorage.setItem('token', token);
        }
        console.log(token);

        this.messagingService.messages.subscribe((res) => {
            console.log(res);
        });
    }

    onShowCartDialogChange(bool: boolean) {
        if (bool === false) enableBodyScroll();
        this.showCartDialog = bool;
    }
}
