import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';
import { Category } from './interface/category';
import { User } from './interface/user';
import { sortArrayByLabelProperty } from './lib/utils';
import { ApiService } from './service/api.service';
import { SharedService } from './service/shared.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
    public menuMode = 'static';
    public user = {} as User;
    public categories$: BehaviorSubject<Category[]> = new BehaviorSubject(null);

    constructor(
        private primengConfig: PrimeNGConfig,
        private sharedService: SharedService,
        private apiService: ApiService
    ) {}

    async ngOnInit() {
        this.primengConfig.ripple = true;
        document.documentElement.style.fontSize = '14px';

        this.user = this.sharedService.getUser();
        this.getCategories();

        const encrypted = this.sharedService.encrypt('c');
        const decrypted = this.sharedService.decrypt(encrypted);
        console.log(encrypted);
        console.log(decrypted);
    }

    get categories() {
        return this.categories$.asObservable();
    }

    private getCategories() {
        this.apiService.getCategories().subscribe((res: any) => {
            if (res.status === 200) this.categories$.next(res.data.sort(sortArrayByLabelProperty));
        });
    }
}
