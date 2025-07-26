import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/auth';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const userInfo = await prisma.user.findUnique({
      where: { id: user.userId },
      include: { branch: true }
    });

    if (!userInfo) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    // Apenas ADMINs podem criar dados de exemplo
    if (userInfo.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    // Verificar se o usuário tem branch, se não tiver, criar uma branch padrão
    let branchId = userInfo.branchId;
    
    if (!branchId) {
      // Buscar uma branch existente ou criar uma nova
      let branch = await prisma.branch.findFirst();
      
      if (!branch) {
        branch = await prisma.branch.create({
          data: {
            name: 'Filial Principal',
            code: 'MAIN',
            address: {
              street: 'Rua Principal',
              number: '100',
              city: 'São Paulo',
              state: 'SP',
              zipCode: '01234-567',
              country: 'Brasil'
            },
            contact: {
              phone: '(11) 3333-4444',
              email: 'contato@imobiliaria.com'
            }
          }
        });
      }
      
      // Associar o usuário à branch
      await prisma.user.update({
        where: { id: userInfo.id },
        data: { branchId: branch.id }
      });
      
      branchId = branch.id;
    }

    // Buscar um cliente e propriedade existentes (ou criar se não existir)
    let client = await prisma.client.findFirst();
    if (!client) {
      client = await prisma.client.create({
        data: {
          name: 'João Silva',
          email: 'joao@example.com',
          phone: '(11) 99999-9999',
          document: '123.456.789-00',
          street: 'Rua dos Clientes',
          number: '456',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01234-567'
        }
      });
    }

    let property = await prisma.property.findFirst();
    if (!property) {
      property = await prisma.property.create({
        data: {
          title: 'Casa Confortável - Jardim Europa',
          description: 'Casa de alto padrão com 4 suítes, piscina e churrasqueira',
          type: 'HOUSE',
          status: 'AVAILABLE',
          price: 400000, // R$ 400.000
          street: 'Rua das Flores',
          number: '123',
          neighborhood: 'Jardim Europa',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01234-567',
          country: 'Brasil',
          area: 500,
          bedrooms: 4,
          bathrooms: 5,
          parkingSpaces: 2,
          features: ['piscina', 'churrasqueira', 'jardim'],
          photos: [],
          documents: [],
          agentId: userInfo.id,
          branchId: userInfo.branchId!
        }
      });
    }

    // Criar contrato de venda
    const contractValue = 400000; // R$ 400.000 (valor realista)
    const commissionRate = 0.06; // 6% de comissão da imobiliária
    const agentCommissionRate = 0.40; // 40% da comissão para o agente
    const totalCommission = contractValue * commissionRate; // R$ 24.000
    const agentCommission = totalCommission * agentCommissionRate; // R$ 9.600

    const contract = await prisma.contract.create({
      data: {
        type: 'SALE',
        status: 'COMPLETED',
        propertyId: property.id,
        clientId: client.id,
        agentId: userInfo.id,
        value: contractValue,
        commissionRate: commissionRate,
        commissionValue: agentCommission,
        startDate: new Date(),
        signedAt: new Date(),
        branchId: userInfo.branchId!
      },
      include: {
        property: true,
        client: true,
        agent: true,
        branch: true
      }
    });

    return NextResponse.json({
      message: 'Contrato de exemplo criado com sucesso',
      contract: {
        id: contract.id,
        type: contract.type,
        status: contract.status,
        saleValue: contract.value,
        commissionRate: contract.commissionRate,
        totalCommission: totalCommission,
        agentCommission: contract.commissionValue,
        imobiliaryProfit: totalCommission - contract.commissionValue,
        property: contract.property.title,
        client: contract.client.name,
        agent: contract.agent.name,
        branch: contract.branch.name
      },
      explanation: {
        saleValue: `R$ ${contractValue.toLocaleString('pt-BR')}`,
        commissionReceived: `R$ ${totalCommission.toLocaleString('pt-BR')} (${commissionRate * 100}% da venda)`,
        agentCommissionPaid: `R$ ${agentCommission.toLocaleString('pt-BR')} (${agentCommissionRate * 100}% da comissão)`,
        imobiliaryProfit: `R$ ${(totalCommission - agentCommission).toLocaleString('pt-BR')} (${(1 - agentCommissionRate) * 100}% da comissão)`
      }
    });

  } catch (error) {
    console.error('Erro ao criar contrato de exemplo:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
