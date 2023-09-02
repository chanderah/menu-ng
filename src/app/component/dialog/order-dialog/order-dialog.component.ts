import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import SharedUtil from 'src/app/lib/shared.util';
import { Product } from './../../../interface/product';
import { CartService } from './../../../service/cart.service';
import { SharedService } from './../../../service/shared.service';

@Component({
    selector: 'app-order-dialog',
    templateUrl: './order-dialog.component.html',
    styleUrls: ['./order-dialog.component.scss']
})
export class OrderDialogComponent extends SharedUtil implements OnInit {
    @Output() onChange = new EventEmitter<boolean>();
    @Input() selectedProduct: Product;
    @Input() showDialog: boolean;

    orderForm: FormGroup;

    constructor(
        private router: Router,
        private formBuilder: FormBuilder,
        private cartService: CartService,
        private sharedService: SharedService
    ) {
        super();
        this.orderForm = this.formBuilder.group({
            // categoryId: [{ value: null, disabled: true }],
            tableId: [{ value: null, disabled: true }, [Validators.required]],
            notes: ['', [Validators.maxLength(255)]],
            listProduct: this.formBuilder.array([])
        });
    }

    ngOnInit(): void {
        console.log(this.selectedProduct);
    }

    hideDialog() {
        this.onChange.emit((this.showDialog = false));
    }

    onClickWa() {
        let url =
            'https://api.whatsapp.com/send?phone=6287798992777&text=Halo,%20saya%20ingin%20menanyakan%20tentang%20';
        window.open(url + this.selectedProduct.name, '_blank');
    }

    insertToCart() {
        // this.sharedService.showConfirm().then((res) => {
        //     if (res) {
        this.cartService.addToCart(this.selectedProduct);
        this.hideDialog();
        // }
        // });
    }

    resetForm() {
        this.orderForm.reset();
    }

    // @HostListener('window:scroll')
    // onWindowScroll() {
    //     const offset = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    //     console.log(offset);
    // }
}
