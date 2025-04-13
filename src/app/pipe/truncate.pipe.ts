import { Pipe, PipeTransform } from '@angular/core';
import { isEmpty } from '../lib/utils';
@Pipe({
  name: 'truncate',
})
export class TruncatePipe implements PipeTransform {
  transform(value: string | number, maxLength: number): string {
    if (isEmpty(value)) return '';

    const stringValue = value.toString();
    if (stringValue.length <= maxLength) return stringValue;

    return stringValue.slice(0, maxLength) + '...';
  }
}
