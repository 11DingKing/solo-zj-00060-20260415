import { Nullable } from '@domain/shared';
import { DomainEntity } from '@domain/shared/entities/domain-entity';

import { NoteContent } from './note-content';
import { NoteCreatedAt } from './note-created-at';
import { NoteId } from './note-id';
import { NoteIsPinned } from './note-is-pinned';
import { NoteTags } from './note-tags';
import { NoteTitle } from './note-title';
import { NoteUpdatedAt } from './note-updated-at';
import { NoteUuid } from './note-uuid';

interface NoteFlattened {
  id: Nullable<number>;
  uuid: string;
  title: string;
  content: string;
  tags: string[];
  isPinned: boolean;
  createdAt: Nullable<Date>;
  updatedAt: Nullable<Date>;
}

class Note extends DomainEntity {
  id: Nullable<NoteId>;

  uuid: NoteUuid;

  title: NoteTitle;

  content: NoteContent;

  tags: NoteTags;

  isPinned: NoteIsPinned;

  createdAt: Nullable<NoteCreatedAt>;

  updatedAt: Nullable<NoteUpdatedAt>;

  constructor(
    id: Nullable<NoteId>,
    uuid: NoteUuid,
    title: NoteTitle,
    content: NoteContent,
    tags: NoteTags,
    isPinned: NoteIsPinned,
    createdAt: Nullable<NoteCreatedAt>,
    updatedAt: Nullable<NoteUpdatedAt>
  ) {
    super();
    this.id = id;
    this.uuid = uuid;
    this.title = title;
    this.content = content;
    this.tags = tags;
    this.isPinned = isPinned;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  public static create(
    uuid: NoteUuid,
    title: NoteTitle,
    content: NoteContent,
    tags: NoteTags,
    isPinned: NoteIsPinned
  ): Note {
    return new Note(undefined, uuid, title, content, tags, isPinned, undefined, undefined);
  }

  public update(title: NoteTitle, content: NoteContent, tags: NoteTags, isPinned: NoteIsPinned): void {
    this.title = title;
    this.content = content;
    this.tags = tags;
    this.isPinned = isPinned;
  }

  public flat(): NoteFlattened {
    return {
      id: this.id?.value,
      uuid: this.uuid.value,
      title: this.title.value,
      content: this.content.value,
      tags: this.tags.value,
      isPinned: this.isPinned.value,
      createdAt: this.createdAt?.value,
      updatedAt: this.updatedAt?.value
    };
  }
}

export { Note, NoteFlattened };
