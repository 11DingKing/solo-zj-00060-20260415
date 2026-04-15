import { NoteModel } from '@tsed/prisma';

import {
  Note,
  NoteContent,
  NoteCreatedAt,
  NoteId,
  NoteIsPinned,
  NoteTags,
  NoteTitle,
  NoteUpdatedAt,
  NoteUuid
} from '@domain/notes';

class PrismaNoteMapper {
  public static toDomainModel(notePersistenceModel: NoteModel): Note {
    return new Note(
      notePersistenceModel.id ? new NoteId(notePersistenceModel.id) : undefined,
      new NoteUuid(notePersistenceModel.uuid),
      new NoteTitle(notePersistenceModel.title),
      new NoteContent(notePersistenceModel.content),
      new NoteTags(notePersistenceModel.tags),
      new NoteIsPinned(notePersistenceModel.isPinned),
      notePersistenceModel.createdAt ? new NoteCreatedAt(notePersistenceModel.createdAt) : undefined,
      notePersistenceModel.updatedAt ? new NoteUpdatedAt(notePersistenceModel.updatedAt) : undefined
    );
  }

  public static toPersistenceModel(note: Note): NoteModel {
    const notePersistenceModel = new NoteModel();
    if (note.id != null) {
      notePersistenceModel.id = note.id.value;
    }
    notePersistenceModel.uuid = note.uuid.value;
    notePersistenceModel.title = note.title.value;
    notePersistenceModel.content = note.content.value;
    notePersistenceModel.tags = note.tags.value;
    notePersistenceModel.isPinned = note.isPinned.value;
    return notePersistenceModel;
  }
}

export { PrismaNoteMapper };
