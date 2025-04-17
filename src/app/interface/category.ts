export interface Category {
  id: number;
  parentId: number;
  order: number;
  label: string;
  icon: string;
  param?: string;
  status: string;
  createdBy: number;
  updatedAt: Date;
  createdAt: Date;
}
