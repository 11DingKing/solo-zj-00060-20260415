import { BaseUseCase, UseCase } from '@application/shared';
import { Note, NoteNotExistsException, NoteRepository, NoteUuid } from '@domain/notes';
import { Nullable } from '@domain/shared';

import { DeleteNoteRequest } from './delete-note.request';

@UseCase()
class DeleteNoteUseCase extends BaseUseCase<DeleteNoteRequest, void> {
  private noteRepository: NoteRepository;

  constructor(noteRepository: NoteRepository) {
    super();
    this.noteRepository = noteRepository;
  }

  public async performOperation({ uuid }: DeleteNoteRequest): Promise<void> {
    const note = await this.noteRepository.findByUuid(new NoteUuid(uuid));

    this.ensureNoteExists(note, uuid);

    await this.noteRepository.delete(new NoteUuid(uuid));
  }

  private ensureNoteExists(note: Nullable<Note>, uuid: string): void {
    if (!note) {
      throw new NoteNotExistsException(uuid);
    }
  }
}

export { DeleteNoteUseCase };
