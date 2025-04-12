import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LazyLoadEvent } from 'primeng/api';
import { PagingInfo } from 'src/app/interface/paging_info';
import { User, UserRole } from 'src/app/interface/user';
import SharedUtil from 'src/app/lib/shared.util';
import { ApiService } from './../../../service/api.service';
import { ToastService } from 'src/app/service/toast.service';
import { SharedService } from 'src/app/service/shared.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['../../../../assets/styles/user.styles.scss'],
})
export class UserComponent extends SharedUtil implements OnInit {
  isLoading: boolean = true;
  pagingInfo = {} as PagingInfo;
  showUserDialog: boolean = false;

  users = [] as User[];
  userRoles = [] as UserRole[];
  selectedUser = {} as User;

  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private toastService: ToastService,
    private apiService: ApiService
  ) {
    super();

    this.form = this.formBuilder.group({
      id: [null],
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      password: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(255)]],
      roleId: [null, [Validators.required]],
      status: [true, [Validators.required]],
      createdAt: [null],
    });
  }

  ngOnInit() {
    this.apiService.getUserRoles().subscribe((res) => {
      if (res.status === 200) this.userRoles = res.data;
    });
  }

  getUsers(e?: LazyLoadEvent) {
    this.showUserDialog = false;
    this.isLoading = true;
    this.pagingInfo = {
      filter: e?.filters?.global?.value ?? '',
      limit: e?.rows ?? 20,
      offset: e?.first ?? 0,
      sortField: e?.sortField ?? 'name',
      sortOrder: e?.sortOrder ? (e.sortOrder === 1 ? 'ASC' : 'DESC') : 'ASC',
    };

    this.apiService.getUsers(this.pagingInfo).subscribe((res) => {
      this.isLoading = false;
      if (res.status === 200) {
        this.users = res.data;
        if (res.rowCount !== this.pagingInfo.rowCount) this.pagingInfo.rowCount = res.rowCount;
      } else this.toastService.errorToast('Failed to get Users.');
    });
  }

  onSubmit() {
    if (this.isLoading || this.form.invalid) return;
    this.isLoading = true;

    const req: User = this.form.getRawValue();
    req.name = this.capitalize(req.name);
    try {
      if (this.selectedUser) {
        this.apiService.updateUser(req).subscribe((res) => {
          if (res.status === 200) this.getUsers();
          else this.toastService.errorToast(res.message);
        });
      } else {
        this.apiService.register(req).subscribe((res) => {
          if (res.status === 200) this.getUsers();
          else this.toastService.errorToast(res.message);
        });
      }
    } finally {
      this.isLoading = false;
    }
  }

  onAdd() {
    this.resetUserDialog();
    this.showUserDialog = true;
    this.form.get('status').setValue(true);
    this.form.get('username').enable();
  }

  onEdit() {
    this.showUserDialog = true;
    this.form.patchValue(this.selectedUser);
    this.form.get('username').disable();

    if (this.selectedUser.id === this.sharedService.user.id) {
      this.form.get('roleId').disable();
    } else {
      this.form.get('roleId').enable();
    }
  }

  onDelete() {
    this.sharedService.showConfirm('Are you sure to delete this user?', () => {
      this.sharedService.showNotification('Success!', '😍');
      this.resetUserDialog();
    });
  }

  resetUserDialog() {
    this.showUserDialog = false;
    this.selectedUser = null;
    this.form.reset();
  }
}
