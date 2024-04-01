import { Router } from 'express';
import { ProjectController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { ProjectService } from '../services';

export class ProjectRoutes {
  static get routes(): Router {

    const router = Router();
    const projectService = new ProjectService();
    const controller = new ProjectController(projectService);

    // rutas
    router.get( '/', [ AuthMiddleware.validateJWT ],controller.getProjects );
    router.post( '/',[ AuthMiddleware.validateJWT ],controller.createProject );
    router.put( '/:id',[AuthMiddleware.validateJWT],controller.updateProject );
    router.delete( '/:id',[AuthMiddleware.validateJWT],controller.deleteProject )
    return router;
  }
}

