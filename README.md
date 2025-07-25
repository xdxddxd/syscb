# Casa Branca Consultoria Imobiliária - Sistema de Gestão (Em Desenvolvimento)

Sistema completo de gestão imobiliária desenvolvido com Next.js, TypeScript e Prisma para a Casa Branca Consultoria Imobiliária.

## � Status do Desenvolvimento

### ✅ Funcionalidades Implementadas
- [x] **Autenticação JWT**: Sistema de login/logout com cookies seguros
- [x] **Gestão de Funcionários**: CRUD completo de funcionários
- [x] **Dashboard de Funcionários**: Métricas, estatísticas e visualização de dados
- [x] **Sistema de Escalas Avançado**: Gerenciamento completo de horários com FullCalendar
  - [x] **Visualização em Calendário**: Interface moderna com FullCalendar.js v6.1.18
  - [x] **Preview de Dia**: Visualização de todas as escalas do dia selecionado
  - [x] **Sistema de Exclusão**: Exclusão individual e em lote com confirmação inline
  - [x] **Replicação Mensal**: Criar escalas para múltiplos dias do mês
  - [x] **Status Dinâmicos**: Controle de status com cores e badges
  - [x] **Tipos de Turno**: Sistema completo de turnos (Regular, Hora Extra, Feriado, etc.)
- [x] **Navegação**: Menu lateral responsivo com todas as seções
- [x] **Internacionalização**: Estrutura preparada para múltiplos idiomas (pt-BR implementado)
- [x] **Banco de Dados**: Schema Prisma com relacionamentos complexos
- [x] **API REST**: Endpoints completos para funcionários e escalas
- [x] **Interface Responsiva**: Design mobile-first com Tailwind CSS
- [x] **Componentes UI**: Biblioteca shadcn/ui integrada com componentes customizados

### 🔄 Em Desenvolvimento
- [ ] **Gestão de Imóveis**: CRUD de propriedades e galeria de fotos
- [ ] **CRM**: Gestão de leads e pipeline de vendas
- [ ] **Contratos**: Sistema de criação e gestão de contratos
- [ ] **Dashboard Financeiro**: Relatórios e análise de comissões
- [ ] **Sistema de Notificações**: Notificações em tempo real
- [ ] **Portal do Cliente**: Área exclusiva para clientes
- [ ] **Relatórios Avançados**: Análise de mercado e performance

### � Planejadas para Futuro
- [ ] **Offline-First**: Sincronização com ElectricSQL
- [ ] **PWA**: Progressive Web App funcional
- [ ] **Multi-filial**: Gestão de múltiplas filiais
- [ ] **Sistema de Inventário**: Controle de estoque
- [ ] **Geolocalização**: Controle de ponto por localização
- [ ] **Análise de Mercado**: Comparação de preços e tendências

## 🛠️ Tecnologias e Justificativas

### Core Framework
- **Next.js 15** com App Router
  - *Por que?* Framework React mais moderno com SSR/SSG nativo, roteamento automático e otimizações built-in
- **TypeScript** 
  - *Por que?* Tipagem estática previne bugs, melhora DX e facilita manutenção em projetos grandes
- **Bun** como package manager
  - *Por que?* Até 25x mais rápido que npm, menor uso de memória e melhor cache

### Database & ORM
- **Prisma** ORM
  - *Por que?* Type-safe, migrations automáticas, excelente DX e integração perfeita com TypeScript
- **PostgreSQL**
  - *Por que?* Banco relacional robusto, suporte a JSON, excelente para aplicações empresariais

### Styling & UI
- **Tailwind CSS**
  - *Por que?* Utility-first, bundle size otimizado, design system consistente
- **shadcn/ui**
  - *Por que?* Componentes acessíveis, customizáveis e construídos com Radix UI
- **FullCalendar.js v6.1.18**
  - *Por que?* Biblioteca moderna para calendários, altamente customizável, suporte a React
- **Lucide React**
  - *Por que?* Ícones modernos, otimizados e tree-shakable
- **date-fns**
  - *Por que?* Manipulação de datas tree-shakable, melhor que Moment.js, localização pt-BR

### State Management
- **TanStack Query**
  - *Por que?* Cache inteligente, sincronização servidor, invalidação automática
- **Zustand** (planejado)
  - *Por que?* State management leve, sem boilerplate, excelente para estado global

### Authentication & Security
- **JWT com cookies httpOnly**
  - *Por que?* Mais seguro que localStorage, automático no SSR, protege contra XSS
