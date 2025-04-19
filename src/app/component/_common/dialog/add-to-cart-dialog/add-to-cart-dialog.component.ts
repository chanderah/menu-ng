import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import SharedUtil from 'src/app/lib/shared.util';
import { capitalize } from 'src/app/lib/utils';
import { Product, ProductOption } from '../../../../interface/product';
import { CustomerService } from 'src/app/service/customer.service';
import { ProductOrder } from 'src/app/interface/order';
import { ToastService } from 'src/app/service/toast.service';
import { SharedService } from 'src/app/service/shared.service';

@Component({
  selector: 'app-add-to-cart-dialog',
  templateUrl: './add-to-cart-dialog.component.html',
  styleUrls: ['../../../../../assets/styles/user.styles.scss'],
})
export class AddToCartDialogComponent extends SharedUtil implements OnInit {
  @Output() onHide = new EventEmitter<boolean>();
  @Input() data!: Product;

  showDialog: boolean = true;
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private toastService: ToastService,
    private sharedService: SharedService
  ) {
    super();
  }

  ngOnInit(): void {
    this.setForm();
  }

  increment() {
    const value = this.form.get('quantity').value;
    this.form.get('quantity').setValue(value + 1);
  }

  decrement() {
    const value = this.form.get('quantity').value;
    this.form.get('quantity').setValue(value - 1 || 1);
  }

  onSelectOptionValue(isMultiple: boolean, i: number, j: number) {
    if (!isMultiple) {
      this.optionValues(i).controls.forEach((ctrl, i) => {
        if (i !== j) ctrl.get('selected').setValue(false);
      });
    }
  }

  onSubmit() {
    if (this.isDisabledAddToCartBtn) {
      return this.toastService.errorToast('Please select the required variant.');
    }

    this.customerService.addToCart(this.form.value);
    this.hideDialog();
  }

  onClickWhatsapp() {
    const message = `Halo, saya ingin menanyakan tentang produk ${capitalize(this.data.name)}.`.replace(' ', '%20');
    const url = `https://api.whatsapp.com/send?phone=${this.sharedService.whatsapp}&text=${message}`;
    window.open(url, '_blank');
  }

  hideDialog() {
    this.onHide.emit(true);
  }

  // FORMS
  setForm() {
    this.form = this.fb.group({
      id: [0],
      image: [''],
      code: [''],
      name: [''],
      categoryId: [0],
      price: [0],
      options: this.fb.array([]),

      notes: [''],
      quantity: [1, [Validators.required, Validators.min(1)]],
      totalPrice: [0, [Validators.required, Validators.min(1)]],
    });

    this.data.options.forEach((v) => this.addOption(v));
    this.form.patchValue({
      ...this.data,
      quantity: 1,
      totalPrice: this.data.price * 1,
    });

    this.form.valueChanges.subscribe((v: ProductOrder) => {
      let price = v.price;
      v.options.forEach((option) => {
        option.values.forEach((data) => {
          if (data.selected) price += data.price;
        });
      });
      this.form.get('totalPrice').setValue(price * v.quantity, { emitEvent: false });
    });
  }

  options() {
    return this.form.get('options') as FormArray;
  }

  addOption(data: ProductOption) {
    this.options().push(
      this.fb.group({
        name: [''],
        multiple: [false],
        required: [false],
        values: this.fb.array([]),
      })
    );

    const i = this.options().length - 1;
    data.values.forEach(() => this.addOptionValue(i));
  }

  optionValues(i: number) {
    return this.options().at(i).get('values') as FormArray;
  }

  addOptionValue(i: number) {
    this.optionValues(i).push(
      this.fb.group({
        value: [''],
        price: [0],
        selected: [false],
      })
    );
  }

  get isDisabledAddToCartBtn() {
    const productOrder = this.form.value as ProductOrder;
    productOrder.options.forEach((option) => {
      if (option.required) {
        const selectedOption = option.values.filter((v) => v.selected);
        if (!selectedOption.length) return true;
      }
    });
    return false;
  }

  // ngOnInit(): void {
  //   ;
  //   for (let i = 0; i < this.selectedProduct?.options.length; i++) {
  //     this.addOption();
  //     this.selectedProduct.options[i]?.values.forEach(() => this.addOptionValues(i));
  //   }
  //   this.orderForm.patchValue(this.selectedProduct);
  //   console.log(this.orderForm.value);

  //   this.init = false;
  //   this.orderForm.get('quantity').setValue(1);
  // }

  // onClickOptionValuesRow(optionIndex: number, optionValuesIndex: number) {
  //   this.optionValues(optionIndex)
  //     .at(optionValuesIndex)
  //     .get('selected')
  //     .setValue(!this.optionValues(optionIndex).at(optionValuesIndex).get('selected').value);
  // }

  // options(): FormArray {
  //   return this.orderForm.get('options') as FormArray;
  // }

  // addOption() {
  //   this.options().push(
  //     this.formBuilder.group({
  //       name: ['', [Validators.required]],
  //       multiple: [false, [Validators.required]],
  //       required: [false, [Validators.required]],
  //       values: this.formBuilder.array([]),
  //     })
  //   );
  // }

  // optionValues(optionIndex: number): FormArray {
  //   return this.options().at(optionIndex).get('values') as FormArray;
  // }

  // addOptionValues(optionIndex: number) {
  //   this.optionValues(optionIndex).push(
  //     this.formBuilder.group({
  //       value: ['', [Validators.required]],
  //       price: [null, [Validators.required]],
  //       selected: [false, [Validators.required]],
  //     })
  //   );
  // }
}
