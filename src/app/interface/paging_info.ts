export interface PagingInfo {
  condition?: PagingInfoCondition[];
  filter?: string;
  limit: number | 10 | 25 | 50 | 100;
  offset?: number; //0
  sortField?: string; //dateCreated
  sortOrder?: 'ASC' | 'DESC'; //ASC : DESC
  rowCount?: number;
}

interface PagingInfoCondition {
  column: string;
  value: string | number | boolean | string[] | number[] | boolean[];
}
