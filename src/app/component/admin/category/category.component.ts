import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TreeNode } from 'primeng/api';
import SharedUtil from 'src/app/lib/shared.util';
import { Category } from '../../../interface/category';
import { PagingInfo } from '../../../interface/paging_info';
import { ApiService } from '../../../service/api.service';
import { SharedService } from './../../../service/shared.service';

@Component({
    selector: 'app-category',
    templateUrl: './category.component.html',
    styleUrls: ['../../../../assets/user.styles.scss'],
})
export class CategoryComponent extends SharedUtil implements OnInit {
    isLoading: boolean = false;
    showCategoryDialog: boolean = false;
    dialogBreakpoints = { '768px': '90vw' };

    pagingInfo = {} as PagingInfo;

    categories = [] as Category[];
    selectedCategory!: TreeNode;

    form: FormGroup = this.formBuilder.group({
        id: [0],
        label: ['', [Validators.maxLength(255), Validators.required]],
    });

    constructor(
        private formBuilder: FormBuilder,
        public sharedService: SharedService,
        private apiService: ApiService
    ) {
        super();
    }

    ngOnInit() {
        this.resetCategoryDialog();
    }

    async onSubmit() {
        this.isLoading = true;
        try {
            const observable = this.isEmpty(this.selectedCategory)
                ? this.apiService.createCategory(this.form.value)
                : this.apiService.updateCategory(this.form.value);

            observable.subscribe((res) => {
                if (res.status === 200) {
                    this.resetCategoryDialog();
                } else this.sharedService.errorToast(res.message);
            });
        } finally {
            this.isLoading = false;
        }
    }

    resetCategoryDialog() {
        this.showCategoryDialog = false;
        this.selectedCategory = null;
        this.form.reset();
        this.sharedService.loadCategories();
    }

    onDeleteCategory() {
        if (this.isEmpty(this.selectedCategory)) return;
        this.isLoading = true;
        this.apiService.deleteCategory(this.form.value).subscribe((res: any) => {
            this.isLoading = false;
            if (res.status === 200) {
                this.sharedService.refreshPage();
            } else this.sharedService.errorToast(res.message);
        });
    }

    onAddCategory() {
        this.resetNode();
        this.resetCategoryDialog();
        this.showCategoryDialog = true;
    }

    onEditCategory() {
        if (this.isEmpty(this.selectedCategory)) return;
        this.apiService.findCategoryById(this.selectedCategory as Category).subscribe((res: any) => {
            if (res.status === 200) {
                this.form.patchValue(res.data);
                this.showCategoryDialog = true;
            } else {
                this.sharedService.errorToast('Invalid session!');
                return this.sharedService.refreshPage();
            }
        });
    }

    resetNode() {
        const nodes = this.categories as TreeNode[];
        nodes.forEach((node) => {
            if (node.partialSelected) node.partialSelected = false;
            if (node.children) {
                node.expanded = true;
                for (let subChildren of node.children) {
                    subChildren.expanded = true;
                    if (subChildren.partialSelected) subChildren.partialSelected = false;
                }
            }
        });
        this.selectedCategory = null;
    }
}
