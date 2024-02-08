import { AfterViewInit, Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, AfterViewInit {
    menuMode = 'static';

    constructor(private primengConfig: PrimeNGConfig) // private messagingService: MessagingService,
    // private apiService: ApiService,
    // private sharedService: SharedService
    {}

    ngOnInit() {
        this.primengConfig.ripple = true;
        document.documentElement.style.fontSize = '14px';
    }

    ngAfterViewInit() {}
}
