"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BarbershopController = void 0;
const data_source_1 = require("../data-source");
const Barbershop_1 = require("../entities/Barbershop");
class BarbershopController {
    get barbershopRepository() {
        return data_source_1.AppDataSource.getRepository(Barbershop_1.Barbershop);
    }
    async create(req, res) {
        try {
            const { name, description, address, phone, openTime, closeTime } = req.body;
            const barbershop = this.barbershopRepository.create({
                name,
                description,
                address,
                phone,
                openTime,
                closeTime,
            });
            await this.barbershopRepository.save(barbershop);
            return res.status(201).json(barbershop);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao criar barbearia' });
        }
    }
    async list(req, res) {
        try {
            const barbershops = await this.barbershopRepository.find({
                where: { isActive: true },
                relations: ['barbers', 'services'],
            });
            return res.json(barbershops);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao listar barbearias' });
        }
    }
    async getById(req, res) {
        try {
            const { id } = req.params;
            const barbershop = await this.barbershopRepository.findOne({
                where: { id },
                relations: ['barbers', 'services'],
            });
            if (!barbershop) {
                return res.status(404).json({ error: 'Barbearia não encontrada' });
            }
            return res.json(barbershop);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao buscar barbearia' });
        }
    }
    async update(req, res) {
        try {
            const { id } = req.params;
            const { name, description, address, phone, openTime, closeTime, isActive } = req.body;
            const barbershop = await this.barbershopRepository.findOne({
                where: { id },
            });
            if (!barbershop) {
                return res.status(404).json({ error: 'Barbearia não encontrada' });
            }
            barbershop.name = name || barbershop.name;
            barbershop.description = description || barbershop.description;
            barbershop.address = address || barbershop.address;
            barbershop.phone = phone || barbershop.phone;
            barbershop.openTime = openTime || barbershop.openTime;
            barbershop.closeTime = closeTime || barbershop.closeTime;
            barbershop.isActive = isActive !== undefined ? isActive : barbershop.isActive;
            await this.barbershopRepository.save(barbershop);
            return res.json(barbershop);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao atualizar barbearia' });
        }
    }
}
exports.BarbershopController = BarbershopController;
