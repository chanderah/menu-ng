import { AuditTrail } from './audit_trail';

export interface Table extends AuditTrail {
    id: number;
    name?: string;
    barcode?: number;
    status?: boolean;
}
