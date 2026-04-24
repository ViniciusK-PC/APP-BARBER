"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BarberController = void 0;
const data_source_1 = require("../data-source");
const Barber_1 = require("../entities/Barber");
class BarberController {
    get barberRepository() {
        return data_source_1.AppDataSource.getRepository(Barber_1.Barber);
    }
    async create(req, res) {
        try {
            const { name, phone, email, barbershopId, availability } = req.body;
            const barber = this.barberRepository.create({
                name,
                phone,
                email,
                barbershopId,
                availability,
            });
            await this.barberRepository.save(barber);
            return res.status(201).json(barber);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao criar barbeiro' });
        }
    }
    async list(req, res) {
        try {
            const { barbershopId } = req.query;
            const where = { isActive: true };
            if (barbershopId) {
                where.barbershopId = barbershopId;
            }
            const barbers = await this.barberRepository.find({
                where,
                relations: ['barbershop'],
            });
            return res.json(barbers);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao listar barbeiros' });
        }
    }
    async getById(req, res) {
        try {
            const { id } = req.params;
            const barber = await this.barberRepository.findOne({
                where: { id },
                relations: ['barbershop'],
            });
            if (!barber) {
                return res.status(404).json({ error: 'Barbeiro não encontrado' });
            }
            return res.json(barber);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao buscar barbeiro' });
        }
    }
    async update(req, res) {
        try {
            const { id } = req.params;
            const { name, phone, email, availability, isActive } = req.body;
            const barber = await this.barberRepository.findOne({
                where: { id },
            });
            if (!barber) {
                return res.status(404).json({ error: 'Barbeiro não encontrado' });
            }
            barber.name = name || barber.name;
            barber.phone = phone || barber.phone;
            barber.email = email || barber.email;
            barber.availability = availability || barber.availability;
            barber.isActive = isActive !== undefined ? isActive : barber.isActive;
            await this.barberRepository.save(barber);
            return res.json(barber);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao atualizar barbeiro' });
        }
    }
    async delete(req, res) {
        try {
            const { id } = req.params;
            const barber = await this.barberRepository.findOne({
                where: { id },
            });
            if (!barber) {
                return res.status(404).json({ error: 'Barbeiro não encontrado' });
            }
            barber.isActive = false;
            await this.barberRepository.save(barber);
            return res.json({ message: 'Barbeiro desativado com sucesso' });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao deletar barbeiro' });
        }
    }
}
exports.BarberController = BarberController;
