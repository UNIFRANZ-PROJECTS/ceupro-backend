const readXlsxFile = require('read-excel-file/node');

import { PrismaClient } from '@prisma/client';
import {
  CustomError,
  PaginationDto,
  UserEntity,
  ParallelDto,
  ParallelEntity,
  CustomSuccessful,
  ParallelFileDto,
} from '../../domain';

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
            state: true,
          },
          include: {
            teacher: {
              include: {
                user: true,
              },
            },
            subject: true,
          },
        }),
      ]);

      return CustomSuccessful.response({
        result: {
          page: page,
          limit: limit,
          total: total,
          next: `/api/parallel?page=${page + 1}&limit=${limit}`,
          prev:
            page - 1 > 0
              ? `/api/parallel?page=${page - 1}&limit=${limit}`
              : null,
          parallels: parallels.map((parallel) => {
            const { ...parallelEntity } = ParallelEntity.fromObject(parallel);
            return parallelEntity;
          }),
        },
      });
    } catch (error) {
      throw CustomError.internalServer('Internal Server Error');
    }
  }

  async createParallel(parallelDto: ParallelDto, user: UserEntity) {
    const { ...createParallelDto } = parallelDto;
    const parallelExists = await prisma.parallels.findFirst({
      where: {
        AND: [
          {
            teacherId: createParallelDto.teacherId,
          },
          {
            subjectId: createParallelDto.subjectId,
          },
        ],
      },
    });
    if (parallelExists) throw CustomError.badRequest('El paralelo ya existe');

    try {
      const parallel = await prisma.parallels.create({
        data: {
          ...createParallelDto,
        },
        include: {
          teacher: {
            include: {
              user: true,
            },
          },
          subject: true,
        },
      });

      const { ...parallelEntity } = ParallelEntity.fromObject(parallel!);
      return CustomSuccessful.response({ result: parallelEntity });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async createParallels(fileBase64: ParallelFileDto, user: UserEntity) {
    try {
      const fs = require('fs');
      const file = Buffer.from(fileBase64.file, 'base64');
      fs.writeFileSync('/tmp/temp.xlsx', file); // o /tmp/temp.png, dependiendo del formato
      const data = await readXlsxFile('/tmp/temp.xlsx');
      console.log(data)
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async updateParallel(
    parallelDto: ParallelDto,
    user: UserEntity,
    parallelId: number
  ) {
    const { ...updateParallelDto } = parallelDto;
    const existingParallelWithName = await prisma.parallels.findFirst({
      where: {
        AND: [{ name: updateParallelDto.name }, { NOT: { id: parallelId } }],
      },
    });
    if (existingParallelWithName)
      throw CustomError.badRequest('Ya existe un paralelo con el mismo nombre');
    const parallelExists = await prisma.parallels.findFirst({
      where: { id: parallelId },
      include: {
        teacher: true,
        subject: true,
      },
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
        },
      });
      const { ...parallelEntity } = ParallelEntity.fromObject(parallel!);
      return CustomSuccessful.response({ result: parallelEntity });
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
      },
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
        },
      });

      return CustomSuccessful.response({ message: 'Paralelo eliminado' });
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
}
