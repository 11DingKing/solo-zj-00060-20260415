import { NoteResponse } from '@application/notes';
import { BaseUseCase, UseCase } from '@application/shared';
import {
  Note,
  NoteContent,
  NoteIsPinned,
  NoteNotExistsException,
  NoteRepository,
  NoteTags,
  NoteTitle,
  NoteUuid
} from '@domain/notes';
import { Nullable } from '@domain/shared';

import { UpdateNoteRequest } from './update-note.request';

@UseCase()
class UpdateNoteUseCase extends BaseUseCase<UpdateNoteRequest, NoteResponse> {
  private noteRepository: NoteRepository;

  constructor(noteRepository: NoteRepository) {
    super();
    this.noteRepository = noteRepository;
  }

  public async performOperation({ uuid, title, content, tags, isPinned }: UpdateNoteRequest): Promise<NoteResponse> {
    const note = await this.noteRepository.findByUuid(new NoteUuid(uuid));

    this.ensureNoteExists(note, uuid);

    (note as Note).update(
      new NoteTitle(title),
      new NoteContent(content),
      new NoteTags(tags),
      new NoteIsPinned(isPinned)
    );

    const updatedNote = await this.noteRepository.update(note as Note);

    return NoteResponse.fromDomainModel(updatedNote);
  }

  private ensureNoteExists(note: Nullable<Note>, uuid: string): void {
    if (!note) {
      throw new NoteNotExistsException(uuid);
    }
  }
}

export { UpdateNoteUseCase };
