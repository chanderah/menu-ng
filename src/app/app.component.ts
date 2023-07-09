import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { UserConfig } from './interface/user_config';
import { isEmpty, jsonParse, jsonStringify } from './lib/object';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  isLoading: boolean = true;
  userConfig = {} as UserConfig;

  constructor(
    private primengConfig: PrimeNGConfig,
    private layoutService: LayoutService
  ) {
    this.userConfig = jsonParse(localStorage.getItem('userConfig'));
    this.primengConfig.ripple = true;
    this.layoutService.config = {
      ripple: this.userConfig?.ripple || false,
      inputStyle: this.userConfig?.inputStyle || 'outlined',
      menuMode: this.userConfig?.menuMode || 'static',
      colorScheme: this.userConfig?.colorScheme || 'light',
      theme: this.userConfig?.theme || 'lara-light-indigo',
      scale: this.userConfig?.scale || 14
    };
    if (isEmpty(this.userConfig)) localStorage.setItem('userConfig', jsonStringify(layoutService.config));
  }

  ngOnInit() {
    // window.onload = () => (this.isLoading = false);
  }
}
