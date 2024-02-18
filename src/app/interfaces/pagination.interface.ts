export interface Pagination {
    currentPage: number;
    totalPages: number;
    totalDocuments: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}