- **jose** para JWT
  - *Por que?* Biblioteca moderna, suporte nativo a Edge Runtime do Vercel

### Development Tools
- **ESLint + Prettier**
  - *Por que?* Padronização de código, detecção precoce de bugs
- **date-fns**
  - *Por que?* Manipulação de datas tree-shakable, melhor que Moment.js, localização pt-BR
- **FullCalendar.js**
  - *Por que?* Calendário moderno, interativo, responsivo e altamente customizável

## 📋 Funcionalidades Detalhadas

### � Sistema de Funcionários (✅ Implementado)
- CRUD completo de funcionários
- Dashboard com métricas em tempo real
- Filtros por departamento e status
- Paginação eficiente
- Busca por nome, cargo ou email
- Sistema de hierarchy (supervisor/subordinado)

### 📅 Sistema de Escalas (✅ Implementado - Versão Avançada)
- **Calendário FullCalendar**: Visualização moderna e interativa
- **Interface Intuitiva**: Criação de escalas através de modal avançado
- **Preview de Dia**: Visualização de todas as escalas do dia selecionado
- **Sistema de Exclusão Inteligente**:
  - Exclusão individual com confirmação inline no próprio card
  - Exclusão em lote de todas as escalas de uma data
  - Confirmações visuais com feedback em tempo real
- **Tipos de Turno Avançados**:
  - REGULAR (Regular), OVERTIME (Hora Extra), HOLIDAY (Feriado)
  - WEEKEND (Fim de Semana), NIGHT (Noturno), FLEXIBLE (Flexível)
- **Status Dinâmicos**: SCHEDULED, CONFIRMED, CANCELLED, COMPLETED, NO_SHOW
- **Replicação Mensal**: Criar escalas para múltiplos dias com seletor visual
- **Indicadores Visuais**: Alertas para dias com alta demanda (5+ funcionários)
- **Responsivo**: Interface adaptada para desktop e mobile
- **Localização pt-BR**: Datas, horários e textos em português brasileiro

### 🔐 Autenticação & Autorização (✅ Implementado)
- Login/logout com JWT
- Cookies httpOnly para segurança
- Middleware de autenticação automática
- Context API para estado de usuário

### 🎨 Interface & UX (✅ Implementado)
- Design responsivo mobile-first
- Tema dark/light (estrutura preparada)
- Componentes acessíveis com shadcn/ui
- Loading states e feedback visual
- **Sistema de Confirmação Inline**: UX aprimorada para ações destrutivas
- **Preview em Tempo Real**: Visualização instantânea de alterações
- **Indicadores Visuais**: Badges coloridos para status e tipos
- **Animações Suaves**: Transições e hover effects
- **Calendário Interativo**: Interface moderna com FullCalendar

## 📦 Instalação e Configuração

### Pré-requisitos
- **Node.js 18+** ou **Bun 1.0+**
- **PostgreSQL 14+**
- **Git**

### 1. Clone o repositório
```bash
git clone <repository-url>
cd syscb
```

### 2. Instale as dependências
```bash
bun install
```

### 3. Configure as variáveis de ambiente
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/casa_branca_db"

# JWT
JWT_SECRET="your-super-secret-jwt-key"

# Next.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"
```

### 4. Configure o banco de dados
```bash
# Execute as migrações
bun prisma migrate dev

# (Opcional) Gere dados de exemplo
bun run prisma/seed.ts
```

### 5. Inicie o servidor de desenvolvimento
```bash
bun dev
```

O aplicativo estará disponível em `http://localhost:3000`

## 🗂️ Estrutura do Projeto

```
src/
├── app/
│   ├── [locale]/               # Rotas internacionalizadas
│   │   ├── employees/          # Páginas de funcionários
│   │   │   ├── schedule/       # Sistema de escalas com FullCalendar
│   │   │   ├── new/            # Criar funcionário
│   │   │   └── [id]/           # Detalhes/edição
│   │   └── layout.tsx          # Layout principal
│   ├── api/                    # API Routes
│   │   ├── auth/               # Autenticação
│   │   ├── employees/          # CRUD funcionários
│   │   └── schedules/          # CRUD escalas com exclusão
│   └── globals.css             # Estilos globais + FullCalendar
├── components/
│   ├── ui/                     # Componentes base (shadcn/ui)
│   ├── layout/                 # Componentes de layout
│   ├── schedule/               # Componentes específicos de escalas
│   │   ├── ScheduleCalendarSimple.tsx  # Calendário FullCalendar
│   │   └── ScheduleModal.tsx           # Modal avançado de escalas
│   └── forms/                  # Componentes de formulários
├── context/                    # React Context APIs
├── lib/                        # Configurações e utilitários
├── types/                      # Definições TypeScript
└── utils/                      # Funções auxiliares

prisma/
├── schema.prisma               # Schema do banco de dados
├── migrations/                 # Migrações SQL
└── seed.ts                     # Dados de exemplo

messages/                       # Internacionalização
├── pt.json                     # Português
├── en.json                     # Inglês
└── es.json                     # Espanhol
```

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
bun dev                    # Servidor de desenvolvimento
bun build                  # Build para produção
bun start                  # Servidor de produção
bun lint                   # ESLint

