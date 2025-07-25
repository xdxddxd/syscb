const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createTestBranches() {
  console.log('Creating test branches...');

  try {
    const branch1 = await prisma.branch.create({
      data: {
        name: 'Matriz São Paulo',
        code: 'SP001',
        address: {
          street: 'Av. Paulista',
          number: '1000',
          complement: 'Sala 100',
          neighborhood: 'Bela Vista',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01310-100',
          country: 'Brasil'
        },
        contact: {
          phone: '(11) 3456-7890',
          email: 'sp@casabranca.com.br',
          website: 'www.casabranca.com.br'
        },
        isActive: true,
        settings: {
          timezone: 'America/Sao_Paulo',
          currency: 'BRL',
          language: 'pt-BR'
        }
      }
    });

    const branch2 = await prisma.branch.create({
      data: {
        name: 'Filial Rio de Janeiro',
        code: 'RJ001',
        address: {
          street: 'Av. Copacabana',
          number: '500',
          neighborhood: 'Copacabana',
          city: 'Rio de Janeiro',
          state: 'RJ',
          zipCode: '22070-011',
          country: 'Brasil'
        },
        contact: {
          phone: '(21) 2345-6789',
          email: 'rj@casabranca.com.br'
        },
        isActive: true,
        settings: {
          timezone: 'America/Sao_Paulo',
          currency: 'BRL',
          language: 'pt-BR'
        }
      }
    });

    console.log('✅ Branches created successfully!');
    console.log('Branch 1:', branch1.name);
    console.log('Branch 2:', branch2.name);

  } catch (error) {
    if (error.code === 'P2002') {
      console.log('⚠️ Branches already exist (unique constraint violation)');
    } else {
      console.error('❌ Error creating branches:', error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

createTestBranches();
