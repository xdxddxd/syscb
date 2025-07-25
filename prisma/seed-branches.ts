import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedBranches() {
  console.log('Seeding branches...');

  const branches = [
    {
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
    },
    {
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
    },
    {
      name: 'Filial Belo Horizonte',
      code: 'BH001',
      address: {
        street: 'Av. Afonso Pena',
        number: '800',
        neighborhood: 'Centro',
        city: 'Belo Horizonte',
        state: 'MG',
        zipCode: '30130-009',
        country: 'Brasil'
      },
      contact: {
        phone: '(31) 3456-7890',
        email: 'bh@casabranca.com.br'
      },
      isActive: true,
      settings: {
        timezone: 'America/Sao_Paulo',
        currency: 'BRL',
        language: 'pt-BR'
      }
    }
  ];

  for (const branchData of branches) {
    try {
      const existingBranch = await prisma.branch.findUnique({
        where: { code: branchData.code }
      });

      if (!existingBranch) {
        await prisma.branch.create({
          data: branchData
        });
        console.log(`✅ Branch ${branchData.name} created`);
      } else {
        console.log(`⚠️ Branch ${branchData.name} already exists`);
      }
    } catch (error) {
      console.error(`❌ Error creating branch ${branchData.name}:`, error);
    }
  }

  console.log('✅ Branches seeding completed');
}

export { seedBranches };

// Run if called directly
if (require.main === module) {
  seedBranches()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
