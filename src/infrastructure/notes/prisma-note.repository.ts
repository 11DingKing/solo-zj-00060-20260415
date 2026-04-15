import { NoteModel, NotesRepository } from '@tsed/prisma';

import {
  Note,
  NoteRepository,
  NoteSearchCriteria,
  NoteSortField,
  NoteSortOrder,
  NoteUuid,
  PaginatedNotes
} from '@domain/notes';
import { Nullable } from '@domain/shared';
import { BaseRepository, RepositoryAction } from '@infrastructure/shared/persistence/base-repository';
import { Repository } from '@infrastructure/shared/persistence/repository.decorator';

import { PrismaNoteMapper } from './prisma-note.mapper';

@Repository({ enabled: true, type: NoteRepository })
class PrismaNoteRepository extends BaseRepository<NoteModel> implements NoteRepository {
  private notesRepository: NotesRepository;

  constructor(notesRepository: NotesRepository) {
    super();
    this.notesRepository = notesRepository;
  }

  public async findByUuid(uuid: NoteUuid): Promise<Nullable<Note>> {
    const note = await this.notesRepository.findFirst({
      where: { uuid: uuid.value, deletedAt: null }
    });

    return note ? PrismaNoteMapper.toDomainModel(note) : null;
  }

  public async search(criteria: NoteSearchCriteria): Promise<PaginatedNotes> {
    const {
      tags,
      keyword,
      sortField = NoteSortField.CREATED_AT,
      sortOrder = NoteSortOrder.DESC,
      page = 1,
      limit = 10
    } = criteria;

    const where: any = { deletedAt: null };

    if (tags && tags.length > 0) {
      where.tags = { hasSome: tags };
    }

    if (keyword && keyword.trim() !== '') {
      where.OR = [
        { title: { contains: keyword, mode: 'insensitive' } },
        { content: { contains: keyword, mode: 'insensitive' } }
      ];
    }

    const orderBy: any[] = [{ isPinned: 'desc' }];

    const sortFieldMap: Record<NoteSortField, string> = {
      [NoteSortField.CREATED_AT]: 'createdAt',
      [NoteSortField.UPDATED_AT]: 'updatedAt'
    };

    orderBy.push({
      [sortFieldMap[sortField]]: sortOrder === NoteSortOrder.ASC ? 'asc' : 'desc'
    });

    const skip = (page - 1) * limit;

    const [aggregateResult, notes] = await Promise.all([
      this.notesRepository.aggregate({
        where,
        // eslint-disable-next-line no-underscore-dangle
        _count: true
      }),
      this.notesRepository.findMany({
        where,
        orderBy,
        skip,
        take: limit
      })
    ]);

    // eslint-disable-next-line no-underscore-dangle
    const total = aggregateResult._count || 0;
    const totalPages = Math.ceil((total as number) / limit);

    return {
      notes: notes.map(PrismaNoteMapper.toDomainModel),
      total: total as number,
      page,
      limit,
      totalPages
    };
  }

  public async create(note: Note): Promise<Note> {
    const createdNote = await this.notesRepository.create({
      data: this.getAuditablePersistenceModel(RepositoryAction.CREATE, PrismaNoteMapper.toPersistenceModel(note))
    });
    return PrismaNoteMapper.toDomainModel(createdNote);
  }

  public async update(note: Note): Promise<Note> {
    const updatedNote = await this.notesRepository.update({
      where: { uuid: note.uuid.value },
      data: this.getAuditablePersistenceModel(RepositoryAction.UPDATE, PrismaNoteMapper.toPersistenceModel(note))
    });
    return PrismaNoteMapper.toDomainModel(updatedNote);
  }

  public async delete(uuid: NoteUuid): Promise<void> {
    await this.notesRepository.update({
      where: { uuid: uuid.value },
      data: this.getAuditablePersistenceModel(RepositoryAction.DELETE)
    });
  }
}

export { PrismaNoteRepository };
