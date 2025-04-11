import { Component, Input } from '@angular/core';
import { CONSTANTS } from 'src/app/constant/common';
import { Order } from 'src/app/interface/order';

@Component({
  selector: 'app-badge',
  template: `
    <div class="w-fit">
      <!-- prettier-ignore -->
      <p-tag
        [value]="constants.ORDER_STATUS[data.status]"
        [severity]="severity[data.status] ?? 'primary'"
        [rounded]="true">
      </p-tag>
    </div>
  `,
})
export class BadgeComponent {
  @Input() data!: Order;
  constants = CONSTANTS;
  severity = {
    expire: 'secondary',
    deny: 'danger',
    pending: 'warning',
    capture: 'success',
    settlement: 'success',
    complete: 'info',
  };

  constructor() {}
}
