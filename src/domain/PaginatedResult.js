/**
 * @typedef {Object} PaginationMeta
 * @property {number} totalItems
 * @property {number} totalPages
 * @property {number} currentPage
 * @property {number} itemsPerPage
 */

/**
 * @template T
 */
class PaginatedResult {
    /**
     * @param {T[]} data 
     * @param {PaginationMeta} meta 
     */
    constructor(data, meta) {
        this.data = data;
        this.meta = meta;
    }
}

module.exports = PaginatedResult;
