import { Aes256Service } from '../../../service/aes256.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import SharedUtil from 'src/app/lib/shared.util';
import { trim } from 'src/app/lib/utils';
import { PagingInfo } from '../../../interface/paging_info';
import { ApiService } from '../../../service/api.service';
import { SharedService } from '../../../service/shared.service';
import { environment } from 'src/environments/environment';
import { ToastService } from 'src/app/service/toast.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  // styleUrls: ['../../../../assets/styles/user.styles.scss'],
})
export class TableComponent extends SharedUtil implements OnInit {
  isLoading: boolean = true;

  pagingInfo: PagingInfo = {
    filter: '',
    limit: 10,
    offset: 0,
    sortField: 'id',
    sortOrder: 'DESC',
  };

  showTableDialog: boolean = false;
  tables = [] as Table[];
  selectedTable!: Table;
  form!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private toastService: ToastService,
    private apiService: ApiService,
    private aes256Service: Aes256Service
  ) {
    super();
  }

  ngOnInit() {
    this.setForm();
    this.getTables();
  }

  getTables(e?: LazyLoadEvent) {
    this.isLoading = true;
    if (e) {
      this.pagingInfo = {
        filter: e.globalFilter,
        limit: e.rows,
        offset: e.first,
        sortField: e.sortField,
        sortOrder: e.sortOrder === 1 ? 'ASC' : 'DESC',
      };
    }

    this.apiService.getTables(this.pagingInfo).subscribe((res) => {
      this.isLoading = false;
      if (res.status === 200) {
        this.tables = res.data;
        this.pagingInfo.rowCount = res.rowCount;
      } else {
        this.toastService.errorToast('Failed to get Tables data.');
      }
    });
  }

  onSubmit() {
    this.isLoading = true;
    try {
      if (this.isEmpty(this.selectedTable)) {
        this.apiService.createTable(this.form.value).subscribe((res) => {
          if (res.status === 200) {
            this.getTables();
            this.toastService.successToast('Success!');
          } else {
            this.toastService.errorToast('Failed to create.');
          }
        });
      } else {
        this.apiService.updateTable(this.form.value).subscribe((res) => {
          if (res.status === 200) {
            this.getTables();
            this.toastService.successToast('Success!');
          } else {
            this.toastService.errorToast('Failed to create.');
          }
        });
      }
    } finally {
      this.isLoading = false;
    }
  }

  onAdd() {
    this.setForm();
    this.form.get('status').setValue(true);
    this.showTableDialog = true;
  }

  onEdit() {
    this.setForm();

    const tableParam = this.aes256Service.encrypt(this.selectedTable.id.toString());
    this.form.patchValue({
      ...this.selectedTable,
      barcode: `${environment.appUrl}?table=${encodeURIComponent(tableParam)}`,
    });

    this.showTableDialog = true;
  }

  downloadQrCode() {
    const canvas = document.getElementById('qrcode').children[0] as HTMLCanvasElement;

    const a = document.createElement('a');
    a.setAttribute('download', trim(this.form.get('name').value).toLowerCase() + '.png');
    canvas.toBlob(function (blob) {
      const url = URL.createObjectURL(blob);
      a.setAttribute('href', url);
      a.click();
    });
  }

  setForm() {
    this.form = this.formBuilder.group({
      id: [null],
      name: ['', [Validators.maxLength(255), Validators.required]],
      barcode: ['', [Validators.maxLength(255), Validators.required]],
      status: [true, [Validators.maxLength(255), Validators.required]],
      createdBy: [this.sharedService.user.id],
    });
  }
}
