import { NoteResponse, PaginatedNotesResponse } from '@application/notes';
import { BaseUseCase, UseCase } from '@application/shared';
import { NoteRepository, NoteSortField, NoteSortOrder } from '@domain/notes';

import { SearchNotesRequest } from './search-notes.request';

@UseCase()
class SearchNotesUseCase extends BaseUseCase<SearchNotesRequest, PaginatedNotesResponse> {
  private noteRepository: NoteRepository;

  constructor(noteRepository: NoteRepository) {
    super();
    this.noteRepository = noteRepository;
  }

  public async performOperation(request: SearchNotesRequest): Promise<PaginatedNotesResponse> {
    const { tags, keyword, sortField, sortOrder, page, limit } = request;

    const result = await this.noteRepository.search({
      tags,
      keyword,
      sortField: sortField || NoteSortField.CREATED_AT,
      sortOrder: sortOrder || NoteSortOrder.DESC,
      page: page || 1,
      limit: limit || 10
    });

    return new PaginatedNotesResponse(
      result.notes.map(NoteResponse.fromDomainModel),
      result.total,
      result.page,
      result.limit,
      result.totalPages
    );
  }
}

export { SearchNotesUseCase };
