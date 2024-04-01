import { PrismaClient } from '@prisma/client';
import { CustomError, PaginationDto, UserEntity, ProjectDto, ProjectEntity } from '../../domain';

const prisma = new PrismaClient();

export class ProjectService {

  constructor() { }

  async getProjects(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    try {

      const [total, projects] = await Promise.all([
        prisma.projects.count({ where: { state: true } }),
        prisma.projects.findMany({
          skip: (page - 1) * limit,
          take: limit,
          where: {
            state: true
          },
          include: {
            category:true,
            typeProject:true,
            students:true,
            season:true,
            staff:true,
            projectHistories:true,
          }
        }),
      ]);

      return {
        page: page,
        limit: limit,
        total: total,
        next: `/api/project?page=${(page + 1)}&limit=${limit}`,
        prev: (page - 1 > 0) ? `/api/project?page=${(page - 1)}&limit=${limit}` : null,
        projects: projects.map(project => {
          const { ...projectEntity } = ProjectEntity.fromObject(project);
          return projectEntity;
        })
      };
    } catch (error) {
      throw CustomError.internalServer('Internal Server Error');
    }
  }

  async createProject(projectDto: ProjectDto, user: UserEntity) {
    const { ...createProjectDto } = projectDto;
    const projectExists = await prisma.projects.findFirst({ where: { title: createProjectDto.title } });
    if (projectExists) throw CustomError.badRequest('El proyecto ya existe');

    try {
      const project = await prisma.projects.create({
        data: {
          ...createProjectDto,
          code:'',
        },
      });
      const projectCreate = await prisma.projects.findFirst({
        where: {
          id: project.id
        },
        include: {
          category:true,
          typeProject:true,
          students:true,
          season:true,
          staff:true,
          projectHistories:true,
        }
      });

      const { ...projectEntity } = ProjectEntity.fromObject(projectCreate!);
      return projectEntity;

    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async updateProject(projectDto: ProjectDto, user: UserEntity, projectId: number) {
    const { ...updateProjectDto } = projectDto;
    const existingProjectWithName = await prisma.projects.findFirst({
      where: {
        AND: [
          { title: updateProjectDto.title },
          { NOT: { id: projectId } },
        ],
      },
    });
    if (existingProjectWithName) throw CustomError.badRequest('Ya existe un proyecto con el mismo nombre');
    const projectExists = await prisma.projects.findFirst({
      where: { id: projectId },
      include: {
        category:true,
        typeProject:true,
        students:true,
        season:true,
        staff:true,
        projectHistories:true,
      }
    });
    if (!projectExists) throw CustomError.badRequest('El proyecto no existe');

    try {
      const project = await prisma.projects.update({
        where: { id: projectId },
        data: {
          ...updateProjectDto,
        },
        include: {
          category:true,
          typeProject:true,
          students:true,
          season:true,
          staff:true,
          projectHistories:true,
        }
      });
      return ProjectEntity.fromObject(project);
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async deleteProject(user: UserEntity, projectId: number) {
    const projectExists = await prisma.projects.findFirst({
      where: { id: projectId },
      include: {
        category:true,
        typeProject:true,
        students:true,
        season:true,
        staff:true,
        projectHistories:true,
      }
    });
    if (!projectExists) throw CustomError.badRequest('El proyecto no existe');
    try {
      await prisma.projects.update({
        where: { id: projectId },
        data: {
          state: false,
        },
        include: {
          category:true,
          typeProject:true,
          students:true,
          season:true,
          staff:true,
          projectHistories:true,
        }
      });

      return { msg: 'Proyecto eliminado' };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
}


