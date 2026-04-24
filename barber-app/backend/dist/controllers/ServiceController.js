"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceController = void 0;
const data_source_1 = require("../data-source");
const Service_1 = require("../entities/Service");
class ServiceController {
    get serviceRepository() {
        return data_source_1.AppDataSource.getRepository(Service_1.Service);
    }
    async create(req, res) {
        try {
            const { name, description, price, duration, barbershopId } = req.body;
            const service = this.serviceRepository.create({
                name,
                description,
                price,
                duration,
                barbershopId,
            });
            await this.serviceRepository.save(service);
            return res.status(201).json(service);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao criar serviço' });
        }
    }
    async list(req, res) {
        try {
            const { barbershopId } = req.query;
            const where = { isActive: true };
            if (barbershopId) {
                where.barbershopId = barbershopId;
            }
            const services = await this.serviceRepository.find({
                where,
                relations: ['barbershop'],
            });
            return res.json(services);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao listar serviços' });
        }
    }
    async update(req, res) {
        try {
            const { id } = req.params;
            const { name, description, price, duration, isActive } = req.body;
            const service = await this.serviceRepository.findOne({
                where: { id },
            });
            if (!service) {
                return res.status(404).json({ error: 'Serviço não encontrado' });
            }
            service.name = name || service.name;
            service.description = description || service.description;
            service.price = price || service.price;
            service.duration = duration || service.duration;
            service.isActive = isActive !== undefined ? isActive : service.isActive;
            await this.serviceRepository.save(service);
            return res.json(service);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao atualizar serviço' });
        }
    }
    async delete(req, res) {
        try {
            const { id } = req.params;
            const service = await this.serviceRepository.findOne({
                where: { id },
            });
            if (!service) {
                return res.status(404).json({ error: 'Serviço não encontrado' });
            }
            service.isActive = false;
            await this.serviceRepository.save(service);
            return res.json({ message: 'Serviço desativado com sucesso' });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao deletar serviço' });
        }
    }
}
exports.ServiceController = ServiceController;
