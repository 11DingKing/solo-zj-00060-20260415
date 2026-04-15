import { NoteResponse } from './note.response';

class PaginatedNotesResponse {
  readonly notes: NoteResponse[];

  readonly total: number;

  readonly page: number;

  readonly limit: number;

  readonly totalPages: number;

  constructor(notes: NoteResponse[], total: number, page: number, limit: number, totalPages: number) {
    this.notes = notes;
    this.total = total;
    this.page = page;
    this.limit = limit;
    this.totalPages = totalPages;
  }
}

export { PaginatedNotesResponse };
