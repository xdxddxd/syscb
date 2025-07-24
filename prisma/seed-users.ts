import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedUsers() {
  try {
    // Create some sample users
    const users = [
      {
        name: 'Maria Santos Silva',
        email: 'maria.santos@empresa.com',
        phone: '(11) 99999-1111',
        role: 'admin',
        employeeId: 'emp-1',
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
        }
      },
      {
        name: 'João Costa Oliveira',
        email: 'joao.costa@empresa.com',
        phone: '(11) 99999-2222',
        role: 'user',
        employeeId: 'emp-2',
        isActive: true,
        permissions: {
          dashboard: { create: false, read: true, update: false, delete: false },
          properties: { create: true, read: true, update: true, delete: false },
          clients: { create: true, read: true, update: true, delete: false },
          contracts: { create: true, read: true, update: true, delete: false }
        }
      },
      {
        name: 'Ana Oliveira Lima',
        email: 'ana.oliveira@empresa.com',
        phone: '(11) 99999-3333',
        role: 'manager',
        employeeId: 'emp-3',
        isActive: false,
        permissions: {
          dashboard: { create: false, read: true, update: false, delete: false },
          properties: { create: true, read: true, update: true, delete: true },
          clients: { create: true, read: true, update: true, delete: true },
          contracts: { create: true, read: true, update: true, delete: true },
          financial: { create: false, read: true, update: false, delete: false },
          reports: { create: false, read: true, update: false, delete: false },
          employees: { create: true, read: true, update: true, delete: false }
        }
      }
    ];

    for (const userData of users) {
      await prisma.user.upsert({
        where: { email: userData.email },
        update: {},
        create: userData as any,
      });
    }

    console.log('Seed data created successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedUsers();
