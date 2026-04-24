import { Router, Request, Response } from 'express';
import { AuthController } from '../controllers/AuthController';
import { BarbershopController } from '../controllers/BarbershopController';
import { BarberController } from '../controllers/BarberController';
import { ServiceController } from '../controllers/ServiceController';
import { AppointmentController } from '../controllers/AppointmentController';
import { authMiddleware, adminMiddleware } from '../middlewares/auth';

const router = Router();

// Lazy instantiation — controllers criados apenas quando a rota é chamada
const auth = () => new AuthController();
const barbershop = () => new BarbershopController();
const barber = () => new BarberController();
const service = () => new ServiceController();
const appointment = () => new AppointmentController();

// Auth routes
router.post('/auth/register', (req: Request, res: Response) => auth().register(req, res));
router.post('/auth/login', (req: Request, res: Response) => auth().login(req, res));
router.post('/auth/fcm-token', (req: Request, res: Response) => auth().updateFcmToken(req, res));

// Barbershop routes
router.get('/barbershops', (req: Request, res: Response) => barbershop().list(req, res));
router.get('/barbershops/:id', (req: Request, res: Response) => barbershop().getById(req, res));
router.post('/barbershops', authMiddleware, adminMiddleware, (req: Request, res: Response) => barbershop().create(req, res));
router.put('/barbershops/:id', authMiddleware, adminMiddleware, (req: Request, res: Response) => barbershop().update(req, res));

// Barber routes
router.get('/barbers', (req: Request, res: Response) => barber().list(req, res));
router.get('/barbers/:id', (req: Request, res: Response) => barber().getById(req, res));
router.post('/barbers', authMiddleware, adminMiddleware, (req: Request, res: Response) => barber().create(req, res));
router.put('/barbers/:id', authMiddleware, adminMiddleware, (req: Request, res: Response) => barber().update(req, res));
router.delete('/barbers/:id', authMiddleware, adminMiddleware, (req: Request, res: Response) => barber().delete(req, res));

// Service routes
router.get('/services', (req: Request, res: Response) => service().list(req, res));
router.post('/services', authMiddleware, adminMiddleware, (req: Request, res: Response) => service().create(req, res));
router.put('/services/:id', authMiddleware, adminMiddleware, (req: Request, res: Response) => service().update(req, res));
router.delete('/services/:id', authMiddleware, adminMiddleware, (req: Request, res: Response) => service().delete(req, res));

// Appointment routes
router.get('/appointments/available-slots', authMiddleware, (req: Request, res: Response) => appointment().getAvailableSlots(req, res));
router.get('/appointments/admin/stats', authMiddleware, adminMiddleware, (req: Request, res: Response) => appointment().getStats(req, res));
router.get('/appointments/admin/all', authMiddleware, adminMiddleware, (req: Request, res: Response) => appointment().listAll(req, res));
router.get('/appointments', authMiddleware, (req: Request, res: Response) => appointment().list(req, res));
router.post('/appointments', authMiddleware, (req: Request, res: Response) => appointment().create(req, res));
router.put('/appointments/:id/status', authMiddleware, (req: Request, res: Response) => appointment().updateStatus(req, res));

export default router;
