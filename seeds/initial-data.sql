-- Script para inserir dados iniciais no sistema CRM

-- Inserir algumas filiais
INSERT INTO branches (id, name, code, address, contact, "createdAt", "updatedAt") VALUES
('branch-1', 'Matriz São Paulo', 'SP-001', 
 '{"street": "Av. Paulista", "number": "1000", "neighborhood": "Bela Vista", "city": "São Paulo", "state": "SP", "zipCode": "01310-100", "country": "Brasil"}',
 '{"phone": "(11) 3000-0000", "email": "matriz@empresa.com", "website": "www.empresa.com"}',
 NOW(), NOW()),
('branch-2', 'Filial Campinas', 'CP-001',
 '{"street": "Rua das Flores", "number": "500", "neighborhood": "Centro", "city": "Campinas", "state": "SP", "zipCode": "13010-100", "country": "Brasil"}',
 '{"phone": "(19) 3000-0001", "email": "campinas@empresa.com", "website": "www.empresa.com"}',
 NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Inserir alguns funcionários
INSERT INTO employees (id, name, email, phone, cpf, position, department, "branchId", "hireDate", "createdAt", "updatedAt") VALUES
('emp-1', 'João Silva', 'joao.silva@empresa.com', '(11) 99999-0001', '123.456.789-01', 'Consultor de Vendas', 'Vendas', 'branch-1', NOW() - INTERVAL '2 years', NOW(), NOW()),
('emp-2', 'Maria Santos', 'maria.santos@empresa.com', '(11) 99999-0002', '123.456.789-02', 'Consultora Senior', 'Vendas', 'branch-1', NOW() - INTERVAL '3 years', NOW(), NOW()),
('emp-3', 'Pedro Costa', 'pedro.costa@empresa.com', '(19) 99999-0003', '123.456.789-03', 'Consultor de Vendas', 'Vendas', 'branch-2', NOW() - INTERVAL '1 year', NOW(), NOW()),
('emp-4', 'Ana Oliveira', 'ana.oliveira@empresa.com', '(11) 99999-0004', '123.456.789-04', 'Gerente de Vendas', 'Vendas', 'branch-1', NOW() - INTERVAL '5 years', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Inserir alguns usuários primeiro (necessários para as propriedades)
INSERT INTO users (id, name, email, role, "branchId", "employeeId", "createdAt", "updatedAt") VALUES
('user-1', 'João Silva', 'joao.silva@empresa.com', 'AGENT', 'branch-1', 'emp-1', NOW(), NOW()),
('user-2', 'Maria Santos', 'maria.santos@empresa.com', 'AGENT', 'branch-1', 'emp-2', NOW(), NOW()),
('user-3', 'Pedro Costa', 'pedro.costa@empresa.com', 'AGENT', 'branch-2', 'emp-3', NOW(), NOW()),
('user-4', 'Ana Oliveira', 'ana.oliveira@empresa.com', 'MANAGER', 'branch-1', 'emp-4', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Inserir algumas propriedades de exemplo
INSERT INTO properties (id, title, description, type, price, bedrooms, bathrooms, area, "parkingSpaces", street, number, neighborhood, city, state, "zipCode", country, status, "agentId", "branchId", "createdAt", "updatedAt") VALUES
('prop-1', 'Casa Moderna Jardim Europa', 'Linda casa com 4 quartos em condomínio fechado', 'HOUSE', 850000, 4, 3, 280, 2, 'Rua das Palmeiras', '123', 'Jardim Europa', 'São Paulo', 'SP', '01234-567', 'Brasil', 'AVAILABLE', 'user-1', 'branch-1', NOW(), NOW()),
('prop-2', 'Apartamento Vila Olímpia', 'Apartamento moderno com vista panorâmica', 'APARTMENT', 1200000, 3, 2, 120, 2, 'Av. Brigadeiro Faria Lima', '456', 'Vila Olímpia', 'São Paulo', 'SP', '04567-890', 'Brasil', 'AVAILABLE', 'user-2', 'branch-1', NOW(), NOW()),
('prop-3', 'Casa de Campo', 'Casa espaçosa em condomínio de alto padrão', 'HOUSE', 2500000, 5, 4, 450, 4, 'Estrada do Campo', '789', 'Alphaville', 'Barueri', 'SP', '06789-123', 'Brasil', 'AVAILABLE', 'user-3', 'branch-2', NOW(), NOW()),
('prop-4', 'Studio Centro', 'Studio compacto e moderno no centro da cidade', 'APARTMENT', 350000, 1, 1, 45, 1, 'Rua Augusta', '321', 'Centro', 'São Paulo', 'SP', '01234-098', 'Brasil', 'AVAILABLE', 'user-1', 'branch-1', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Inserir alguns leads de exemplo
INSERT INTO leads (id, name, email, phone, status, source, interest, budget, notes, "agentId", "propertyId", "branchId", "createdAt", "updatedAt", "lastContactAt") VALUES
('lead-1', 'Carlos Mendes', 'carlos.mendes@email.com', '(11) 98765-4321', 'NEW', 'WEBSITE', 'Casa para família', 800000, 'Cliente interessado em imóvel próximo a escola', 'user-1', 'prop-1', 'branch-1', NOW() - INTERVAL '2 days', NOW(), NULL),
('lead-2', 'Fernanda Lima', 'fernanda.lima@email.com', '(11) 98765-4322', 'CONTACTED', 'SOCIAL', 'Apartamento para investimento', 1500000, 'Investidora experiente, busca rentabilidade', 'user-2', 'prop-2', 'branch-1', NOW() - INTERVAL '5 days', NOW(), NOW() - INTERVAL '1 day'),
('lead-3', 'Roberto Souza', 'roberto.souza@email.com', '(19) 98765-4323', 'QUALIFIED', 'REFERRAL', 'Casa de alto padrão', 2000000, 'Indicação de cliente atual, muito interessado', 'user-3', 'prop-3', 'branch-2', NOW() - INTERVAL '7 days', NOW(), NOW() - INTERVAL '2 days'),
('lead-4', 'Juliana Rodrigues', 'juliana.rodrigues@email.com', '(11) 98765-4324', 'PROPOSAL', 'OTHER', 'Primeiro apartamento', 400000, 'Primeira compra, precisa de financiamento', 'user-1', 'prop-4', 'branch-1', NOW() - INTERVAL '10 days', NOW(), NOW() - INTERVAL '1 day'),
('lead-5', 'Marcos Pereira', 'marcos.pereira@email.com', '(11) 98765-4325', 'CLOSED', 'OTHER', 'Casa para aposentadoria', 900000, 'Fechou negócio na semana passada', 'user-2', 'prop-1', 'branch-1', NOW() - INTERVAL '15 days', NOW(), NOW() - INTERVAL '3 days'),
('lead-6', 'Patrícia Alves', 'patricia.alves@email.com', '(11) 98765-4326', 'LOST', 'OTHER', 'Apartamento de luxo', 1800000, 'Desistiu por questões financeiras', 'user-4', 'prop-2', 'branch-1', NOW() - INTERVAL '20 days', NOW(), NOW() - INTERVAL '10 days'),
('lead-7', 'Ricardo Santos', 'ricardo.santos@email.com', '(11) 98765-4327', 'NEW', 'WEBSITE', 'Casa com quintal', 750000, 'Busca casa com espaço para pets', 'user-1', NULL, 'branch-1', NOW() - INTERVAL '1 day', NOW(), NULL),
('lead-8', 'Camila Costa', 'camila.costa@email.com', '(19) 98765-4328', 'CONTACTED', 'REFERRAL', 'Apartamento moderno', 1100000, 'Referência de amigo, muito interessada', 'user-3', 'prop-2', 'branch-2', NOW() - INTERVAL '3 days', NOW(), NOW() - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;
