import { AfterViewInit, Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { enableBodyScroll } from './lib/shared.util';
import { ApiService } from './service/api.service';
import { MessagingService } from './service/messaging.service';
import { SharedService } from './service/shared.service';

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
        private apiService: ApiService,
        private sharedService: SharedService
    ) {}

    ngOnInit() {
        this.primengConfig.ripple = true;
        document.documentElement.style.fontSize = '14px';
    }

    ngAfterViewInit() {}

    onShowCartDialogChange(bool: boolean) {
        if (bool === false) enableBodyScroll();
        this.showCartDialog = bool;
    }
}
