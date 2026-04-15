import { Nullable } from '@domain/shared';

import { Note } from './note';
import { NoteUuid } from './note-uuid';

enum NoteSortField {
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt'
}

enum NoteSortOrder {
  ASC = 'asc',
  DESC = 'desc'
}

interface NoteSearchCriteria {
  tags?: string[];
  keyword?: string;
  sortField?: NoteSortField;
  sortOrder?: NoteSortOrder;
  page?: number;
  limit?: number;
}

interface PaginatedNotes {
  notes: Note[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

abstract class NoteRepository {
  public abstract findByUuid(uuid: NoteUuid): Promise<Nullable<Note>>;

  public abstract search(criteria: NoteSearchCriteria): Promise<PaginatedNotes>;

  public abstract create(note: Note): Promise<Note>;

  public abstract update(note: Note): Promise<Note>;

  public abstract delete(uuid: NoteUuid): Promise<void>;
}

export { NoteRepository, NoteSortField, NoteSortOrder };
export type { NoteSearchCriteria, PaginatedNotes };
