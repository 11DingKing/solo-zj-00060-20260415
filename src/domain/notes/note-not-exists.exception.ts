import { DomainException } from '@domain/shared/exceptions';

class NoteNotExistsException extends DomainException {
  constructor(uuid: string) {
    super('note_not_exists', `Note with UUID <${uuid}> does not exists`);
  }
}

export { NoteNotExistsException };
