import { NoteResponse } from '@application/notes';
import { BaseUseCase, UseCase } from '@application/shared';
import { Note, NoteNotExistsException, NoteRepository, NoteUuid } from '@domain/notes';
import { Nullable } from '@domain/shared';

import { FindNoteRequest } from './find-note.request';

@UseCase()
class FindNoteUseCase extends BaseUseCase<FindNoteRequest, NoteResponse> {
  private noteRepository: NoteRepository;

  constructor(noteRepository: NoteRepository) {
    super();
    this.noteRepository = noteRepository;
  }

  public async performOperation({ uuid }: FindNoteRequest): Promise<NoteResponse> {
    const note = await this.noteRepository.findByUuid(new NoteUuid(uuid));

    this.ensureNoteExists(note, uuid);

    return NoteResponse.fromDomainModel(note as Note);
  }

  private ensureNoteExists(note: Nullable<Note>, uuid: string): void {
    if (!note) {
      throw new NoteNotExistsException(uuid);
    }
  }
}

export { FindNoteUseCase };
