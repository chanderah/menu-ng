export interface ApiResponse<T> {
    status: number;
    message: string;
    data: T;
    rowCount: number;
}
