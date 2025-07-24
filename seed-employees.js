const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createSampleEmployees() {
  try {
    console.log('Criando funcionários de exemplo...');
    
    const employees = [
      {
        name: 'Maria Santos Silva',
        email: 'maria.santos@creci.com.br',
        cpf: '123.456.789-01',
        position: 'Corretora Senior',
        department: 'Vendas',
        creci: '12345-F',
        salary: 5000.00,
        commissionRate: 0.03,
        hireDate: new Date('2022-01-15'),
        status: 'ACTIVE'
      },
      {
        name: 'João Costa Oliveira',
        email: 'joao.costa@creci.com.br',
        cpf: '234.567.890-12',
        position: 'Corretor',
        department: 'Vendas',
        creci: '67890-F',
        salary: 4000.00,
        commissionRate: 0.025,
        hireDate: new Date('2022-03-20'),
        status: 'ACTIVE'
      },
      {
        name: 'Ana Oliveira Lima',
        email: 'ana.lima@creci.com.br',
        cpf: '345.678.901-23',
        position: 'Gerente de Vendas',
        department: 'Gestão',
        creci: '11111-F',
        salary: 7000.00,
        commissionRate: 0.035,
        hireDate: new Date('2021-08-10'),
        status: 'ACTIVE'
      },
      {
        name: 'Roberto Silva Almeida',
        email: 'roberto.silva@creci.com.br',
        cpf: '456.789.012-34',
        position: 'Consultor',
        department: 'Atendimento',
        salary: 3500.00,
        hireDate: new Date('2023-01-05'),
        status: 'ACTIVE'
      },
      {
        name: 'Fernanda Ribeiro Costa',
        email: 'fernanda.ribeiro@creci.com.br',
        cpf: '567.890.123-45',
        position: 'Corretora',
        department: 'Vendas',
        creci: '33333-F',
        salary: 4500.00,
        commissionRate: 0.03,
        hireDate: new Date('2022-11-15'),
        status: 'ACTIVE'
      }
    ];
    
    for (const emp of employees) {
      const existing = await prisma.employee.findUnique({
        where: { email: emp.email }
      });
      
      if (!existing) {
        await prisma.employee.create({ data: emp });
        console.log('✅ Criado:', emp.name);
      } else {
        console.log('⚠️ Já existe:', emp.name);
      }
    }
    
    console.log('🎉 Funcionários criados com sucesso!');
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSampleEmployees();
