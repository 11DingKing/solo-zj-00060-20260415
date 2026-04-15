import { UseCaseRequest } from '@application/shared';
import { TriggeredBy } from '@domain/shared/entities/triggered-by';
import { InvalidParameterException } from '@domain/shared/exceptions';

class UpdateNoteRequest extends UseCaseRequest {
  readonly uuid: string;

  readonly title: string;

  readonly content: string;

  readonly tags: string[];

  readonly isPinned: boolean;

  constructor(
    triggeredBy: TriggeredBy,
    uuid: string,
    title: string,
    content: string,
    tags: string[],
    isPinned: boolean
  ) {
    super(triggeredBy);
    this.uuid = uuid;
    this.title = title;
    this.content = content;
    this.tags = tags;
    this.isPinned = isPinned;
  }

  public static create(
    triggeredBy: TriggeredBy,
    uuid: string,
    title: string,
    content: string,
    tags: string[],
    isPinned: boolean
  ): UpdateNoteRequest {
    return new UpdateNoteRequest(triggeredBy, uuid, title, content, tags, isPinned);
  }

  protected validatePayload(): void {
    if (this.uuid == null) {
      throw new InvalidParameterException('Note UUID must be provided');
    }
    if (this.title == null || this.title.trim() === '') {
      throw new InvalidParameterException('Title must be provided');
    }
    if (this.title.length > 500) {
      throw new InvalidParameterException('Title must not exceed 500 characters');
    }
    if (this.content == null) {
      throw new InvalidParameterException('Content must be provided');
    }
    if (!Array.isArray(this.tags)) {
      throw new InvalidParameterException('Tags must be an array');
    }
    const hasInvalidTag = this.tags.some(tag => typeof tag !== 'string' || tag.length > 100);
    if (hasInvalidTag) {
      throw new InvalidParameterException('Each tag must be a string and must not exceed 100 characters');
    }
    if (typeof this.isPinned !== 'boolean') {
      throw new InvalidParameterException('isPinned must be a boolean');
    }
  }
}

export { UpdateNoteRequest };
