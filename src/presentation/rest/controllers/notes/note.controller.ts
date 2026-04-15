import { BodyParams, Context, Delete, Get, PathParams, Post, Put, QueryParams } from '@tsed/common';
import { Description, Returns, Status, Summary, Tags, Title } from '@tsed/schema';
import { StatusCodes } from 'http-status-codes';

import { CreateNoteRequest, CreateNoteUseCase } from '@application/notes/create';
import { DeleteNoteRequest, DeleteNoteUseCase } from '@application/notes/delete';
import { FindNoteRequest, FindNoteUseCase } from '@application/notes/find';
import { SearchNotesRequest, SearchNotesUseCase } from '@application/notes/search';
import { UpdateNoteRequest, UpdateNoteUseCase } from '@application/notes/update';
import { NoteSortField, NoteSortOrder } from '@domain/notes';
import { TriggeredBy } from '@domain/shared/entities/triggered-by';
import { AppConfig } from '@presentation/rest/config';
import { RestController } from '@presentation/rest/shared/rest-controller.decorator';

import { NoteApiResponse } from './note.api-response';
import { PaginatedNotesApiResponse } from './paginated-notes.api-response';

@RestController('/v1/notes')
@Tags({ name: 'Notes', description: 'Note management' })
class NoteController {
  private createNoteUseCase: CreateNoteUseCase;

  private updateNoteUseCase: UpdateNoteUseCase;

  private deleteNoteUseCase: DeleteNoteUseCase;

  private findNoteUseCase: FindNoteUseCase;

  private searchNotesUseCase: SearchNotesUseCase;

  constructor(
    createNoteUseCase: CreateNoteUseCase,
    updateNoteUseCase: UpdateNoteUseCase,
    deleteNoteUseCase: DeleteNoteUseCase,
    findNoteUseCase: FindNoteUseCase,
    searchNotesUseCase: SearchNotesUseCase
  ) {
    this.createNoteUseCase = createNoteUseCase;
    this.updateNoteUseCase = updateNoteUseCase;
    this.deleteNoteUseCase = deleteNoteUseCase;
    this.findNoteUseCase = findNoteUseCase;
    this.searchNotesUseCase = searchNotesUseCase;
  }

  @Get()
  @Title('Search notes')
  @Summary('Search notes with filters, pagination and sorting')
  @Description(
    'Endpoint to search notes with tags filter, keyword search, pagination and sorting. Pinned notes are always first.'
  )
  @Returns(StatusCodes.OK, PaginatedNotesApiResponse)
  @Status(StatusCodes.OK, PaginatedNotesApiResponse)
  public async searchNotes(
    @Context(AppConfig.TRIGGERED_BY_CONTEXT_KEY) triggeredBy: TriggeredBy,
    @QueryParams('tags') tags?: string[],
    @QueryParams('keyword') keyword?: string,
    @QueryParams('sortField') sortField?: NoteSortField,
    @QueryParams('sortOrder') sortOrder?: NoteSortOrder,
    @QueryParams('page') page?: number,
    @QueryParams('limit') limit?: number
  ): Promise<PaginatedNotesApiResponse> {
    const parsedTags = this.parseTagsQueryParam(tags);
    const parsedPage = page ? Number(page) : undefined;
    const parsedLimit = limit ? Number(limit) : undefined;

    const response = await this.searchNotesUseCase.execute(
      SearchNotesRequest.create(triggeredBy, parsedTags, keyword, sortField, sortOrder, parsedPage, parsedLimit)
    );

    return PaginatedNotesApiResponse.fromPaginatedNotesResponse(response);
  }

  @Get('/:uuid')
  @Title('Get note by UUID')
  @Summary('Obtain note by UUID')
  @Description('Endpoint to obtain a note by UUID')
  @Returns(StatusCodes.OK, NoteApiResponse)
  @Status(StatusCodes.OK, NoteApiResponse)
  public async findNote(
    @Context(AppConfig.TRIGGERED_BY_CONTEXT_KEY) triggeredBy: TriggeredBy,
    @PathParams('uuid') uuid: string
  ): Promise<NoteApiResponse> {
    const noteResponse = await this.findNoteUseCase.execute(FindNoteRequest.create(triggeredBy, uuid));
    return NoteApiResponse.fromNoteResponse(noteResponse);
  }

  @Post()
  @Title('Create note')
  @Summary('Create a new note')
  @Description('Endpoint to create a new note')
  @Returns(StatusCodes.CREATED, NoteApiResponse)
  @Status(StatusCodes.CREATED, NoteApiResponse)
  public async createNote(
    @Context(AppConfig.TRIGGERED_BY_CONTEXT_KEY) triggeredBy: TriggeredBy,
    @BodyParams('title') title: string,
    @BodyParams('content') content: string,
    @BodyParams('tags') tags: string[] = [],
    @BodyParams('isPinned') isPinned: boolean = false
  ): Promise<NoteApiResponse> {
    const noteResponse = await this.createNoteUseCase.execute(
      CreateNoteRequest.create(triggeredBy, title, content, tags, isPinned)
    );
    return NoteApiResponse.fromNoteResponse(noteResponse);
  }

  @Put('/:uuid')
  @Title('Update note')
  @Summary('Update an existing note')
  @Description('Endpoint to update an existing note')
  @Returns(StatusCodes.OK, NoteApiResponse)
  @Status(StatusCodes.OK, NoteApiResponse)
  public async updateNote(
    @Context(AppConfig.TRIGGERED_BY_CONTEXT_KEY) triggeredBy: TriggeredBy,
    @PathParams('uuid') uuid: string,
    @BodyParams('title') title: string,
    @BodyParams('content') content: string,
    @BodyParams('tags') tags: string[] = [],
    @BodyParams('isPinned') isPinned: boolean = false
  ): Promise<NoteApiResponse> {
    const noteResponse = await this.updateNoteUseCase.execute(
      UpdateNoteRequest.create(triggeredBy, uuid, title, content, tags, isPinned)
    );
    return NoteApiResponse.fromNoteResponse(noteResponse);
  }

  @Delete('/:uuid')
  @Title('Delete note')
  @Summary('Delete a note')
  @Description('Endpoint to delete a note by UUID')
  @Returns(StatusCodes.NO_CONTENT)
  @Status(StatusCodes.NO_CONTENT)
  public async deleteNote(
    @Context(AppConfig.TRIGGERED_BY_CONTEXT_KEY) triggeredBy: TriggeredBy,
    @PathParams('uuid') uuid: string
  ): Promise<void> {
    await this.deleteNoteUseCase.execute(DeleteNoteRequest.create(triggeredBy, uuid));
  }

  private parseTagsQueryParam(tags?: string | string[]): string[] | undefined {
    if (tags == null) {
      return undefined;
    }
    if (Array.isArray(tags)) {
      return tags;
    }
    return [tags];
  }
}

export { NoteController };
