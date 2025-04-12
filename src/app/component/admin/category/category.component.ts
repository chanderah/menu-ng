import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TreeNode } from 'primeng/api';
import SharedUtil from 'src/app/lib/shared.util';
import { Category } from '../../../interface/category';
import { PagingInfo } from '../../../interface/paging_info';
import { ApiService } from '../../../service/api.service';
import { SharedService } from './../../../service/shared.service';
import { ToastService } from 'src/app/service/toast.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['../../../../assets/styles/user.styles.scss'],
})
export class CategoryComponent extends SharedUtil implements OnInit {
  isLoading: boolean = true;
  showCategoryDialog: boolean = false;

  pagingInfo = {} as PagingInfo;

  nodes = [] as TreeNode<Category>[];
  selectedNode!: TreeNode<Category>;

  form: FormGroup = this.formBuilder.group({
    id: [0],
    label: ['', [Validators.maxLength(255), Validators.required]],
  });

  constructor(
    private formBuilder: FormBuilder,
    public sharedService: SharedService,
    private toastService: ToastService,
    private apiService: ApiService
  ) {
    super();
  }

  ngOnInit() {
    this.resetCategoryDialog();
    this.sharedService.categories$.subscribe((res) => {
      this.isLoading = false;
      this.nodes = res.map((v) => {
        return {
          data: v,
          label: v.label,
          draggable: true,
        };
      });
    });
  }

  async onSubmit() {
    this.isLoading = true;
    try {
      const observable = this.isEmpty(this.selectedNode)
        ? this.apiService.createCategory(this.form.value)
        : this.apiService.updateCategory(this.form.value);

      observable.subscribe((res) => {
        if (res.status === 200) {
          this.resetCategoryDialog();
        } else this.toastService.errorToast(res.message);
      });
    } finally {
      this.isLoading = false;
    }
  }

  resetCategoryDialog() {
    this.showCategoryDialog = false;
    this.selectedNode = null;
    this.form.reset();
    this.sharedService.loadCategories().subscribe();
  }

  onDeleteCategory() {
    if (this.isEmpty(this.selectedNode)) return;
    this.isLoading = true;
    this.apiService.deleteCategory(this.form.value).subscribe((res) => {
      this.isLoading = false;
      if (res.status === 200) {
        this.refreshPage();
      } else this.toastService.errorToast(res.message);
    });
  }

  onAdd() {
    this.resetNode();
    this.resetCategoryDialog();
    this.showCategoryDialog = true;
  }

  onNodeSelect(node: TreeNode) {
    this.selectedNode = node;
    this.apiService.findCategoryById(this.selectedNode.data).subscribe((res) => {
      this.showCategoryDialog = true;
      if (res.status === 200) {
        this.form.patchValue(res.data);
      } else {
        this.toastService.errorToast('Invalid session!');
        this.refreshPage();
      }
    });
  }

  onNodeDrop(e: any) {
    // const dragNode = e.dragNode;
    // const dropNode = e.dropNode;
    // const dragIndex = this.nodes.findIndex((v) => v.data.id === dragNode.data.id);
    // const dropIndex = this.nodes.findIndex((v) => v.data.id === dropNode.data.id);
    // console.log('nodes', this.nodes);
    // console.log('e', e);
    // console.log('dragIndex', dragIndex);
    // console.log('dropIndex', dropIndex);
    // this.nodes.splice(dragIndex, 1);
    // let insertIndex = dropIndex;
    // if (insertIndex === -1 || insertIndex === undefined) {
    //   // Drop to empty space = push to end
    //   this.nodes.push(dragNode);
    // } else {
    //   // Adjust index if dragging downward
    //   insertIndex = dragIndex < insertIndex ? insertIndex - 1 : insertIndex;
    //   this.nodes.splice(insertIndex, 0, dragNode);
    // }
  }

  resetNode() {
    this.nodes.forEach((node) => {
      if (node.partialSelected) node.partialSelected = false;
      if (node.children) {
        node.expanded = true;
        for (let subChildren of node.children) {
          subChildren.expanded = true;
          if (subChildren.partialSelected) subChildren.partialSelected = false;
        }
      }
    });
    this.selectedNode = null;
  }
}
