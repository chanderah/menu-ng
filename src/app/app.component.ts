import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  public menuMode = 'static';

  constructor(
    private router: Router,
    private primengConfig: PrimeNGConfig
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  async ngOnInit() {
    this.primengConfig.ripple = true;
    document.documentElement.style.fontSize = '14px';

    // this.initMidtrans();
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
