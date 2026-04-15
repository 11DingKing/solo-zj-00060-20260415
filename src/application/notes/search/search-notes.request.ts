import { UseCaseRequest } from '@application/shared';
import { NoteSortField, NoteSortOrder } from '@domain/notes';
import { TriggeredBy } from '@domain/shared/entities/triggered-by';
import { InvalidParameterException } from '@domain/shared/exceptions';

class SearchNotesRequest extends UseCaseRequest {
  readonly tags?: string[];

  readonly keyword?: string;

  readonly sortField?: NoteSortField;

  readonly sortOrder?: NoteSortOrder;

  readonly page?: number;

  readonly limit?: number;

  constructor(
    triggeredBy: TriggeredBy,
    tags?: string[],
    keyword?: string,
    sortField?: NoteSortField,
    sortOrder?: NoteSortOrder,
    page?: number,
    limit?: number
  ) {
    super(triggeredBy);
    this.tags = tags;
    this.keyword = keyword;
    this.sortField = sortField;
    this.sortOrder = sortOrder;
    this.page = page;
    this.limit = limit;
  }

  public static create(
    triggeredBy: TriggeredBy,
    tags?: string[],
    keyword?: string,
    sortField?: NoteSortField,
    sortOrder?: NoteSortOrder,
    page?: number,
    limit?: number
  ): SearchNotesRequest {
    return new SearchNotesRequest(triggeredBy, tags, keyword, sortField, sortOrder, page, limit);
  }

  protected validatePayload(): void {
    this.validateTags();
    this.validateKeyword();
    this.validateSortField();
    this.validateSortOrder();
    this.validatePage();
    this.validateLimit();
  }

  private validateTags(): void {
    if (this.tags == null) {
      return;
    }
    if (!Array.isArray(this.tags)) {
      throw new InvalidParameterException('Tags must be an array');
    }
    const hasInvalidTag = this.tags.some(tag => typeof tag !== 'string' || tag.length > 100);
    if (hasInvalidTag) {
      throw new InvalidParameterException('Each tag must be a string and must not exceed 100 characters');
    }
  }

  private validateKeyword(): void {
    if (this.keyword != null && typeof this.keyword !== 'string') {
      throw new InvalidParameterException('Keyword must be a string');
    }
  }

  private validateSortField(): void {
    if (this.sortField == null) {
      return;
    }
    const validSortFields = Object.values(NoteSortField);
    if (!validSortFields.includes(this.sortField)) {
      throw new InvalidParameterException(`Sort field must be one of: ${validSortFields.join(', ')}`);
    }
  }

  private validateSortOrder(): void {
    if (this.sortOrder == null) {
      return;
    }
    const validSortOrders = Object.values(NoteSortOrder);
    if (!validSortOrders.includes(this.sortOrder)) {
      throw new InvalidParameterException(`Sort order must be one of: ${validSortOrders.join(', ')}`);
    }
  }

  private validatePage(): void {
    if (this.page != null && (typeof this.page !== 'number' || this.page < 1)) {
      throw new InvalidParameterException('Page must be a positive number');
    }
  }

  private validateLimit(): void {
    if (this.limit != null && (typeof this.limit !== 'number' || this.limit < 1 || this.limit > 100)) {
      throw new InvalidParameterException('Limit must be a number between 1 and 100');
    }
  }
}

export { SearchNotesRequest };
