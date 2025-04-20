import { TagModule } from 'primeng/tag';
import { Component, Input } from '@angular/core';
import { CONSTANTS } from 'src/app/constant/common';
import { Order } from 'src/app/interface/order';

@Component({
  standalone: true,
  imports: [TagModule],
  selector: 'app-badge',
  template: `
    <!-- prettier-ignore -->
    <div class="w-fit" style="display: inline-block; vertical-align: middle;">
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
