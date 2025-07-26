-- Script SQL para corrigir os enums UserRole e LeadSource

-- 1. Primeiro, vamos atualizar os valores do UserRole para maiúsculas
-- Isso precisa ser feito diretamente no PostgreSQL

-- Atualizar valores existentes para maiúsculas
UPDATE users 
SET role = CASE 
    WHEN role = 'admin' THEN 'ADMIN'
    WHEN role = 'manager' THEN 'MANAGER'
    WHEN role = 'user' THEN 'USER'
    WHEN role = 'agent' THEN 'AGENT'
    WHEN role = 'assistant' THEN 'ASSISTANT'
    ELSE role
END
WHERE role IN ('admin', 'manager', 'user', 'agent', 'assistant');

-- 2. Verificar se existem leads com sources que precisam ser atualizados
SELECT DISTINCT source FROM leads;

-- 3. Mostrar o resultado da atualização
SELECT role, COUNT(*) as count FROM users GROUP BY role;
