import { Default, Property } from '@tsed/schema';

import { NoteResponse } from '@application/notes';

class NoteApiResponse {
  @Property()
  readonly uuid: string;

  @Property()
  readonly title: string;

  @Property()
  readonly content: string;

  @Property()
  readonly tags: string[];

  @Property()
  @Default(false)
  readonly isPinned: boolean;

  @Property()
  readonly createdAt: Date | null;

  @Property()
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

  public static fromNoteResponse(note: NoteResponse): NoteApiResponse {
    return new NoteApiResponse(
      note.uuid,
      note.title,
      note.content,
      note.tags,
      note.isPinned,
      note.createdAt,
      note.updatedAt
    );
  }
}

export { NoteApiResponse };
