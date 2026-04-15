import { InvalidParameterException } from '@domain/shared/exceptions';

class NoteTags {
  readonly value: string[];

  constructor(value: string[]) {
    this.value = value;
    this.ensureValueIsValid(value);
  }

  private ensureValueIsValid(value: string[]): void {
    if (!Array.isArray(value)) {
      throw new InvalidParameterException('<NoteTags> must be an array');
    }
    const hasInvalidTag = value.some(tag => typeof tag !== 'string' || tag.length > 100);
    if (hasInvalidTag) {
      throw new InvalidParameterException('<NoteTags> each tag must be a string and must not exceed 100 characters');
    }
  }
}

export { NoteTags };
