import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Service } from '../entities/Service';

export class ServiceController {
  private get serviceRepository() {
    return AppDataSource.getRepository(Service);
  }

  async create(req: Request, res: Response) {
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
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao criar serviço' });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const { barbershopId } = req.query;

      const where: any = { isActive: true };

      if (barbershopId) {
        where.barbershopId = barbershopId;
      }

      const services = await this.serviceRepository.find({
        where,
        relations: ['barbershop'],
      });

      return res.json(services);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao listar serviços' });
    }
  }

  async update(req: Request, res: Response) {
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
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao atualizar serviço' });
    }
  }

  async delete(req: Request, res: Response) {
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
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao deletar serviço' });
    }
  }
}
