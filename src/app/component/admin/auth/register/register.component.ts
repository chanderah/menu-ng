import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppConfig } from 'src/app/interface/appconfig';
import { User } from 'src/app/interface/user';
import { ConfigService } from 'src/app/layout/service/app.config.service';
import { ApiService } from './../../../../service/api.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
    config: AppConfig;

    isLoading: boolean = false;
    form: FormGroup;
    user = {} as User;

    constructor(
        public configService: ConfigService,
        private router: Router,
        private apiService: ApiService,

        private formBuilder: FormBuilder
    ) {
        this.form = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', [Validators.minLength(8), Validators.required]]
        });
    }

    ngOnInit(): void {
        this.config = this.configService.config;
    }

    onSubmit() {
        this.isLoading = true;
        const { username, password } = this.form.value;
        this.user.username = username;
        this.user.password = password;
        this.apiService.register(this.user).subscribe((res: any) => {
            this.isLoading = false;
            if (res.status === 200) {
                localStorage.setItem('user', this.form.value);
                this.router.navigate(['/']);
            } else alert(res.message);
        });
    }
}
