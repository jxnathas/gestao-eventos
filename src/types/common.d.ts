export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
}
  
export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
}

export interface Upload {
    id: string;
    url: string;
    eventId: string;
}