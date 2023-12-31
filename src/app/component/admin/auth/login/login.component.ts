import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppConfig } from 'src/app/interface/appconfig';
import { ConfigService } from 'src/app/layout/service/app.config.service';
import SharedUtil from 'src/app/lib/shared.util';
import { User } from '../../../../interface/user';
import { ApiService } from '../../../../service/api.service';
import { jsonStringify } from './../../../../lib/shared.util';
import { SharedService } from './../../../../service/shared.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent extends SharedUtil implements OnInit {
    config: AppConfig;

    isLoading: boolean = false;
    form: FormGroup;
    user = {} as User;

    constructor(
        public configService: ConfigService,
        private sharedService: SharedService,
        private router: Router,
        private apiService: ApiService,

        private formBuilder: FormBuilder
    ) {
        super();
        this.form = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', [Validators.minLength(8), Validators.required]]
        });
    }

    ngOnInit(): void {
        this.config = this.configService.config;
        this.user = this.sharedService.getUser();
        if (this.user) this.router.navigate(['/']);
    }

    onSubmit() {
        this.isLoading = true;
        this.apiService.login(this.form.value).subscribe((res: any) => {
            this.isLoading = false;
            if (res.status === 200) {
                localStorage.setItem('user', jsonStringify(res.data));
                this.router.navigate(['/']);
                this.sharedService.successToast('Login success!');
            } else this.sharedService.errorToast('Failed to authorize the user!');
        });
    }
}
