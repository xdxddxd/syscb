const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixUserRoles() {
  try {
    console.log('🔧 Iniciando correção dos roles de usuário...');
    
    // Como o UserRole é apenas para setor, vamos mapear os valores existentes
    // para os valores mais apropriados do schema atual
    const roleMapping = {
      'admin': 'ADMIN',
      'manager': 'MANAGER', 
      'user': 'USER',
      'agent': 'AGENT',
      'assistant': 'ASSISTANT'
    };
    
    // Usar uma abordagem mais direta - atualizar um por vez
    for (const [oldRole, newRole] of Object.entries(roleMapping)) {
      try {
        const result = await prisma.$executeRaw`
          UPDATE users SET role = ${newRole}::"UserRole" WHERE role = ${oldRole}
        `;
        if (result > 0) {
          console.log(`✅ Atualizados ${result} usuários: ${oldRole} → ${newRole}`);
        }
      } catch (error) {
        console.log(`⚠️  Erro ao atualizar ${oldRole} → ${newRole}:`, error.message);
      }
    }
    
    console.log('🎉 Correção concluída!');
    
    // Verificar o resultado final
    const currentRoles = await prisma.$queryRaw`
      SELECT role, COUNT(*) as count FROM users GROUP BY role ORDER BY role
    `;
    
    console.log('📋 Distribuição atual de roles:');
    currentRoles.forEach(r => console.log(`  ${r.role}: ${r.count}`));
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixUserRoles();
