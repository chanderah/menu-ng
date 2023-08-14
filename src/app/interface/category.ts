export interface Category {
    id: number;
    parentId: number;
    order: number;
    label: string;
    icon: string;
    status: string;
    userCreated: number;
    updatedAt: Date;
    createdAt: Date;
}
