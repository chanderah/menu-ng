import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Order } from './../interface/order';
import { isEmpty, jsonParse } from './../lib/object';
import { LayoutService } from './service/app.layout.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent implements OnInit {
  @ViewChild('menubutton') menuButton!: ElementRef;
  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;
  @ViewChild('topbarmenu') menu!: ElementRef;

  constructor(public layoutService: LayoutService) {
    layoutService.showProfileSidebar();
  }

  ngOnInit(): void {
    // window.addEventListener('storage', function (e) {
    //   console.log(e);
    // });
  }

  private listener = () => {
    // this.getCartItems();
  };

  getCartItems() {
    const cartItems: Order[] = jsonParse(localStorage.getItem('cart'));
    if (isEmpty(cartItems)) return '0';
    return cartItems.length.toString();
  }
}
