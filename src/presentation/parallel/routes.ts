import { Router } from 'express';
import { ParallelController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { ParallelService } from '../services';

export class ParallelRoutes {
  static get routes(): Router {

    const router = Router();
    const parallelService = new ParallelService();
    const controller = new ParallelController(parallelService);

    // rutas
    router.get( '/', [ AuthMiddleware.validateJWT ],controller.getParallels );
    router.post( '/',[ AuthMiddleware.validateJWT ],controller.createParallel );
    router.put( '/:id',[AuthMiddleware.validateJWT],controller.updateParallel );
    router.delete( '/:id',[AuthMiddleware.validateJWT],controller.deleteParallel )
    return router;
  }
}

