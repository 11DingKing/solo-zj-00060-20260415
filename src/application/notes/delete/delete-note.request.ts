import { UseCaseRequest } from '@application/shared';
import { TriggeredBy } from '@domain/shared/entities/triggered-by';
import { InvalidParameterException } from '@domain/shared/exceptions';

class DeleteNoteRequest extends UseCaseRequest {
  readonly uuid: string;

  constructor(triggeredBy: TriggeredBy, uuid: string) {
    super(triggeredBy);
    this.uuid = uuid;
  }

  public static create(triggeredBy: TriggeredBy, uuid: string): DeleteNoteRequest {
    return new DeleteNoteRequest(triggeredBy, uuid);
  }

  protected validatePayload(): void {
    if (this.uuid == null) {
      throw new InvalidParameterException('Note UUID must be provided');
    }
  }
}

export { DeleteNoteRequest };
