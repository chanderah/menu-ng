import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { ApiService } from './service/api.service';
import { SharedService } from './service/shared.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
    public menuMode = 'static';

    constructor(
        private primengConfig: PrimeNGConfig,
        private sharedService: SharedService,
        private apiService: ApiService
    ) {}

    async ngOnInit() {
        this.primengConfig.ripple = true;
        document.documentElement.style.fontSize = '14px';
    }
}
