# Sistema CB - Acesso Real

## Como Acessar o Sistema

O sistema agora utiliza **autenticação real** baseada nos usuários cadastrados no banco de dados.

### Usuários de Teste Disponíveis

Após executar o seed do banco de dados, os seguintes usuários estão disponíveis:

#### 1. Administrador
- **Email:** `admin@sistema.com`
- **Role:** ADMIN
- **Permissões:** Acesso completo a todas as funcionalidades

#### 2. Gerente de Vendas
- **Email:** `gerente@sistema.com`
- **Role:** MANAGER
- **Permissões:** Acesso a vendas, propriedades e clientes

#### 3. Usuário Padrão
- **Email:** `usuario@sistema.com`
- **Role:** USER
- **Permissões:** Acesso limitado de leitura

### Como Fazer Login

1. Acesse a página inicial: `http://localhost:3000/pt-BR/`
2. Clique em "Fazer Login"
3. Digite um dos emails acima
4. Clique em "Entrar"

### Funcionalidades Removidas

- ❌ **Botão "Entrar como Demo"** - Removido completamente
- ❌ **Usuário fictício** - Não existe mais

### Funcionalidades Adicionadas

- ✅ **Login real** via email
- ✅ **Autenticação JWT** com cookies httpOnly
- ✅ **Persistência de sessão**
- ✅ **Dados reais** do banco de dados
- ✅ **Permissões granulares** via user.permissions

### Estrutura de Permissões

As permissões são armazenadas no campo `permissions` do usuário como JSON:

```json
{
  "dashboard": { "create": true, "read": true, "update": true, "delete": true },
  "properties": { "create": true, "read": true, "update": true, "delete": true },
  "clients": { "create": true, "read": true, "update": true, "delete": true },
  "contracts": { "create": true, "read": true, "update": true, "delete": true },
  "financial": { "create": true, "read": true, "update": true, "delete": true },
  "reports": { "create": true, "read": true, "update": true, "delete": true },
  "employees": { "create": true, "read": true, "update": true, "delete": true },
  "marketing": { "create": true, "read": true, "update": true, "delete": true },
  "users": { "create": true, "read": true, "update": true, "delete": true },
  "settings": { "create": true, "read": true, "update": true, "delete": true },
  "support": { "create": true, "read": true, "update": true, "delete": true }
}
```

### Próximos Passos

1. **Testar o login** com os usuários disponíveis
2. **Verificar as métricas corrigidas** no Kanban
3. **Criar novos usuários** conforme necessário
4. **Configurar permissões** específicas por função
