import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  standalone: true,
  name: 'stripe',
})
export class StripePipe implements PipeTransform {
  transform(val: string) {
    return val || '-';
  }
}
