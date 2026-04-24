"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const data_source_1 = require("../data-source");
const User_1 = require("../entities/User");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthController {
    get userRepository() {
        return data_source_1.AppDataSource.getRepository(User_1.User);
    }
    async register(req, res) {
        try {
            const { name, email, password, phone, role } = req.body;
            const userExists = await this.userRepository.findOne({
                where: { email },
            });
            if (userExists) {
                return res.status(400).json({ error: 'Email já cadastrado' });
            }
            const hashedPassword = await bcryptjs_1.default.hash(password, 10);
            const user = this.userRepository.create({
                name,
                email,
                password: hashedPassword,
                phone,
                role: role || 'client',
            });
            await this.userRepository.save(user);
            const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
            const { password: _, ...userWithoutPassword } = user;
            return res.status(201).json({
                user: userWithoutPassword,
                token,
            });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao criar usuário' });
        }
    }
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await this.userRepository.findOne({
                where: { email },
            });
            if (!user) {
                return res.status(401).json({ error: 'Credenciais inválidas' });
            }
            const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Credenciais inválidas' });
            }
            const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
            const { password: _, ...userWithoutPassword } = user;
            return res.json({
                user: userWithoutPassword,
                token,
            });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao fazer login' });
        }
    }
    async updateFcmToken(req, res) {
        try {
            const { userId, fcmToken } = req.body;
            await this.userRepository.update(userId, { fcmToken });
            return res.json({ message: 'Token FCM atualizado' });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao atualizar token' });
        }
    }
}
exports.AuthController = AuthController;
