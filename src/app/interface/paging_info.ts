export interface PagingInfo {
  condition?: PagingInfoCondition[];
  filter?: string;
  limit: number | 10 | 25 | 50 | 100;
  page?: number;
  offset?: number;
  sortField?: string; //id
  sortOrder?: 'ASC' | 'DESC'; //ASC : DESC
  rowCount?: number;
}

interface PagingInfoCondition {
  column: string;
  value: string | number | boolean | string[] | number[] | boolean[];
}
