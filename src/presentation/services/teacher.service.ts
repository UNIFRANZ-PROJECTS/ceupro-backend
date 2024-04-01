import { PrismaClient } from '@prisma/client';
import { TeacherDto, CustomError, PaginationDto, UserEntity, TeacherEntity, } from '../../domain';
import { bcryptAdapter } from '../../config';

const prisma = new PrismaClient();

export class TeacherService {

  constructor() { }

  async getTeachers(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    try {

      const [total, teachers] = await Promise.all([
        prisma.teachers.count({ where: { state: true } }),
        prisma.teachers.findMany({
          where: {
            state: true,
          },
          skip: (page - 1) * limit,
          take: limit,
          include: {
            user: true,
          }
        }),
      ]);
      return {
        page: page,
        limit: limit,
        total: total,
        next: `/api/teacher?page=${(page + 1)}&limit=${limit}`,
        prev: (page - 1 > 0) ? `/api/teacher?page=${(page - 1)}&limit=${limit}` : null,
        students: teachers.map(student => {
          const { ...teacherEntity } = TeacherEntity.fromObject(student);
          return teacherEntity;
        })
      };
    } catch (error) {
      throw CustomError.internalServer('Internal Server Error');
    }
  }

  async createTeacher(createTeacherDto: TeacherDto, user: UserEntity) {

    try {

      const userExists = await prisma.users.findFirst({
        where: {
          email: createTeacherDto.email
        }
      });

      let userId: number;
      if (!userExists) {
        const user = await prisma.users.create({
          data: {
            name: createTeacherDto.name,
            lastName: createTeacherDto.lastName,
            email: createTeacherDto.email,
            phone: '5917373566',
            password: await bcryptAdapter.hash(createTeacherDto.email), // Hasheamos la contraseña
          },
        });
        userId = user.id;
      } else {
        userId = userExists.id;
      }

      const staffExists = await prisma.teachers.findFirst({
        where: {
          user: {
            email: createTeacherDto.email
          },
          state: true
        }
      });

      if (staffExists) throw CustomError.badRequest('El staff ya existe');

      const student = await prisma.teachers.create({
        data: {
          ci:createTeacherDto.ci,
          userId: userId,
        },
        include: {
          user: true,
        }
      });
      console.log(student)


      const { ...teacherEntity } = TeacherEntity.fromObject(student);
      return teacherEntity;

    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async updateTeacher(updateTeacherDto: TeacherDto, user: UserEntity, staffId: number) {
    const studentExists = await prisma.teachers.findFirst({
      where: { id: staffId },
      include: {
        user: true,
      }
    });
    if (!studentExists) throw CustomError.badRequest('El staff no existe');

    try {

      await prisma.users.update({
        where: { id: studentExists.userId },
        data: {
          ...updateTeacherDto,
          password: await bcryptAdapter.hash(studentExists.user.password),
        }
      });

      const staff = await prisma.teachers.update({
        where: { id: staffId },
        data: {
          ...updateTeacherDto,
        },
        include: {
          user: true,
        }
      });

      return TeacherEntity.fromObject(staff);
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async deleteTeacher(user: UserEntity, categoryId: number) {
    const studentExists = await prisma.teachers.findFirst({
      where: { id: categoryId },
    });
    if (!studentExists) throw CustomError.badRequest('El staff no existe');
    try {
      await prisma.teachers.update({
        where: { id: categoryId },
        data: {
          state: false,
        },
      });
      return { msg: 'Staff eliminado' };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
}