# Database
bun prisma migrate dev     # Nova migração
bun prisma migrate reset   # Reset do banco
bun prisma generate        # Gera cliente Prisma
bun prisma studio         # Interface visual

# Utilitários
bun db:seed               # Popula banco com dados exemplo
bun db:reset              # Reset completo do banco
bun calendar:test         # Testa funcionalidades do calendário
```

## 🎯 Como Usar

### 1. Primeiro Acesso
1. Acesse `http://localhost:3000`
2. Faça login com as credenciais padrão (se executou o seed)
3. Navegue pelos módulos usando o menu lateral

### 2. Gestão de Funcionários
- **Listar**: Visualize todos os funcionários com filtros
- **Criar**: Adicione novos funcionários com dados completos
- **Editar**: Atualize informações existentes
- **Escalas**: Gerencie horários de trabalho

### 3. Sistema de Escalas
- **Calendário FullCalendar**: Visualização interativa e moderna
- **Criar Escala**: Modal avançado com preview e replicação mensal
- **Visualizar Escalas do Dia**: Preview de todas as escalas ao selecionar uma data
- **Gerenciar Status**: Confirme, complete ou marque faltas com sistema visual
- **Exclusão Inteligente**: 
  - Exclua escalas individuais com confirmação inline
  - Exclua todas as escalas de uma data específica
- **Tipos de Turno**: Sistema completo com 6 tipos diferentes
- **Replicação**: Crie escalas para múltiplos dias do mês
- **Indicadores**: Alertas visuais para dias com alta demanda

## 🧪 Banco de Dados

### Schema Principal
```prisma
User          # Usuários do sistema
Employee      # Funcionários
Branch        # Filiais (preparado)
EmployeeSchedule  # Escalas de trabalho
```

### Relacionamentos
- User → Employee (1:1)
- Employee → Employee (manager/subordinate)
- Employee → EmployeeSchedule (1:N)
- Branch → Employee (1:N) - preparado

## 🔄 Roadmap de Desenvolvimento

### Próximas Sprints (Prioridade Alta)
1. **Gestão de Imóveis**: CRUD completo de propriedades
2. **Upload de Arquivos**: Sistema de galeria para imóveis
3. **CRM Básico**: Gestão de leads e clientes
4. **Escalas Automáticas**: IA para sugestão de escalas otimizadas
5. **Dashboard Financeiro**: Relatórios de comissões

### Médio Prazo
1. **Sistema de Contratos**: Criação e gestão
2. **Notificações**: Push notifications
3. **Relatórios Avançados**: Analytics e insights
4. **API Mobile**: Endpoints para app mobile

### Longo Prazo
1. **Offline-First**: ElectricSQL integration
2. **Multi-filial**: Gestão completa de filiais
3. **PWA**: Progressive Web App
4. **BI Dashboard**: Business Intelligence

## 🤝 Contribuição

### Padrões de Código
- **TypeScript**: Tipagem obrigatória para todas as funções
- **ESLint**: Siga as regras configuradas
- **Commits**: Use Conventional Commits
- **Branches**: `feature/nome-da-feature`

### Como Contribuir
1. Fork o projeto
2. Crie uma branch para sua feature
3. Implemente com testes
4. Abra um Pull Request

## 📞 Suporte

- **Email**: contato.derikdev@gmail.com
- **GitHub Issues**: Para bugs e feature requests
- **Documentação**: Veja arquivos em `/docs`

## 📄 Licença

Este projeto é proprietário de [Derik](https://github.com/xdxddxd).

---

**Desenvolvido com ❤️ por [Derik](https://github.com/xdxddxd)**

*Sistema em desenvolvimento ativo - Atualizações frequentes*
