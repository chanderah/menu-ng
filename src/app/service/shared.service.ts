import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
    providedIn: 'root'
})
export class SharedService {
    categories: any[];

    constructor(private apiService: ApiService) {}

    async getCategories() {
        if (!this.categories) {
            await lastValueFrom(this.apiService.getCategories()).then((res: any) => {
                if (res.status === 200) this.categories = res.data;
            });
        }
        return this.categories;
    }
}
