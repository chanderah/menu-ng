import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { Category } from './interface/category';
import { User } from './interface/user';
import { sortArrayByLabelProperty } from './lib/shared.util';
import { ApiService } from './service/api.service';
import { SharedService } from './service/shared.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
    menuMode = 'static';
    user = {} as User;
    categories = [] as Category[];

    constructor(
        private primengConfig: PrimeNGConfig,
        private sharedService: SharedService,
        private apiService: ApiService
    ) {}

    async ngOnInit() {
        this.primengConfig.ripple = true;
        document.documentElement.style.fontSize = '14px';

        this.user = this.sharedService.getUser();
    }

    async getCategories() {
        return new Promise((resolve) => {
            this.apiService.getCategories().subscribe((res: any) => {
                if (res.status === 200) {
                    this.categories = res.data.sort(sortArrayByLabelProperty);
                    resolve(true);
                }
            });
        });
    }
}
