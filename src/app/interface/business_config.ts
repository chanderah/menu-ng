export type MappedBusinessConfig = { [x: string]: string };
export interface BusinessConfig {
  id: number;
  param: string;
  value: string;
  updatedAt: Date;
  createdAt: Date;
}
