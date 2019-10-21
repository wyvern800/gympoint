import { Router } from 'express';

// import User from './app/models/User';

// import UserController from './app/controllers/UserController';
import StudentController from './app/controllers/StudentController';
import SessionController from './app/controllers/SessionController';
import PlanController from './app/controllers/PlanController';
import RegistryController from './app/controllers/RegistryController';
import CheckinController from './app/controllers/CheckinController';
import HelpOrderController from './app/controllers/HelpOrderController';
import PendingHelpOrderController from './app/controllers/PendingHelpOrderController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

// POST - create session
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);
// POST - create student
routes.post('/students', StudentController.store);
// PUT - update student
routes.put('/students', StudentController.update);
// GET - list checkin
routes.get('/students/:studentId/checkins', CheckinController.index);
// POST - create checkin
routes.post('/students/:studentId/checkins', CheckinController.store);

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
routes.post('/registries', RegistryController.store);
// PUT - update registers
routes.put('/registries', RegistryController.update);
// DELETE - delete registers
routes.delete('/registries/:studentId', RegistryController.delete);

// GET - list of help orders
routes.get('/students/:studentId/help-orders', HelpOrderController.index);
// POST - create help order
routes.post('/students/:studentId/help-orders', HelpOrderController.store);

// GET - list of help orders without answer
routes.get('/students/help-orders/pending', PendingHelpOrderController.index);
// POST - gym answering route
routes.put('/help-orders/:studentId/answer', HelpOrderController.update);

export default routes;
