/**
 * @typedef {Object} PaginationMeta
 * @property {number} totalItems
 * @property {number} totalPages
 * @property {number} currentPage
 * @template T
 */
export class PaginatedResult<T> {
    public data: T[];
    public meta: {
        totalItems: number;
        totalPages: number;
        currentPage: number;
        itemsPerPage: number;
    };

    constructor(data: T[], meta: {
        totalItems: number;
        totalPages: number;
        currentPage: number;
        itemsPerPage: number;
    }) {
        this.data = data;
        this.meta = meta;
    }
}
