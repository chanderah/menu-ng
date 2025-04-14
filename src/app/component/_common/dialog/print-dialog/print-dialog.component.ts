import { ApplicationRef, Component, EventEmitter, Input, Output } from '@angular/core';
import SharedUtil from 'src/app/lib/shared.util';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { SharedService } from 'src/app/service/shared.service';
@Component({
  selector: 'app-print-dialog',
  templateUrl: './print-dialog.component.html',
  styleUrls: ['./print-dialog.component.scss'],
})
export class PrintDialogComponent extends SharedUtil {
  @Input() targetId!: string; // div id
  @Input() showDialog: boolean = false;
  @Input() isDisabledPrint: boolean = false;
  @Output() onPrinting = new EventEmitter<boolean>();
  @Output() onShowDialogChange = new EventEmitter<boolean>();

  constructor(
    private sharedService: SharedService,
    private appRef: ApplicationRef
  ) {
    super();
  }

  onClickPrint() {
    this.onPrinting.emit(true);
    this.appRef.tick();
    try {
      const content = document.getElementById(this.targetId);
      html2canvas(content).then((canvas) => {
        const imgWidth = 88;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let pdf = new jsPDF({
          orientation: 'portrait',
          compress: false,
          format: [imgWidth + 2, imgHeight + 2],
        });
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 1, 1, imgWidth, imgHeight);
        // pdf.save(`invoices-${new Date().getTime()}.pdf`);
        // pdf.autoPrint();
        // window.open(pdf.output('bloburl'));
        // pdf.output('dataurlnewwindow');
        pdf.autoPrint();

        const frame = document.createElement('iframe');
        frame.style.position = 'fixed';
        frame.style.width = '1px';
        frame.style.height = '1px';
        frame.style.opacity = '0.01';
        const isSafari = /^((?!chrome|android).)*safari/i.test(window.navigator.userAgent);
        if (isSafari) {
          // fallback in safari
          frame.onload = () => {
            try {
              frame.contentWindow.document.execCommand('print', false, null);
            } catch (e) {
              frame.contentWindow.print();
            }
          };
        }
        frame.src = pdf.output('bloburl').toString();
        document.body.appendChild(frame);
      });
    } catch (err) {
      this.sharedService.showErrorNotification();
    } finally {
      this.onPrinting.emit(false);
    }
  }

  hideDialog() {
    this.onShowDialogChange.emit(false);
  }
}
