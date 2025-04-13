import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'currency',
})
export class CustomCurrencyPipe implements PipeTransform {
  transform(val: string) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(Number(val));
  }
}
