import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
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

    // Buscar dados do dashboard
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const startOfLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const endOfLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);

    // Filtro por branch se o usuário não for ADMIN
    const branchFilter = userInfo.role === 'ADMIN' ? {} : { branchId: userInfo.branchId || undefined };

    // 1. Leads do mês atual e anterior
    const [currentMonthLeads, lastMonthLeads] = await Promise.all([
      prisma.lead.count({
        where: {
          ...branchFilter,
          createdAt: { gte: startOfMonth }
        }
      }),
      prisma.lead.count({
        where: {
          ...branchFilter,
          createdAt: { 
            gte: startOfLastMonth,
            lte: endOfLastMonth
          }
        }
      })
    ]);

    // 2. Vendas fechadas (status CLOSED)
    const [closedThisMonth, closedLastMonth] = await Promise.all([
      prisma.lead.count({
        where: {
          ...branchFilter,
          status: 'CLOSED',
          updatedAt: { gte: startOfMonth }
        }
      }),
      prisma.lead.count({
        where: {
          ...branchFilter,
          status: 'CLOSED',
          updatedAt: { 
            gte: startOfLastMonth,
            lte: endOfLastMonth
          }
        }
      })
    ]);

    // 3. Valor total das vendas fechadas
    const [salesThisMonth, salesLastMonth] = await Promise.all([
      prisma.lead.aggregate({
        where: {
          ...branchFilter,
          status: 'CLOSED',
          updatedAt: { gte: startOfMonth },
          budget: { not: null }
        },
        _sum: { budget: true }
      }),
      prisma.lead.aggregate({
        where: {
          ...branchFilter,
          status: 'CLOSED',
          updatedAt: { 
            gte: startOfLastMonth,
            lte: endOfLastMonth
          },
          budget: { not: null }
        },
        _sum: { budget: true }
      })
    ]);

    // 4. Propriedades ativas (status AVAILABLE)
    const activeProperties = await prisma.property.count({
      where: {
        ...branchFilter,
        status: 'AVAILABLE'
      }
    });

    // 5. Pipeline (leads qualificados)
    const [qualifiedLeads, pipelineValue] = await Promise.all([
      prisma.lead.count({
        where: {
          ...branchFilter,
          status: { in: ['QUALIFIED', 'PROPOSAL'] }
        }
      }),
      prisma.lead.aggregate({
        where: {
          ...branchFilter,
          status: { in: ['QUALIFIED', 'PROPOSAL'] },
          budget: { not: null }
        },
        _sum: { budget: true }
      })
    ]);

    // 6. Atividades recentes
    const recentLeads = await prisma.lead.findMany({
      where: branchFilter,
      include: {
        agent: {
          select: { id: true, name: true, email: true }
        },
        property: {
          select: { id: true, title: true, price: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    // 7. Distribuição por status
    const leadsByStatus = await prisma.lead.groupBy({
      by: ['status'],
      where: branchFilter,
      _count: { status: true }
    });

    // 8. Top performers (agentes com mais vendas)
    const topAgents = await prisma.lead.groupBy({
      by: ['agentId'],
      where: {
        ...branchFilter,
        status: 'CLOSED',
        agentId: { not: "" },
        updatedAt: { gte: startOfMonth }
      },
      _count: { agentId: true },
      orderBy: { _count: { agentId: 'desc' } },
      take: 5
    });

    // Buscar nomes dos agentes
    const agentIds = topAgents.map(agent => agent.agentId).filter(id => id !== null);
    const agents = await prisma.user.findMany({
      where: { id: { in: agentIds as string[] } },
      select: { id: true, name: true }
    });

    // Calcular percentuais de mudança
    const calculateChange = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Number(((current - previous) / previous * 100).toFixed(1));
    };

    const leadsChange = calculateChange(currentMonthLeads, lastMonthLeads);
    const salesChange = calculateChange(closedThisMonth, closedLastMonth);
    const revenueChange = calculateChange(
      salesThisMonth._sum.budget || 0,
      salesLastMonth._sum.budget || 0
    );

    return NextResponse.json({
      metrics: {
        leads: {
          current: currentMonthLeads,
          change: leadsChange,
          trend: leadsChange >= 0 ? 'up' : 'down'
        },
        sales: {
          current: closedThisMonth,
          change: salesChange,
          trend: salesChange >= 0 ? 'up' : 'down'
        },
        revenue: {
          current: salesThisMonth._sum.budget || 0,
          change: revenueChange,
          trend: revenueChange >= 0 ? 'up' : 'down'
        },
        properties: {
          current: activeProperties,
          change: 0, // Pode ser calculado se houver histórico
          trend: 'neutral'
        },
        pipeline: {
          leads: qualifiedLeads,
          value: pipelineValue._sum.budget || 0
        }
      },
      recentActivities: recentLeads.map(lead => ({
        id: lead.id,
        type: 'lead',
        title: `${lead.status === 'CLOSED' ? 'Venda fechada' : 'Novo lead'}: ${lead.name}`,
        description: `${lead.interest}${lead.budget ? ` - R$ ${lead.budget.toLocaleString('pt-BR')}` : ''}`,
        time: lead.createdAt.toISOString(),
        agent: lead.agent?.name,
        property: lead.property?.title
      })),
      statusDistribution: leadsByStatus.map(item => ({
        status: item.status,
        count: item._count.status
      })),
      topPerformers: topAgents.map(agent => {
        const agentInfo = agents.find(a => a.id === agent.agentId);
        return {
          agentId: agent.agentId,
          name: agentInfo?.name || 'Agente não encontrado',
          sales: agent._count.agentId
        };
      }),
      user: {
        name: userInfo.name,
        role: userInfo.role,
        branch: userInfo.branch?.name
      }
    });

  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
