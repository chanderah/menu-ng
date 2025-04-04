import { Component, OnDestroy, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { AppConfig } from 'src/app/interface/appconfig';
import { ConfigService } from 'src/app/layout/service/app.config.service';
import { AppMainComponent } from '../app.main.component';

@Component({
    selector: 'app-config',
    templateUrl: './app.config.component.html',
})
export class AppConfigComponent implements OnInit, OnDestroy {
    subscription: Subscription;

    config: AppConfig;
    scales: number[] = [12, 13, 14, 15, 16];
    scale: number = 14;

    constructor(
        public app: AppComponent,
        public appMain: AppMainComponent,
        public configService: ConfigService,
        public primengConfig: PrimeNGConfig
    ) {}

    ngOnInit() {
        this.config = this.configService.config;
        this.subscription = this.configService.configUpdate$.subscribe((config) => {
            this.config = config;
            this.scale = 14;

            this.applyScale();
        });
    }

    onConfigButtonClick(event) {
        this.appMain.configActive = !this.appMain.configActive;
        this.appMain.configClick = true;
        event.preventDefault();
    }

    incrementScale() {
        this.scale++;
        this.applyScale();
    }

    decrementScale() {
        this.scale--;
        this.applyScale();
    }

    applyScale() {
        document.documentElement.style.fontSize = this.scale + 'px';
    }

    onRippleChange(ripple) {
        this.primengConfig.ripple = ripple;
        this.configService.updateConfig({ ...this.config, ...{ ripple } });
    }

    onInputStyleChange() {
        this.configService.updateConfig(this.config);
    }

    changeTheme(theme: string, dark: boolean) {
        let themeElement = document.getElementById('theme-css');
        themeElement.setAttribute('href', 'assets/theme/' + theme + '/theme.css');
        this.configService.updateConfig({ ...this.config, ...{ theme, dark } });
    }

    ngOnDestroy() {
        if (this.subscription) this.subscription.unsubscribe();
    }
}
