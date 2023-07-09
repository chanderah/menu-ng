import { Component, Input, OnInit } from '@angular/core';
import { jsonParse } from 'src/app/lib/object';
import { MenuService } from '../app.menu.service';
import { LayoutService } from '../service/app.layout.service';
import { UserConfig } from './../../interface/user_config';
import { jsonStringify } from './../../lib/object';

@Component({
  selector: 'app-config',
  templateUrl: './app.config.component.html'
})
export class AppConfigComponent implements OnInit {
  @Input() minimal: boolean = false;

  scales: number[] = [12, 13, 14, 15, 16];
  userConfig = {} as UserConfig;

  constructor(
    public menuService: MenuService,
    public layoutService: LayoutService
  ) {
    this.userConfig = jsonParse(this.layoutService.config);
    this.initScale();
    this.initTheme();
  }

  ngOnInit() {}

  get visible(): boolean {
    return this.layoutService.state.configSidebarVisible;
  }

  set visible(_val: boolean) {
    this.layoutService.state.configSidebarVisible = _val;
  }

  get scale(): number {
    return this.layoutService.config.scale;
  }

  set scale(_val: number) {
    this.layoutService.config.scale = _val;
  }

  get menuMode(): string {
    return this.layoutService.config.menuMode;
  }

  set menuMode(_val: string) {
    this.layoutService.config.menuMode = _val;
  }

  get inputStyle(): string {
    return this.layoutService.config.inputStyle;
  }

  set inputStyle(_val: string) {
    this.layoutService.config.inputStyle = _val;
  }

  get ripple(): boolean {
    return this.layoutService.config.ripple;
  }

  set ripple(_val: boolean) {
    this.layoutService.config.ripple = _val;
  }

  initTheme() {
    const themeLink = <HTMLLinkElement>document.getElementById('theme-css');
    themeLink.setAttribute('href', `assets/layout/styles/theme/${this.userConfig.theme}/theme.css`);
  }

  onConfigButtonClick() {
    this.layoutService.showConfigSidebar();
  }

  changeTheme(theme: string, colorScheme: string) {
    const themeLink = <HTMLLinkElement>document.getElementById('theme-css');
    const newHref = themeLink.getAttribute('href')!.replace(this.layoutService.config.theme, theme);
    this.replaceThemeLink(newHref, () => {
      this.layoutService.config.theme = theme;
      this.layoutService.config.colorScheme = colorScheme;
      this.layoutService.onConfigUpdate();
      this.setLocalStorage();
    });
  }

  replaceThemeLink(href: string, onComplete: Function) {
    const id = 'theme-css';
    const themeLink = <HTMLLinkElement>document.getElementById(id);
    const cloneLinkElement = <HTMLLinkElement>themeLink.cloneNode(true);

    cloneLinkElement.setAttribute('href', href);
    cloneLinkElement.setAttribute('id', id + '-clone');

    themeLink.parentNode!.insertBefore(cloneLinkElement, themeLink.nextSibling);

    cloneLinkElement.addEventListener('load', () => {
      themeLink.remove();
      cloneLinkElement.setAttribute('id', id);
      onComplete();
    });
  }

  initScale() {
    this.scale = this.userConfig.scale;
    this.applyScale();
  }

  decrementScale() {
    this.scale--;
    this.applyScale();
    this.setLocalStorage();
  }

  incrementScale() {
    this.scale++;
    this.applyScale();
    this.setLocalStorage();
  }

  applyScale() {
    document.documentElement.style.fontSize = this.scale + 'px';
  }

  setLocalStorage() {
    this.layoutService.config.scale = this.scale;
    localStorage.setItem('userConfig', jsonStringify(this.layoutService.config));
  }
}
