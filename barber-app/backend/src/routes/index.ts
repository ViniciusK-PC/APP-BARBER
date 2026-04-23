import { Router } from 'express';
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
router.post('/auth/register', (req, res) => authController.register(req, res));
router.post('/auth/login', (req, res) => authController.login(req, res));
router.post('/auth/fcm-token', (req, res) => authController.updateFcmToken(req, res));

// Barbershop routes
router.get('/barbershops', (req, res) => barbershopController.list(req, res));
router.get('/barbershops/:id', (req, res) => barbershopController.getById(req, res));
router.post('/barbershops', authMiddleware, adminMiddleware, (req, res) =>
  barbershopController.create(req, res)
);
router.put('/barbershops/:id', authMiddleware, adminMiddleware, (req, res) =>
  barbershopController.update(req, res)
);

// Barber routes
router.get('/barbers', (req, res) => barberController.list(req, res));
router.get('/barbers/:id', (req, res) => barberController.getById(req, res));
router.post('/barbers', authMiddleware, adminMiddleware, (req, res) =>
  barberController.create(req, res)
);
router.put('/barbers/:id', authMiddleware, adminMiddleware, (req, res) =>
  barberController.update(req, res)
);
router.delete('/barbers/:id', authMiddleware, adminMiddleware, (req, res) =>
  barberController.delete(req, res)
);

// Service routes
router.get('/services', (req, res) => serviceController.list(req, res));
router.post('/services', authMiddleware, adminMiddleware, (req, res) =>
  serviceController.create(req, res)
);
router.put('/services/:id', authMiddleware, adminMiddleware, (req, res) =>
  serviceController.update(req, res)
);
router.delete('/services/:id', authMiddleware, adminMiddleware, (req, res) =>
  serviceController.delete(req, res)
);

// Appointment routes
router.get('/appointments/available-slots', authMiddleware, (req, res) =>
  appointmentController.getAvailableSlots(req, res)
);
router.get('/appointments/admin/stats', authMiddleware, adminMiddleware, (req, res) =>
  appointmentController.getStats(req, res)
);
router.get('/appointments/admin/all', authMiddleware, adminMiddleware, (req, res) =>
  appointmentController.listAll(req, res)
);
router.get('/appointments', authMiddleware, (req, res) =>
  appointmentController.list(req, res)
);
router.post('/appointments', authMiddleware, (req, res) =>
  appointmentController.create(req, res)
);
router.put('/appointments/:id/status', authMiddleware, (req, res) =>
  appointmentController.updateStatus(req, res)
);

export default router;
