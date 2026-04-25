-- Script de inicialização do banco de dados Barber App
-- Execute este script no Supabase SQL Editor

-- Criar tabelas (caso não existam)

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) NOT NULL DEFAULT 'CLIENT',
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS barbershops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    address VARCHAR(500) NOT NULL,
    phone VARCHAR(20),
    description TEXT,
    open_time VARCHAR(10),
    close_time VARCHAR(10),
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS barbers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    specialty VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    barbershop_id UUID NOT NULL,
    FOREIGN KEY (barbershop_id) REFERENCES barbershops(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    duration INTEGER NOT NULL DEFAULT 30,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    barbershop_id UUID NOT NULL,
    FOREIGN KEY (barbershop_id) REFERENCES barbershops(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL,
    time TIME NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    client_id UUID NOT NULL,
    barber_id UUID NOT NULL,
    service_id UUID NOT NULL,
    notes TEXT,
    FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (barber_id) REFERENCES barbers(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_appointments_client ON appointments(client_id);
CREATE INDEX IF NOT EXISTS idx_appointments_barber ON appointments(barber_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_barbers_barbershop ON barbers(barbershop_id);
CREATE INDEX IF NOT EXISTS idx_services_barbershop ON services(barbershop_id);

-- Dados de exemplo

-- Inserir usuário admin (senha: admin123)
INSERT INTO users (name, email, password, phone, role) 
VALUES (
    'Administrador',
    'admin@barberapp.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    '(11) 99999-9999',
    'ADMIN'
) ON CONFLICT (email) DO NOTHING;

-- Inserir usuário cliente (senha: cliente123)
INSERT INTO users (name, email, password, phone, role) 
VALUES (
    'João Silva',
    'joao@email.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    '(11) 98888-8888',
    'CLIENT'
) ON CONFLICT (email) DO NOTHING;

-- Inserir barbearias
INSERT INTO barbershops (name, address, phone, description, open_time, close_time, is_active)
VALUES 
    ('Barbearia Clássica', 'Rua das Flores, 123 - Centro', '(11) 3333-4444', 'A melhor barbearia da região com mais de 20 anos de tradição', '09:00', '19:00', TRUE),
    ('Modern Barber Shop', 'Av. Paulista, 1000 - Bela Vista', '(11) 5555-6666', 'Estilo moderno e atendimento de qualidade', '10:00', '20:00', TRUE),
    ('Barber Kings', 'Rua Augusta, 500 - Consolação', '(11) 7777-8888', 'Especializada em cortes masculinos e barba', '08:00', '18:00', TRUE)
ON CONFLICT DO NOTHING;

-- Inserir barbeiros (usando IDs das barbearias)
DO $$
DECLARE
    barbershop1_id UUID;
    barbershop2_id UUID;
    barbershop3_id UUID;
BEGIN
    SELECT id INTO barbershop1_id FROM barbershops WHERE name = 'Barbearia Clássica' LIMIT 1;
    SELECT id INTO barbershop2_id FROM barbershops WHERE name = 'Modern Barber Shop' LIMIT 1;
    SELECT id INTO barbershop3_id FROM barbershops WHERE name = 'Barber Kings' LIMIT 1;
    
    IF barbershop1_id IS NOT NULL THEN
        INSERT INTO barbers (name, specialty, phone, email, is_active, barbershop_id)
        VALUES 
            ('Carlos Mendes', 'Cortes clássicos', '(11) 91111-1111', 'carlos@barber.com', TRUE, barbershop1_id),
            ('Roberto Santos', 'Barba e bigode', '(11) 92222-2222', 'roberto@barber.com', TRUE, barbershop1_id)
        ON CONFLICT DO NOTHING;
    END IF;
    
    IF barbershop2_id IS NOT NULL THEN
        INSERT INTO barbers (name, specialty, phone, email, is_active, barbershop_id)
        VALUES 
            ('Pedro Lima', 'Cortes modernos', '(11) 93333-3333', 'pedro@barber.com', TRUE, barbershop2_id),
            ('Lucas Oliveira', 'Degradê e fade', '(11) 94444-4444', 'lucas@barber.com', TRUE, barbershop2_id)
        ON CONFLICT DO NOTHING;
    END IF;
    
    IF barbershop3_id IS NOT NULL THEN
        INSERT INTO barbers (name, specialty, phone, email, is_active, barbershop_id)
        VALUES 
            ('Fernando Costa', 'Especialista em barba', '(11) 95555-5555', 'fernando@barber.com', TRUE, barbershop3_id),
            ('Marcelo Souza', 'Cortes e coloração', '(11) 96666-6666', 'marcelo@barber.com', TRUE, barbershop3_id)
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- Inserir serviços
DO $$
DECLARE
    barbershop1_id UUID;
    barbershop2_id UUID;
    barbershop3_id UUID;
BEGIN
    SELECT id INTO barbershop1_id FROM barbershops WHERE name = 'Barbearia Clássica' LIMIT 1;
    SELECT id INTO barbershop2_id FROM barbershops WHERE name = 'Modern Barber Shop' LIMIT 1;
    SELECT id INTO barbershop3_id FROM barbershops WHERE name = 'Barber Kings' LIMIT 1;
    
    IF barbershop1_id IS NOT NULL THEN
        INSERT INTO services (name, description, price, duration, is_active, barbershop_id)
        VALUES 
            ('Corte Simples', 'Corte de cabelo tradicional', 35.00, 30, TRUE, barbershop1_id),
            ('Corte + Barba', 'Corte de cabelo e barba completa', 55.00, 45, TRUE, barbershop1_id),
            ('Barba', 'Aparar e modelar barba', 25.00, 20, TRUE, barbershop1_id)
        ON CONFLICT DO NOTHING;
    END IF;
    
    IF barbershop2_id IS NOT NULL THEN
        INSERT INTO services (name, description, price, duration, is_active, barbershop_id)
        VALUES 
            ('Corte Moderno', 'Cortes estilosos e modernos', 45.00, 40, TRUE, barbershop2_id),
            ('Degradê', 'Degradê profissional', 50.00, 45, TRUE, barbershop2_id),
            ('Platinado', 'Descoloração completa', 120.00, 90, TRUE, barbershop2_id)
        ON CONFLICT DO NOTHING;
    END IF;
    
    IF barbershop3_id IS NOT NULL THEN
        INSERT INTO services (name, description, price, duration, is_active, barbershop_id)
        VALUES 
            ('Corte Premium', 'Corte premium com acabamento', 60.00, 50, TRUE, barbershop3_id),
            ('Barba Premium', 'Barba completa com toalha quente', 40.00, 30, TRUE, barbershop3_id),
            ('Combo King', 'Corte + Barba + Sobrancelha', 85.00, 60, TRUE, barbershop3_id)
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- Mensagem de sucesso
SELECT 'Banco de dados inicializado com sucesso!' AS status;
