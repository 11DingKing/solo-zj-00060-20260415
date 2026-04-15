import { Note } from '@domain/notes';

class NoteResponse {
  readonly uuid: string;

  readonly title: string;

  readonly content: string;

  readonly tags: string[];

  readonly isPinned: boolean;

  readonly createdAt: Date | null;

  readonly updatedAt: Date | null;

  constructor(
    uuid: string,
    title: string,
    content: string,
    tags: string[],
    isPinned: boolean,
    createdAt: Date | null,
    updatedAt: Date | null
  ) {
    this.uuid = uuid;
    this.title = title;
    this.content = content;
    this.tags = tags;
    this.isPinned = isPinned;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  public static fromDomainModel(note: Note): NoteResponse {
    return new NoteResponse(
      note.uuid.value,
      note.title.value,
      note.content.value,
      note.tags.value,
      note.isPinned.value,
      note.createdAt?.value || null,
      note.updatedAt?.value || null
    );
  }
}

export { NoteResponse };
