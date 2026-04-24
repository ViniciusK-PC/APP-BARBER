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
// Controllers
const authController = new AuthController_1.AuthController();
const barbershopController = new BarbershopController_1.BarbershopController();
const barberController = new BarberController_1.BarberController();
const serviceController = new ServiceController_1.ServiceController();
const appointmentController = new AppointmentController_1.AppointmentController();
// Auth routes
router.post('/auth/register', (req, res) => authController.register(req, res));
router.post('/auth/login', (req, res) => authController.login(req, res));
router.post('/auth/fcm-token', (req, res) => authController.updateFcmToken(req, res));
// Barbershop routes
router.get('/barbershops', (req, res) => barbershopController.list(req, res));
router.get('/barbershops/:id', (req, res) => barbershopController.getById(req, res));
router.post('/barbershops', auth_1.authMiddleware, auth_1.adminMiddleware, (req, res) => barbershopController.create(req, res));
router.put('/barbershops/:id', auth_1.authMiddleware, auth_1.adminMiddleware, (req, res) => barbershopController.update(req, res));
// Barber routes
router.get('/barbers', (req, res) => barberController.list(req, res));
router.get('/barbers/:id', (req, res) => barberController.getById(req, res));
router.post('/barbers', auth_1.authMiddleware, auth_1.adminMiddleware, (req, res) => barberController.create(req, res));
router.put('/barbers/:id', auth_1.authMiddleware, auth_1.adminMiddleware, (req, res) => barberController.update(req, res));
router.delete('/barbers/:id', auth_1.authMiddleware, auth_1.adminMiddleware, (req, res) => barberController.delete(req, res));
// Service routes
router.get('/services', (req, res) => serviceController.list(req, res));
router.post('/services', auth_1.authMiddleware, auth_1.adminMiddleware, (req, res) => serviceController.create(req, res));
router.put('/services/:id', auth_1.authMiddleware, auth_1.adminMiddleware, (req, res) => serviceController.update(req, res));
router.delete('/services/:id', auth_1.authMiddleware, auth_1.adminMiddleware, (req, res) => serviceController.delete(req, res));
// Appointment routes
router.get('/appointments/available-slots', auth_1.authMiddleware, (req, res) => appointmentController.getAvailableSlots(req, res));
router.get('/appointments/admin/stats', auth_1.authMiddleware, auth_1.adminMiddleware, (req, res) => appointmentController.getStats(req, res));
router.get('/appointments/admin/all', auth_1.authMiddleware, auth_1.adminMiddleware, (req, res) => appointmentController.listAll(req, res));
router.get('/appointments', auth_1.authMiddleware, (req, res) => appointmentController.list(req, res));
router.post('/appointments', auth_1.authMiddleware, (req, res) => appointmentController.create(req, res));
router.put('/appointments/:id/status', auth_1.authMiddleware, (req, res) => appointmentController.updateStatus(req, res));
exports.default = router;
