import { InvalidParameterException } from '@domain/shared/exceptions';
import { StringValueObject } from '@domain/shared/value-object';

class NoteTitle extends StringValueObject {
  constructor(value: string) {
    super(value);
    this.ensureValueIsValid(value);
  }

  private ensureValueIsValid(value: string): void {
    if (value == null || value.trim() === '') {
      throw new InvalidParameterException('<NoteTitle> does not allow empty values');
    }
    if (value.length > 500) {
      throw new InvalidParameterException('<NoteTitle> does not allow values longer than 500 characters');
    }
  }
}

export { NoteTitle };
