export interface PagingInfo {
    field?: Field;
    filter: string;
    limit: number | 10 | 25 | 50 | 100;
    offset: number; //0
    sortField: string; //dateCreated
    sortOrder: 'ASC' | 'DESC'; //ASC : DESC
    rowCount?: number;
}

interface Field {
    column: string; //category
    value: string | number; // 0
}
