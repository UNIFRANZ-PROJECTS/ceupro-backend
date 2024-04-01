import { PrismaClient } from '@prisma/client';
import { CustomError, PaginationDto, UserEntity, InscriptionDto,InscriptionEntity } from '../../domain';

const prisma = new PrismaClient();

export class InscriptionService {

  constructor() { }

  async getInscriptions(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    try {

      const [total, inscriptions] = await Promise.all([
        prisma.inscriptions.count({ where: { state: true } }),
        prisma.inscriptions.findMany({
          skip: (page - 1) * limit,
          take: limit,
          where: {
            state: true
          },
          include: {
            student: true,
            staff: true,
            season: true,
          }
        }),
      ]);

      return {
        page: page,
        limit: limit,
        total: total,
        next: `/api/inscription?page=${(page + 1)}&limit=${limit}`,
        prev: (page - 1 > 0) ? `/api/inscription?page=${(page - 1)}&limit=${limit}` : null,
        inscriptions: inscriptions.map(inscription => {
          const { ...inscriptionEntity } = InscriptionEntity.fromObject(inscription);
          return inscriptionEntity;
        })
      };
    } catch (error) {
      throw CustomError.internalServer('Internal Server Error');
    }
  }

  async createInscription(inscriptionDto: InscriptionDto, user: UserEntity) {
    const { ...createInscriptionDto } = inscriptionDto;
    const inscriptionExists = await prisma.inscriptions.findFirst({
      where: {
        season: {
          id: createInscriptionDto.seasonId
        },
        student: {
          id: createInscriptionDto.studentId
        },
      }
    });
    if (inscriptionExists) throw CustomError.badRequest('La inscripción ya existe');

    try {
      const inscription = await prisma.inscriptions.create({
        data: {
          ...createInscriptionDto,
          amountDelivered: 1,
          returnedAmount: 2,
          url: ''
        },
      });
      const inscriptionCreate = await prisma.inscriptions.findFirst({
        where: {
          id: inscription.id
        },
        include: {
          student: true,
          staff: true,
          season: true,
        }
      });

      const { ...inscriptionEntity } = InscriptionEntity.fromObject(inscriptionCreate!);
      return inscriptionEntity;

    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async updateInscription(inscriptionDto: InscriptionDto, user: UserEntity, inscriptionId: number) {
    const { ...updateInscriptionDto } = inscriptionDto;
    const existingInscriptionWithName = await prisma.inscriptions.findFirst({
      where: {
        AND: [
          {
            season: {
              id: updateInscriptionDto.seasonId,
            }
          },
          {
            student: {
              id: updateInscriptionDto.studentId 
            }
          },
          { NOT: { id: inscriptionId } },
        ]
      },
    });
    if (existingInscriptionWithName) throw CustomError.badRequest('Ya existe una inscripción con el estudiante y en la misma temporada');
    const inscriptionExists = await prisma.inscriptions.findFirst({
      where: { id: inscriptionId },
      include: {
        student: true,
        staff: true,
        season: true,
      }
    });
    if (!inscriptionExists) throw CustomError.badRequest('La inscripción no existe');

    try {
      const inscription = await prisma.inscriptions.update({
        where: { id: inscriptionId },
        data: {
          ...updateInscriptionDto,
        },
        include: {
          student: true,
          staff: true,
          season: true,
        }
      });
      return InscriptionEntity.fromObject(inscription);
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async deleteInscription(user: UserEntity, inscriptionId: number) {
    const inscriptionExists = await prisma.inscriptions.findFirst({
      where: { id: inscriptionId },
      include: {
        student: true,
        staff: true,
        season: true,
      }
    });
    if (!inscriptionExists) throw CustomError.badRequest('La inscripción no existe');
    try {
      await prisma.inscriptions.update({
        where: { id: inscriptionId },
        data: {
          state: false,
        },
        include: {
          student: true,
          staff: true,
          season: true,
        }
      });

      return { msg: 'Inscripción eliminado' };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
}


