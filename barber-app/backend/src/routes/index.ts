import { Router, Request, Response } from 'express';
import { AuthController } from '../controllers/AuthController';
import { BarbershopController } from '../controllers/BarbershopController';
import { BarberController } from '../controllers/BarberController';
import { ServiceController } from '../controllers/ServiceController';
import { AppointmentController } from '../controllers/AppointmentController';
import { authMiddleware, adminMiddleware } from '../middlewares/auth';

const router = Router();

// Controllers
const authController = new AuthController();
const barbershopController = new BarbershopController();
const barberController = new BarberController();
const serviceController = new ServiceController();
const appointmentController = new AppointmentController();

// Auth routes
router.post('/auth/register', (req: Request, res: Response) => authController.register(req, res));
router.post('/auth/login', (req: Request, res: Response) => authController.login(req, res));
router.post('/auth/fcm-token', (req: Request, res: Response) => authController.updateFcmToken(req, res));

// Barbershop routes
router.get('/barbershops', (req: Request, res: Response) => barbershopController.list(req, res));
router.get('/barbershops/:id', (req: Request, res: Response) => barbershopController.getById(req, res));
router.post('/barbershops', authMiddleware, adminMiddleware, (req: Request, res: Response) =>
  barbershopController.create(req, res)
);
router.put('/barbershops/:id', authMiddleware, adminMiddleware, (req: Request, res: Response) =>
  barbershopController.update(req, res)
);

// Barber routes
router.get('/barbers', (req: Request, res: Response) => barberController.list(req, res));
router.get('/barbers/:id', (req: Request, res: Response) => barberController.getById(req, res));
router.post('/barbers', authMiddleware, adminMiddleware, (req: Request, res: Response) =>
  barberController.create(req, res)
);
router.put('/barbers/:id', authMiddleware, adminMiddleware, (req: Request, res: Response) =>
  barberController.update(req, res)
);
router.delete('/barbers/:id', authMiddleware, adminMiddleware, (req: Request, res: Response) =>
  barberController.delete(req, res)
);

// Service routes
router.get('/services', (req: Request, res: Response) => serviceController.list(req, res));
router.post('/services', authMiddleware, adminMiddleware, (req: Request, res: Response) =>
  serviceController.create(req, res)
);
router.put('/services/:id', authMiddleware, adminMiddleware, (req: Request, res: Response) =>
  serviceController.update(req, res)
);
router.delete('/services/:id', authMiddleware, adminMiddleware, (req: Request, res: Response) =>
  serviceController.delete(req, res)
);

// Appointment routes
router.get('/appointments/available-slots', authMiddleware, (req: Request, res: Response) =>
  appointmentController.getAvailableSlots(req, res)
);
router.get('/appointments/admin/stats', authMiddleware, adminMiddleware, (req: Request, res: Response) =>
  appointmentController.getStats(req, res)
);
router.get('/appointments/admin/all', authMiddleware, adminMiddleware, (req: Request, res: Response) =>
  appointmentController.listAll(req, res)
);
router.get('/appointments', authMiddleware, (req: Request, res: Response) =>
  appointmentController.list(req, res)
);
router.post('/appointments', authMiddleware, (req: Request, res: Response) =>
  appointmentController.create(req, res)
);
router.put('/appointments/:id/status', authMiddleware, (req: Request, res: Response) =>
  appointmentController.updateStatus(req, res)
);

export default router;
