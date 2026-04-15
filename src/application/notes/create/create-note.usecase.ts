import { NoteResponse } from '@application/notes';
import { BaseUseCase, UseCase } from '@application/shared';
import { Note, NoteContent, NoteIsPinned, NoteRepository, NoteTags, NoteTitle, NoteUuid } from '@domain/notes';

import { CreateNoteRequest } from './create-note.request';

@UseCase()
class CreateNoteUseCase extends BaseUseCase<CreateNoteRequest, NoteResponse> {
  private noteRepository: NoteRepository;

  constructor(noteRepository: NoteRepository) {
    super();
    this.noteRepository = noteRepository;
  }

  public async performOperation({ title, content, tags, isPinned }: CreateNoteRequest): Promise<NoteResponse> {
    const note = Note.create(
      NoteUuid.random(),
      new NoteTitle(title),
      new NoteContent(content),
      new NoteTags(tags),
      new NoteIsPinned(isPinned)
    );

    const createdNote = await this.noteRepository.create(note);

    return NoteResponse.fromDomainModel(createdNote);
  }
}

export { CreateNoteUseCase };
