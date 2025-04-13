import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import SharedUtil from 'src/app/lib/shared.util';

@Component({
  selector: 'app-print-dialog',
  templateUrl: './print-dialog.component.html',
  styleUrls: ['./print-dialog.component.scss'],
})
export class PrintDialogComponent extends SharedUtil implements OnInit {
  @Input() showDialog: boolean = false;
  @Output() onShowDialogChange = new EventEmitter<boolean>();

  isLoading: boolean = false;

  constructor() {
    // private sharedService: SharedService
    super();
  }

  ngOnInit(): void {}

  onPrint() {
    this.isLoading = true;
    this.isLoading = false;
  }

  hideDialog() {
    this.onShowDialogChange.emit(true);
  }
}
