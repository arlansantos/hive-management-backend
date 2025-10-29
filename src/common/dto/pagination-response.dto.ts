import { PaginationQueryDto } from './pagination-query.dto';

export class PaginationMetaDto {
  readonly itemCount: number;
  readonly totalItems: number;
  readonly itemsPerPage: number;
  readonly totalPages: number;
  readonly currentPage: number;
  readonly hasNextPage: boolean;
  readonly hasPreviousPage: boolean;

  constructor(
    itemCount: number,
    totalItems: number,
    paginationQuery: PaginationQueryDto,
  ) {
    const { page, limit } = paginationQuery;

    this.itemCount = itemCount;
    this.totalItems = totalItems;
    this.itemsPerPage = limit;
    this.currentPage = page;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.hasPreviousPage = this.currentPage > 1;
    this.hasNextPage = this.currentPage < this.totalPages;
  }
}

export class PaginationResponseDto<T> {
  readonly data: T[];
  readonly meta: PaginationMetaDto;

  constructor(
    data: T[],
    totalItems: number,
    paginationQuery: PaginationQueryDto,
  ) {
    this.data = data;
    this.meta = new PaginationMetaDto(data.length, totalItems, paginationQuery);
  }
}
