"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = require("../controllers/AuthController");
const BarbershopController_1 = require("../controllers/BarbershopController");
const BarberController_1 = require("../controllers/BarberController");
const ServiceController_1 = require("../controllers/ServiceController");
const AppointmentController_1 = require("../controllers/AppointmentController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
// Lazy instantiation — controllers criados apenas quando a rota é chamada
const auth = () => new AuthController_1.AuthController();
const barbershop = () => new BarbershopController_1.BarbershopController();
const barber = () => new BarberController_1.BarberController();
const service = () => new ServiceController_1.ServiceController();
const appointment = () => new AppointmentController_1.AppointmentController();
// Auth routes
router.post('/auth/register', (req, res) => auth().register(req, res));
router.post('/auth/login', (req, res) => auth().login(req, res));
router.post('/auth/fcm-token', (req, res) => auth().updateFcmToken(req, res));
// Barbershop routes
router.get('/barbershops', (req, res) => barbershop().list(req, res));
router.get('/barbershops/:id', (req, res) => barbershop().getById(req, res));
router.post('/barbershops', auth_1.authMiddleware, auth_1.adminMiddleware, (req, res) => barbershop().create(req, res));
router.put('/barbershops/:id', auth_1.authMiddleware, auth_1.adminMiddleware, (req, res) => barbershop().update(req, res));
// Barber routes
router.get('/barbers', (req, res) => barber().list(req, res));
router.get('/barbers/:id', (req, res) => barber().getById(req, res));
router.post('/barbers', auth_1.authMiddleware, auth_1.adminMiddleware, (req, res) => barber().create(req, res));
router.put('/barbers/:id', auth_1.authMiddleware, auth_1.adminMiddleware, (req, res) => barber().update(req, res));
router.delete('/barbers/:id', auth_1.authMiddleware, auth_1.adminMiddleware, (req, res) => barber().delete(req, res));
// Service routes
router.get('/services', (req, res) => service().list(req, res));
router.post('/services', auth_1.authMiddleware, auth_1.adminMiddleware, (req, res) => service().create(req, res));
router.put('/services/:id', auth_1.authMiddleware, auth_1.adminMiddleware, (req, res) => service().update(req, res));
router.delete('/services/:id', auth_1.authMiddleware, auth_1.adminMiddleware, (req, res) => service().delete(req, res));
// Appointment routes
router.get('/appointments/available-slots', auth_1.authMiddleware, (req, res) => appointment().getAvailableSlots(req, res));
router.get('/appointments/admin/stats', auth_1.authMiddleware, auth_1.adminMiddleware, (req, res) => appointment().getStats(req, res));
router.get('/appointments/admin/all', auth_1.authMiddleware, auth_1.adminMiddleware, (req, res) => appointment().listAll(req, res));
router.get('/appointments', auth_1.authMiddleware, (req, res) => appointment().list(req, res));
router.post('/appointments', auth_1.authMiddleware, (req, res) => appointment().create(req, res));
router.put('/appointments/:id/status', auth_1.authMiddleware, (req, res) => appointment().updateStatus(req, res));
exports.default = router;
