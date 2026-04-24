import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Barbershop } from '../entities/Barbershop';

export class BarbershopController {
  private get barbershopRepository() {
    return AppDataSource.getRepository(Barbershop);
  }

  async create(req: Request, res: Response) {
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
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao criar barbearia' });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const barbershops = await this.barbershopRepository.find({
        where: { isActive: true },
        relations: ['barbers', 'services'],
      });

      return res.json(barbershops);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao listar barbearias' });
    }
  }

  async getById(req: Request, res: Response) {
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
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao buscar barbearia' });
    }
  }

  async update(req: Request, res: Response) {
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
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao atualizar barbearia' });
    }
  }
}
