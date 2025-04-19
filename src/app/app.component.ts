import { AfterViewInit, Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { disableBodyScroll, enableBodyScroll } from './lib/utils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, AfterViewInit {
  private observer!: MutationObserver;
  menuMode = 'static';

  constructor(private primengConfig: PrimeNGConfig) {}

  ngOnInit() {
    this.primengConfig.ripple = true;
    document.documentElement.style.fontSize = '14px';
  }

  ngAfterViewInit(): void {
    // this.initMidtrans();

    this.observer = new MutationObserver(() => {
      const hasDialog = document.querySelector('.p-dialog') || document.querySelector('.p-sidebar');
      if (hasDialog) {
        disableBodyScroll();
      } else {
        enableBodyScroll();
      }
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  // initMidtrans() {
  //   return new Promise((resolve, reject) => {
  //     if (document.getElementById('midtrans-script')) {
  //       return resolve(true);
  //     }
  //     const script = document.createElement('script');
  //     script.id = 'midtrans-script';
  //     script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
  //     script.setAttribute('data-client-key', environment.midtrans.clientKey);
  //     script.onload = (e) => resolve(e);
  //     script.onerror = (err) => reject(err);
  //     document.body.appendChild(script);
  //   });
  // }
}
