import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LazyLoadEvent } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { Product, ProductOptions } from 'src/app/interface/product';
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
  saveProductOptions: boolean = false;
  showProductOptionsDialog: boolean = false;

  products = [] as Product[];

  selectedProduct!: Product;
  selectedProductImage!: Nullable<{ file: File; preview: string }>;
  selectedProductOptions = [] as ProductOptions[];
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
      userCreated: ['', [Validators.required]],
      options: this.formBuilder.array([]),
    });
  }

  getProducts(e?: LazyLoadEvent) {
    this.isLoading = true;
    this.resetProductDialog();
    this.pagingInfo = {
      filter: e?.filters?.global?.value || '',
      limit: e?.rows || 10,
      offset: e?.first || 0,
      sortField: e?.sortField || 'ID',
      sortOrder: e?.sortOrder ? (e.sortOrder === 1 ? 'ASC' : 'DESC') : 'ASC',
    };
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

  options(): FormArray {
    return this.productForm.get('options') as FormArray;
  }

  addOption() {
    this.options().push(
      this.formBuilder.group({
        id: [null],
        name: ['', [Validators.required]],
        multiple: [false],
        required: [false],
        values: this.formBuilder.array([]),
      })
    );
    this.addOptionValues(this.options().length - 1);
  }

  deleteOption(index: number) {
    this.options().removeAt(index);
  }

  optionValues(optionIndex: number): FormArray {
    return this.options().at(optionIndex).get('values') as FormArray;
  }

  addOptionValues(optionIndex: number) {
    this.optionValues(optionIndex).push(
      this.formBuilder.group({
        id: [null],
        value: ['', [Validators.required]],
        price: [null, [Validators.required]],
      })
    );
  }

  deleteOptionValues(optionIndex: number, optionValuesIndex: number) {
    this.optionValues(optionIndex).removeAt(optionValuesIndex);
  }

  openProductOptionsDialog() {
    if (this.isEmpty(this.selectedProductOptions)) {
      this.selectedProductOptions = this.selectedProduct?.options;
    }
    if (this.options().length === 0) this.addOption();
    this.saveProductOptions = false;
    this.showProductOptionsDialog = true;
  }

  onHideProductOptionsDialog() {
    if (this.saveProductOptions) {
      this.selectedProductOptions = this.options().value;
    } else {
      this.options().clear();
      for (let i = 0; i < this.selectedProductOptions?.length; i++) this.addOption();
      this.options().patchValue(this.selectedProductOptions);
    }
  }

  onSaveProductOptions() {
    // TODO: validate, change flag when done
    this.saveProductOptions = true;
    this.showProductOptionsDialog = false;
  }

  getSelectedProductOptionsName() {
    let data: string[] = [];
    this.options().controls.forEach((d: FormControl) => {
      data.push(d.value.name);
    });

    return data.length === 0 ? 'No Options' : data.join(', ');
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
    this.apiService.saveProduct(this.productForm.value, [this.selectedProductImage.file]).subscribe((res) => {
      if (res.status === 200) {
        console.log('res', res);
        // this.getProducts();
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
    this.productForm.reset();
    this.productForm.get('status').setValue(true);
    this.options().clear();
  }

  onAddProduct() {
    // this.getCategories();
    this.resetProductDialog();
    this.showProductDialog = true;
  }

  onEditProduct() {
    if (this.isEmpty(this.selectedProduct)) return;
    // this.getCategories();
    if (this.selectedProduct.options) this.selectedProduct.options.forEach(() => this.addOption());
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

  resetNode() {
    // const nodes = this.categories as TreeNode[];
    // nodes.forEach((node) => {
    //   if (node.partialSelected) node.partialSelected = false;
    //   if (node.children) {
    //     node.expanded = true;
    //     for (let subChildren of node.children) {
    //       subChildren.expanded = true;
    //       if (subChildren.partialSelected) subChildren.partialSelected = false;
    //     }
    //   }
    // });
    // this.selectedCategory = null;
  }
}
