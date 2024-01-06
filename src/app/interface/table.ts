import { AuditTrail } from './audit_trail';

export interface Table extends AuditTrail {
    id?: number;
    tableId?: number;
    name?: string;
    barcode?: number;
    status?: boolean;
}
