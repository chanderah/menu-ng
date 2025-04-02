import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LazyLoadEvent } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { Product, ProductOption, ProductOptionValue } from 'src/app/interface/product';
import SharedUtil from 'src/app/lib/shared.util';
import { PagingInfo } from '../../../interface/paging_info';
import { UploadEvent } from '../../../interface/upload_event';
import { resizeImg } from '../../../lib/image_resizer';
import { ApiService } from '../../../service/api.service';
import { SharedService } from './../../../service/shared.service';
import { Nullable } from 'src/app/interface/common';
import { fileToBase64 } from 'src/app/lib/utils';

@Component({
  templateUrl: './product.component.html',
  styleUrls: ['../../../../assets/user.styles.scss'],
  styles: [
    `
      :host ::ng-deep {
        .p-progressbar {
          height: 0.5rem;
        }
      }
    `,
  ],
})
export class ProductComponent extends SharedUtil implements OnInit {
  isLoading: boolean = true;
  dialogBreakpoints = { '768px': '90vw' };

  pagingInfo = {} as PagingInfo;

  showProductDialog: boolean = false;
  showProductOptionsDialog: boolean = false;

  products = [] as Product[];

  selectedProduct!: Product;
  selectedProductImage!: Nullable<{ file: File; preview: string }>;
  selectedProductOptions!: ProductOption[]; // temp
  productForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    public sharedService: SharedService
  ) {
    super();
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.productForm = this.formBuilder.group({
      id: [null, []],
      image: [null, []],
      name: ['', [Validators.required]],
      code: ['', []],
      categoryId: [null, []],
      description: ['', [Validators.maxLength(100)]],
      price: [0, [Validators.required]],
      featured: [false],
      status: [true],
      userCreated: [0, [Validators.required]],
      options: this.formBuilder.array([]),
    });
  }

  getProducts(e?: LazyLoadEvent) {
    this.resetProductDialog();
    this.pagingInfo = {
      filter: e?.filters?.global?.value || '',
      limit: e?.rows || 10,
      offset: e?.first || 0,
      sortField: e?.sortField || 'ID',
      sortOrder: e?.sortOrder ? (e.sortOrder === 1 ? 'ASC' : 'DESC') : 'ASC',
    };

    this.isLoading = true;
    this.apiService.getProducts(this.pagingInfo).subscribe((res: any) => {
      this.isLoading = false;
      if (res.status === 200) {
        this.products = res.data;
        if (res.rowCount !== this.pagingInfo.rowCount) this.pagingInfo.rowCount = res.rowCount;
      } else {
        this.sharedService.errorToast(res.message);
      }
    });
  }

  getCategoryLabel(categoryId: number) {
    if (!categoryId) return;
    return this.sharedService.categories.find((d) => d.id === categoryId)?.label;
  }

  async onSelectImage(e: UploadEvent, fileUpload: FileUpload) {
    try {
      const file = await resizeImg<File>(e.files[0]);
      this.selectedProductImage = {
        file,
        preview: await fileToBase64(file),
      };
    } catch (err) {
      this.sharedService.errorToast(err);
    } finally {
      fileUpload.clear();
    }
  }

  async onSubmit() {
    this.isLoading = true;
    this.apiService.saveProduct(this.productForm.value, [this.selectedProductImage?.file]).subscribe((res) => {
      if (res.status === 200) {
        this.getProducts();
      } else {
        this.isLoading = false;
        this.sharedService.errorToast(res.message);
      }
    });
  }

  resetProductDialog() {
    this.showProductDialog = false;
    this.selectedProduct = null;
    this.selectedProductImage = null;
    this.initForm();
    this.options().clear();
  }

  onAddProduct() {
    this.resetProductDialog();
    this.showProductDialog = true;
  }

  onEditProduct() {
    this.selectedProduct.options.forEach((v) => this.addOption(v));
    this.productForm.patchValue(this.selectedProduct);
    this.showProductDialog = true;
  }

  onDeleteProduct() {
    if (this.isEmpty(this.selectedProduct)) return;
    this.sharedService.showConfirm('Are you sure to delete this product?').then((res) => {
      if (res) {
        this.isLoading = true;
        this.apiService.deleteProduct(this.selectedProduct).subscribe((res: any) => {
          this.isLoading = false;
          if (res.status === 200) {
            this.getProducts();
            this.sharedService.successToast('Product is deleted!');
          } else this.sharedService.errorToast('Failed to delete the product.');
        });
      }
    });
  }

  openProductOptionsDialog() {
    this.selectedProductOptions = this.options().getRawValue();
    if (this.options().length === 0) this.addOption();

    this.showProductOptionsDialog = true;
  }

  onHideProductOptionsDialog() {
    if (this.selectedProductOptions) {
      this.options().clear();
      this.selectedProductOptions.forEach((v) => {
        this.addOption(v);
      });
      this.selectedProductOptions = null;
    }
  }

  onSaveProductOptions() {
    // TODO: validate, change flag when done
    this.selectedProductOptions = null;
    this.showProductOptionsDialog = false;
  }

  getSelectedProductOptionsName() {
    let data: string[] = [];
    this.options().controls.forEach((d: FormControl) => {
      data.push(d.value.name);
    });

    return data.length === 0 ? 'No Options' : data.join(', ');
  }

  options(): FormArray {
    return this.productForm.get('options') as FormArray;
  }

  option(i: number) {
    return this.options().at(i);
  }

  addOption(data?: ProductOption) {
    this.options().push(
      this.formBuilder.group({
        id: [null],
        productId: [null],
        name: ['', [Validators.required]],
        multiple: [false],
        required: [false],
        values: this.formBuilder.array([]),
      })
    );

    const optionIndex = this.options().length - 1;
    if (data) {
      data.values.forEach((v) => this.addOptionValue(optionIndex, v));
      this.options().at(optionIndex).patchValue(data);
    } else {
      this.addOptionValue(optionIndex);
    }
  }

  deleteOption(index: number) {
    this.options().removeAt(index);
  }

  optionValues(optionIndex: number): FormArray {
    return this.options().at(optionIndex).get('values') as FormArray;
  }

  optionValue(optionIndex: number, i: number) {
    return this.optionValues(optionIndex).at(i);
  }

  addOptionValue(optionIndex: number, data?: ProductOptionValue) {
    this.optionValues(optionIndex).push(
      this.formBuilder.group({
        id: [null],
        value: ['', [Validators.required]],
        price: [null, [Validators.required]],
      })
    );

    if (data) {
      const i = this.optionValues(optionIndex).length - 1;
      this.optionValue(optionIndex, i).patchValue(data);
    }
  }

  deleteOptionValue(optionIndex: number, optionValueIndex: number) {
    this.optionValues(optionIndex).removeAt(optionValueIndex);
  }
}
