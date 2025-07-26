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

    // Apenas ADMINs podem executar a sincronização completa
    if (userInfo.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    // Verificar se o usuário tem branch, se não tiver, usar a primeira branch disponível
    let branchId = userInfo.branchId;
    
    if (!branchId) {
      const branch = await prisma.branch.findFirst();
      if (!branch) {
        return NextResponse.json({ error: 'Nenhuma filial encontrada no sistema' }, { status: 400 });
      }
      branchId = branch.id;
    }

    // Buscar todos os contratos finalizados que não possuem registros financeiros
    const existingFinancialContracts = await prisma.financialRecord.findMany({
      where: { contractId: { not: null } },
      select: { contractId: true }
    });
    
    const excludedContractIds = existingFinancialContracts
      .map(r => r.contractId)
      .filter((id): id is string => id !== null);

    const contracts = await prisma.contract.findMany({
      where: {
        status: 'COMPLETED',
        id: {
          notIn: excludedContractIds
        }
      },
      include: {
        property: true,
        agent: true,
        branch: true,
        client: true
      }
    });

    const syncResults = [];

    for (const contract of contracts) {
      try {
        // Calcular valores corretos
        const totalCommission = contract.value * contract.commissionRate; // 6% do valor da venda
        const agentCommission = contract.commissionValue; // Comissão do agente (já calculada no contrato)
        
        // 1. Criar registro de receita (apenas a comissão total que a imobiliária recebe)
        const revenueRecord = await prisma.financialRecord.create({
          data: {
            type: 'REVENUE',
            category: contract.type === 'SALE' ? 'Comissão de Venda' : 'Comissão de Locação',
            description: `Comissão ${contract.commissionRate * 100}% - ${contract.property.title} - Cliente: ${contract.client.name}`,
            amount: totalCommission,
            date: contract.signedAt || contract.createdAt,
            contractId: contract.id,
            employeeId: contract.agentId,
            branchId: contract.branchId
          }
        });

        // 2. Criar registro de comissão paga ao agente (despesa para a imobiliária)
        const commissionRecord = await prisma.financialRecord.create({
          data: {
            type: 'COMMISSION',
            category: 'Comissão de Corretor',
            description: `Comissão paga - ${contract.property.title} - Corretor: ${contract.agent.name}`,
            amount: agentCommission,
            date: contract.signedAt || contract.createdAt,
            contractId: contract.id,
            employeeId: contract.agentId,
            branchId: contract.branchId
          }
        });

        syncResults.push({
          contractId: contract.id,
          success: true,
          totalSaleValue: contract.value,
          totalCommission: totalCommission,
          agentCommission: agentCommission,
          imobiliaryProfit: totalCommission - agentCommission,
          property: contract.property.title
        });

      } catch (error) {
        console.error(`Erro ao sincronizar contrato ${contract.id}:`, error);
        syncResults.push({
          contractId: contract.id,
          success: false,
          error: error instanceof Error ? error.message : 'Erro desconhecido',
          property: contract.property.title
        });
      }
    }

    return NextResponse.json({
      message: 'Sincronização concluída',
      totalContracts: contracts.length,
      results: syncResults,
      successful: syncResults.filter(r => r.success).length,
      failed: syncResults.filter(r => !r.success).length
    });

  } catch (error) {
    console.error('Erro na sincronização financeira:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
