"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDatabase = seedDatabase;
const data_source_1 = require("../data-source");
const User_1 = require("../entities/User");
const Barbershop_1 = require("../entities/Barbershop");
const Barber_1 = require("../entities/Barber");
const Service_1 = require("../entities/Service");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
async function seedDatabase() {
    console.log('🌱 Iniciando seed do banco de dados...');
    try {
        // Criar usuário admin
        const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
        const adminExists = await userRepository.findOne({
            where: { email: 'admin@barber.com' },
        });
        let admin;
        if (!adminExists) {
            const hashedPassword = await bcryptjs_1.default.hash('admin123', 10);
            admin = userRepository.create({
                name: 'Jonas',
                email: 'admin@barber.com',
                password: hashedPassword,
                phone: '(11) 99999-9999',
                role: User_1.UserRole.ADMIN,
            });
            await userRepository.save(admin);
            console.log('✅ Admin criado: admin@barber.com / admin123');
        }
        else {
            admin = adminExists;
            console.log('ℹ️  Admin já existe');
        }
        // Criar usuário cliente de teste
        const clientExists = await userRepository.findOne({
            where: { email: 'cliente@teste.com' },
        });
        if (!clientExists) {
            const hashedPassword = await bcryptjs_1.default.hash('123456', 10);
            const client = userRepository.create({
                name: 'Cliente Teste',
                email: 'cliente@teste.com',
                password: hashedPassword,
                phone: '(11) 98888-8888',
                role: User_1.UserRole.CLIENT,
            });
            await userRepository.save(client);
            console.log('✅ Cliente criado: cliente@teste.com / 123456');
        }
        else {
            console.log('ℹ️  Cliente teste já existe');
        }
        // Criar barbearia
        const barbershopRepository = data_source_1.AppDataSource.getRepository(Barbershop_1.Barbershop);
        const barbershopExists = await barbershopRepository.findOne({
            where: { name: 'Barbearia Premium' },
        });
        let barbershop;
        if (!barbershopExists) {
            barbershop = barbershopRepository.create({
                name: 'Barbearia Premium',
                description: 'A melhor barbearia da cidade',
                address: 'Rua das Flores, 123 - Centro',
                phone: '(11) 3333-3333',
                openTime: '09:00:00',
                closeTime: '19:00:00',
            });
            await barbershopRepository.save(barbershop);
            console.log('✅ Barbearia criada');
        }
        else {
            barbershop = barbershopExists;
            console.log('ℹ️  Barbearia já existe');
        }
        // Criar barbeiros
        const barberRepository = data_source_1.AppDataSource.getRepository(Barber_1.Barber);
        const barber1Exists = await barberRepository.findOne({
            where: { name: 'João Silva' },
        });
        if (!barber1Exists) {
            const barber1 = barberRepository.create({
                name: 'João Silva',
                phone: '(11) 97777-7777',
                email: 'joao@barber.com',
                barbershopId: barbershop.id,
                availability: {
                    '1': { enabled: true, slots: ['09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00', '15:30', '16:00'] },
                    '2': { enabled: true, slots: ['09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00', '15:30', '16:00'] },
                    '3': { enabled: true, slots: ['09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00', '15:30', '16:00'] },
                    '4': { enabled: true, slots: ['09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00', '15:30', '16:00'] },
                    '5': { enabled: true, slots: ['09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00', '15:30', '16:00'] },
                    '6': { enabled: true, slots: ['09:00', '09:30', '10:00', '10:30', '11:00'] },
                    '0': { enabled: false, slots: [] },
                },
            });
            await barberRepository.save(barber1);
            console.log('✅ Barbeiro João criado');
        }
        else {
            console.log('ℹ️  Barbeiro João já existe');
        }
        const barber2Exists = await barberRepository.findOne({
            where: { name: 'Pedro Santos' },
        });
        if (!barber2Exists) {
            const barber2 = barberRepository.create({
                name: 'Pedro Santos',
                phone: '(11) 96666-6666',
                email: 'pedro@barber.com',
                barbershopId: barbershop.id,
                availability: {
                    '1': { enabled: true, slots: ['09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00', '15:30', '16:00'] },
                    '2': { enabled: true, slots: ['09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00', '15:30', '16:00'] },
                    '3': { enabled: true, slots: ['09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00', '15:30', '16:00'] },
                    '4': { enabled: true, slots: ['09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00', '15:30', '16:00'] },
                    '5': { enabled: true, slots: ['09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00', '15:30', '16:00'] },
                    '6': { enabled: false, slots: [] },
                    '0': { enabled: false, slots: [] },
                },
            });
            await barberRepository.save(barber2);
            console.log('✅ Barbeiro Pedro criado');
        }
        else {
            console.log('ℹ️  Barbeiro Pedro já existe');
        }
        // Criar serviços
        const serviceRepository = data_source_1.AppDataSource.getRepository(Service_1.Service);
        const services = [
            { name: 'Corte Simples', description: 'Corte de cabelo tradicional', price: 30, duration: 30 },
            { name: 'Corte + Barba', description: 'Corte de cabelo e barba', price: 50, duration: 45 },
            { name: 'Barba', description: 'Apenas barba', price: 25, duration: 20 },
            { name: 'Corte Premium', description: 'Corte estilizado com finalização', price: 60, duration: 60 },
        ];
        for (const serviceData of services) {
            const exists = await serviceRepository.findOne({
                where: { name: serviceData.name, barbershopId: barbershop.id },
            });
            if (!exists) {
                const service = serviceRepository.create({
                    ...serviceData,
                    barbershopId: barbershop.id,
                });
                await serviceRepository.save(service);
                console.log(`✅ Serviço "${serviceData.name}" criado`);
            }
            else {
                console.log(`ℹ️  Serviço "${serviceData.name}" já existe`);
            }
        }
        console.log('\n✅ Seed concluído com sucesso!');
        console.log('\n📝 Credenciais de acesso:');
        console.log('Admin: admin@barber.com / admin123');
        console.log('Cliente: cliente@teste.com / 123456');
    }
    catch (error) {
        console.error('❌ Erro ao executar seed:', error);
        throw error;
    }
}
// Executar seed se chamado diretamente
if (require.main === module) {
    data_source_1.AppDataSource.initialize()
        .then(async () => {
        await seedDatabase();
        process.exit(0);
    })
        .catch((error) => {
        console.error(error);
        process.exit(1);
    });
}
