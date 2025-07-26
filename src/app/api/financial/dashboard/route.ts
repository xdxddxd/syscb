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

    // Filtro por branch se o usuário não for ADMIN
    const branchFilter = userInfo.role === 'ADMIN' ? {} : { branchId: userInfo.branchId || undefined };

    // Datas para cálculos
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const startOfLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const endOfLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
    const startOfYear = new Date(currentDate.getFullYear(), 0, 1);

    // 1. Métricas do mês atual vs anterior
    const [
      revenueThisMonth,
      revenueLastMonth,
      expensesThisMonth,
      expensesLastMonth,
      commissionsThisMonth,
      commissionsLastMonth
    ] = await Promise.all([
      // Receitas
      prisma.financialRecord.aggregate({
        where: {
          ...branchFilter,
          type: 'REVENUE',
          date: { gte: startOfMonth }
        },
        _sum: { amount: true }
      }),
      prisma.financialRecord.aggregate({
        where: {
          ...branchFilter,
          type: 'REVENUE',
          date: { gte: startOfLastMonth, lte: endOfLastMonth }
        },
        _sum: { amount: true }
      }),
      // Despesas
      prisma.financialRecord.aggregate({
        where: {
          ...branchFilter,
          type: 'EXPENSE',
          date: { gte: startOfMonth }
        },
        _sum: { amount: true }
      }),
      prisma.financialRecord.aggregate({
        where: {
          ...branchFilter,
          type: 'EXPENSE',
          date: { gte: startOfLastMonth, lte: endOfLastMonth }
        },
        _sum: { amount: true }
      }),
      // Comissões
      prisma.financialRecord.aggregate({
        where: {
          ...branchFilter,
          type: 'COMMISSION',
          date: { gte: startOfMonth }
        },
        _sum: { amount: true }
      }),
      prisma.financialRecord.aggregate({
        where: {
          ...branchFilter,
          type: 'COMMISSION',
          date: { gte: startOfLastMonth, lte: endOfLastMonth }
        },
        _sum: { amount: true }
      })
    ]);

    // 2. Receitas anuais por mês (para gráfico)
    let monthlyRevenue;
    if (userInfo.role === 'ADMIN') {
      monthlyRevenue = await prisma.$queryRaw<Array<{month: number, revenue: number, expenses: number}>>`
        SELECT 
          EXTRACT(MONTH FROM date) as month,
          COALESCE(SUM(CASE WHEN type = 'REVENUE' THEN amount ELSE 0 END), 0) as revenue,
          COALESCE(SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END), 0) as expenses
        FROM financial_records 
        WHERE date >= ${startOfYear}
        GROUP BY EXTRACT(MONTH FROM date)
        ORDER BY month
      `;
    } else {
      monthlyRevenue = await prisma.$queryRaw<Array<{month: number, revenue: number, expenses: number}>>`
        SELECT 
          EXTRACT(MONTH FROM date) as month,
          COALESCE(SUM(CASE WHEN type = 'REVENUE' THEN amount ELSE 0 END), 0) as revenue,
          COALESCE(SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END), 0) as expenses
        FROM financial_records 
        WHERE date >= ${startOfYear} AND branch_id = ${userInfo.branchId}
        GROUP BY EXTRACT(MONTH FROM date)
        ORDER BY month
      `;
    }

    // 3. Distribuição por categoria
    const categoryDistribution = await prisma.financialRecord.groupBy({
      by: ['category', 'type'],
      where: {
        ...branchFilter,
        date: { gte: startOfMonth }
      },
      _sum: { amount: true }
    });

    // 4. Transações recentes
    const recentTransactions = await prisma.financialRecord.findMany({
      where: branchFilter,
      include: {
        employee: {
          select: { id: true, name: true }
        },
        branch: {
          select: { id: true, name: true }
        }
      },
      orderBy: { date: 'desc' },
      take: 10
    });

    // 5. Top categorias de despesas
    const topExpenseCategories = await prisma.financialRecord.groupBy({
      by: ['category'],
      where: {
        ...branchFilter,
        type: 'EXPENSE',
        date: { gte: startOfMonth }
      },
      _sum: { amount: true },
      orderBy: { _sum: { amount: 'desc' } },
      take: 5
    });

    // Calcular percentuais de mudança
    const calculateChange = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Number(((current - previous) / previous * 100).toFixed(1));
    };

    const currentRevenue = revenueThisMonth._sum.amount || 0;
    const previousRevenue = revenueLastMonth._sum.amount || 0;
    const currentExpenses = expensesThisMonth._sum.amount || 0;
    const previousExpenses = expensesLastMonth._sum.amount || 0;
    const currentCommissions = commissionsThisMonth._sum.amount || 0;
    const previousCommissions = commissionsLastMonth._sum.amount || 0;

    const revenueChange = calculateChange(currentRevenue, previousRevenue);
    const expenseChange = calculateChange(currentExpenses, previousExpenses);
    const commissionChange = calculateChange(currentCommissions, previousCommissions);

    // Lucro = Receitas - Despesas
    const currentProfit = currentRevenue - currentExpenses;
    const previousProfit = previousRevenue - previousExpenses;
    const profitChange = calculateChange(currentProfit, previousProfit);

    return NextResponse.json({
      metrics: {
        revenue: {
          current: currentRevenue,
          change: revenueChange,
          trend: revenueChange >= 0 ? 'up' : 'down'
        },
        expenses: {
          current: currentExpenses,
          change: expenseChange,
          trend: expenseChange <= 0 ? 'up' : 'down' // Menos despesa é melhor
        },
        commissions: {
          current: currentCommissions,
          change: commissionChange,
          trend: commissionChange >= 0 ? 'up' : 'down'
        },
        profit: {
          current: currentProfit,
          change: profitChange,
          trend: profitChange >= 0 ? 'up' : 'down'
        }
      },
      monthlyData: monthlyRevenue.map(item => ({
        month: item.month,
        revenue: Number(item.revenue),
        expenses: Number(item.expenses),
        profit: Number(item.revenue) - Number(item.expenses)
      })),
      categoryDistribution: categoryDistribution.map(item => ({
        category: item.category,
        type: item.type,
        amount: item._sum.amount || 0
      })),
      recentTransactions: recentTransactions.map(transaction => ({
        id: transaction.id,
        type: transaction.type,
        category: transaction.category,
        description: transaction.description,
        amount: transaction.amount,
        date: transaction.date.toISOString(),
        employee: transaction.employee?.name,
        branch: transaction.branch?.name
      })),
      topExpenseCategories: topExpenseCategories.map(item => ({
        category: item.category,
        amount: item._sum.amount || 0
      })),
      user: {
        name: userInfo.name,
        role: userInfo.role,
        branch: userInfo.branch?.name
      }
    });

  } catch (error) {
    console.error('Erro ao buscar dashboard financeiro:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
