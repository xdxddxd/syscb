const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixEnums() {
  try {
    console.log('🔧 Conectando ao banco de dados...');
    
    // Usar executeRaw para executar SQL direto
    console.log('📊 Atualizando roles de usuário...');
    
    const updateResult = await prisma.$executeRaw`
      UPDATE users 
      SET role = CASE 
          WHEN role = 'admin' THEN 'ADMIN'::text
          WHEN role = 'manager' THEN 'MANAGER'::text
          WHEN role = 'user' THEN 'USER'::text
          WHEN role = 'agent' THEN 'AGENT'::text
          WHEN role = 'assistant' THEN 'ASSISTANT'::text
          ELSE role
      END
      WHERE role IN ('admin', 'manager', 'user', 'agent', 'assistant')
    `;
    
    console.log(`✅ ${updateResult} usuários atualizados`);
    
    // Verificar o resultado
    const roles = await prisma.$queryRaw`
      SELECT role, COUNT(*) as count FROM users GROUP BY role
    `;
    
    console.log('📋 Distribuição atual de roles:');
    roles.forEach(r => console.log(`  ${r.role}: ${r.count}`));
    
    console.log('🎉 Atualização concluída!');
    
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixEnums();
