import { PrismaClient } from '@prisma/client';
import { CustomError, PaginationDto, UserEntity, ParallelDto, ParallelEntity } from '../../domain';

const prisma = new PrismaClient();

export class ParallelService {

  constructor() { }

  async getParallels(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    try {

      const [total, parallels] = await Promise.all([
        prisma.parallels.count({ where: { state: true } }),
        prisma.parallels.findMany({
          skip: (page - 1) * limit,
          take: limit,
          where: {
            state: true
          },
          include: {
            teacher: true,
            subject: true,
          }
        }),
      ]);

      return {
        page: page,
        limit: limit,
        total: total,
        next: `/api/parallel?page=${(page + 1)}&limit=${limit}`,
        prev: (page - 1 > 0) ? `/api/parallel?page=${(page - 1)}&limit=${limit}` : null,
        parallels: parallels.map(parallel => {
          const { ...parallelEntity } = ParallelEntity.fromObject(parallel);
          return parallelEntity;
        })
      };
    } catch (error) {
      throw CustomError.internalServer('Internal Server Error');
    }
  }

  async createParallel(parallelDto: ParallelDto, user: UserEntity) {
    const { ...createParallelDto } = parallelDto;
    const parallelExists = await prisma.parallels.findFirst({ where: { name: createParallelDto.name } });
    if (parallelExists) throw CustomError.badRequest('El paralelo ya existe');

    try {
      const parallel = await prisma.parallels.create({
        data: {
          ...createParallelDto
        },
      });
      const parallelCreate = await prisma.parallels.findFirst({
        where: {
          id: parallel.id
        },
        include: {
          teacher: true,
          subject: true,
        }
      });

      const { ...parallelEntity } = ParallelEntity.fromObject(parallelCreate!);
      return parallelEntity;

    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async updateParallel(parallelDto: ParallelDto, user: UserEntity, parallelId: number) {
    const { ...updateParallelDto } = parallelDto;
    const existingParallelWithName = await prisma.parallels.findFirst({
      where: {
        AND: [
          { name: updateParallelDto.name },
          { NOT: { id: parallelId } },
        ],
      },
    });
    if (existingParallelWithName) throw CustomError.badRequest('Ya existe un paralelo con el mismo nombre');
    const parallelExists = await prisma.parallels.findFirst({
      where: { id: parallelId },
      include: {
        teacher: true,
        subject: true,
      }
    });
    if (!parallelExists) throw CustomError.badRequest('El paralelo no existe');

    try {
      const parallel = await prisma.parallels.update({
        where: { id: parallelId },
        data: {
          ...updateParallelDto,
        },
        include: {
          teacher: true,
          subject: true,
        }
      });
      return ParallelEntity.fromObject(parallel);
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async deleteParallel(user: UserEntity, parallelId: number) {
    const parallelExists = await prisma.parallels.findFirst({
      where: { id: parallelId },
      include: {
        teacher: true,
        subject: true,
      }
    });
    if (!parallelExists) throw CustomError.badRequest('El paralelo no existe');
    try {
      await prisma.parallels.update({
        where: { id: parallelId },
        data: {
          state: false,
        },
        include: {
          teacher: true,
          subject: true,
        }
      });

      return { msg: 'Paralelo eliminado' };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
}


