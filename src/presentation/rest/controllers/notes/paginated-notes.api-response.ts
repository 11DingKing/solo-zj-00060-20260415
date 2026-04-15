import { Property } from '@tsed/schema';

import { PaginatedNotesResponse } from '@application/notes';

import { NoteApiResponse } from './note.api-response';

class PaginatedNotesApiResponse {
  @Property()
  readonly notes: NoteApiResponse[];

  @Property()
  readonly total: number;

  @Property()
  readonly page: number;

  @Property()
  readonly limit: number;

  @Property()
  readonly totalPages: number;

  constructor(notes: NoteApiResponse[], total: number, page: number, limit: number, totalPages: number) {
    this.notes = notes;
    this.total = total;
    this.page = page;
    this.limit = limit;
    this.totalPages = totalPages;
  }

  public static fromPaginatedNotesResponse(response: PaginatedNotesResponse): PaginatedNotesApiResponse {
    return new PaginatedNotesApiResponse(
      response.notes.map(NoteApiResponse.fromNoteResponse),
      response.total,
      response.page,
      response.limit,
      response.totalPages
    );
  }
}

export { PaginatedNotesApiResponse };
