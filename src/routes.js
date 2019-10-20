import { Router } from 'express';

// import User from './app/models/User';

// import UserController from './app/controllers/UserController';
import StudentController from './app/controllers/StudentController';
import SessionController from './app/controllers/SessionController';
import PlanController from './app/controllers/PlanController';
import RegistryController from './app/controllers/RegistryController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

// POST - create session
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);
// POST - create student
routes.post('/students', StudentController.store);
// PUT - update student
routes.put('/students', StudentController.update);

// GET - list plans
routes.get('/plans', PlanController.index);
// POST - create plan
routes.post('/plans', PlanController.store);
// PUT - update plans
routes.put('/plans/:planId', PlanController.update);
// DELETE - delete plans
routes.delete('/plans/:planId', PlanController.delete);

// GET - list registers
routes.get('/registries', RegistryController.index);
// POST - create registers
routes.post('/registries/:studentId', RegistryController.store);
// PUT - update registers
//routes.put('/registry/:studentId', RegistryController.update);
// DELETE - delete registers
//routes.delete('/registry/:studentId', RegistryController.delete);

export default routes;
