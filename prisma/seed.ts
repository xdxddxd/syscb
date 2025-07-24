import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Criar usuário administrador padrão
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@sistema.com' },
    update: {},
    create: {
      name: 'Administrador do Sistema',
      email: 'admin@sistema.com',
      phone: '(11) 99999-9999',
      role: 'admin',
      employeeId: 'emp-admin',
      isActive: true,
      permissions: {
        dashboard: { create: true, read: true, update: true, delete: true },
        properties: { create: true, read: true, update: true, delete: true },
        clients: { create: true, read: true, update: true, delete: true },
        contracts: { create: true, read: true, update: true, delete: true },
        financial: { create: true, read: true, update: true, delete: true },
        reports: { create: true, read: true, update: true, delete: true },
        employees: { create: true, read: true, update: true, delete: true },
        marketing: { create: true, read: true, update: true, delete: true },
        users: { create: true, read: true, update: true, delete: true },
        settings: { create: true, read: true, update: true, delete: true },
        support: { create: true, read: true, update: true, delete: true }
      },
      lastLogin: new Date()
    }
  });

  // Criar usuário gerente de exemplo
  const managerUser = await prisma.user.upsert({
    where: { email: 'gerente@sistema.com' },
    update: {},
    create: {
      name: 'Gerente de Vendas',
      email: 'gerente@sistema.com',
      phone: '(11) 98888-8888',
      role: 'manager',
      employeeId: 'emp-1',
      isActive: true,
      permissions: {
        dashboard: { create: false, read: true, update: false, delete: false },
        properties: { create: true, read: true, update: true, delete: false },
        clients: { create: true, read: true, update: true, delete: false },
        contracts: { create: true, read: true, update: true, delete: false },
        financial: { create: false, read: true, update: false, delete: false },
        reports: { create: false, read: true, update: false, delete: false },
        employees: { create: false, read: true, update: false, delete: false },
        marketing: { create: true, read: true, update: true, delete: false },
        users: { create: false, read: true, update: false, delete: false },
        settings: { create: false, read: true, update: false, delete: false },
        support: { create: true, read: true, update: false, delete: false }
      },
      lastLogin: new Date()
    }
  });

  // Criar usuário padrão de exemplo
  const regularUser = await prisma.user.upsert({
    where: { email: 'usuario@sistema.com' },
    update: {},
    create: {
      name: 'Usuário Padrão',
      email: 'usuario@sistema.com',
      phone: '(11) 97777-7777',
      role: 'user',
      employeeId: 'emp-2',
      isActive: true,
      permissions: {
        dashboard: { create: false, read: true, update: false, delete: false },
        properties: { create: false, read: true, update: false, delete: false },
        clients: { create: true, read: true, update: true, delete: false },
        contracts: { create: false, read: true, update: false, delete: false },
        financial: { create: false, read: false, update: false, delete: false },
        reports: { create: false, read: false, update: false, delete: false },
        employees: { create: false, read: false, update: false, delete: false },
        marketing: { create: false, read: true, update: false, delete: false },
        users: { create: false, read: false, update: false, delete: false },
        settings: { create: false, read: false, update: false, delete: false },
        support: { create: true, read: true, update: false, delete: false }
      },
      lastLogin: new Date()
    }
  });

  console.log('✅ Usuários criados:');
  console.log(`- Admin: ${adminUser.email}`);
  console.log(`- Gerente: ${managerUser.email}`);
  console.log(`- Usuário: ${regularUser.email}`);
  console.log('🎉 Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
