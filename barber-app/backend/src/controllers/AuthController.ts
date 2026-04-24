import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class AuthController {
  private get userRepository() {
    return AppDataSource.getRepository(User);
  }

  async register(req: Request, res: Response) {
    try {
      const { name, email, password, phone, role } = req.body;

      const userExists = await this.userRepository.findOne({
        where: { email },
      });

      if (userExists) {
        return res.status(400).json({ error: 'Email já cadastrado' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = this.userRepository.create({
        name,
        email,
        password: hashedPassword,
        phone,
        role: role || 'client',
      });

      await this.userRepository.save(user);

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '7d' }
      );

      const { password: _, ...userWithoutPassword } = user;

      return res.status(201).json({
        user: userWithoutPassword,
        token,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao criar usuário' });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const url = `${req.protocol}://${req.get('host')}/api/auth/login`;
      console.log(`🔍 Login URL: ${url}`);
      console.log(`📤 Login body: ${JSON.stringify(req.body)}`);
      
      const { email, password } = req.body;

      const user = await this.userRepository.findOne({
        where: { email },
      });

      if (!user) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '7d' }
      );

      const { password: _, ...userWithoutPassword } = user;

      console.log(`✅ Login bem-sucedido para: ${email}`);

      return res.json({
        user: userWithoutPassword,
        token,
      });
    } catch (error) {
      console.error('❌ Login error:', error);
      return res.status(500).json({ error: 'Erro ao fazer login' });
    }
  }

  async updateFcmToken(req: Request, res: Response) {
    try {
      const { userId, fcmToken } = req.body;

      await this.userRepository.update(userId, { fcmToken });

      return res.json({ message: 'Token FCM atualizado' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao atualizar token' });
    }
  }
}
