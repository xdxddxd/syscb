# Casa Branca Consultoria Imobiliária - Sistema de Gestão

Sistema completo de gestão imobiliária offline-first e mobile-first para a Casa Branca Consultoria Imobiliária.

## 🚀 Funcionalidades

### Core Features
- **Offline-First**: Funciona completamente offline com sincronização automática
- **Mobile-First**: Design 100% responsivo otimizado para dispositivos móveis
- **Multi-idioma**: Suporte completo para pt-BR, Espanhol e Inglês
- **Multi-filial**: Gestão de múltiplas filiais com controle centralizado

### Módulos Principais

#### 🏠 Gestão de Imóveis
- Cadastro completo de propriedades
- Galeria de fotos e documentos
- Status de disponibilidade em tempo real
- Análise de mercado integrada

#### 👥 CRM Integrado
- Gestão completa de leads
- Pipeline de vendas
- Histórico de comunicações
- Automação de follow-up

#### 📄 Gestão de Contratos
- Criação e edição de contratos
- Assinatura eletrônica integrada
- Rastreamento de status
- Arquivo digital seguro

#### 📦 Controle de Inventário
- Gestão multi-filial
- Transferências rastreáveis 100%
- Controle de estoque em tempo real
- Relatórios detalhados

#### 💰 Dashboard Financeiro
- Cálculo automático de comissões
- Relatórios de receita e despesas
- Análise de performance
- Integração com contratos

#### 👨‍💼 Sistema de Funcionários
- Controle de pontos com localização obrigatória
- Verificação por selfie
- Gestão de permissões granular
- Sistema de pontuação

#### 🔔 Notificações em Tempo Real
- Notificações push
- Alertas personalizados
- Centro de notificações
- Integração com todos os módulos

#### 🏘️ Portal do Cliente
- Acesso seguro para clientes
- Acompanhamento de processos
- Comunicação direta
- Histórico completo

#### 📊 Análise de Mercado
- Comparação de preços
- Tendências do mercado
- Avaliação automatizada
- Análise da concorrência

## 🛠️ Tecnologias

### Frontend
- **Next.js 15+** com App Router
- **TypeScript** para tipagem estática
- **Tailwind CSS** para styling
- **Bun** como gerenciador de pacotes

### Backend & Database
- **Prisma** ORM para modelagem de dados
- **ElectricSQL** para sincronização offline
- **TanStack Query** para gerenciamento de estado servidor
- **PostgreSQL** como banco principal

### Storage & Files
- **AWS S3 SDK** para armazenamento
- **MinIO** para storage local/self-hosted
- Suporte a upload progressivo

### Offline & Sync
- **TanStack DB** para cache local
- **ElectricSQL** para sincronização em tempo real
- Service Workers para cache de recursos
- Estratégias de conflict resolution

### State Management
- **Zustand** para estado global
- **TanStack Query** para estado servidor
- Persistência automática offline

### UI/UX
- **Heroicons** para ícones
- **Headless UI** para componentes acessíveis
- Design system consistente
- Suporte completo a PWA

## 📋 Pré-requisitos

- Node.js 18+ ou Bun 1.0+
- PostgreSQL 14+
- MinIO ou AWS S3
- Docker (opcional)

## 🚀 Instalação

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
# Edite o arquivo .env com suas configurações
```

### 4. Configure o banco de dados
```bash
# Inicie o PostgreSQL e crie o banco
createdb casa_branca_db

# Execute as migrações
bun prisma migrate dev
```

### 5. Configure o MinIO (opcional)
```bash
# Se usando Docker
docker run -p 9000:9000 -p 9001:9001 minio/minio server /data --console-address ":9001"
```

### 6. Inicie o servidor de desenvolvimento
```bash
bun dev
```

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
bun dev              # Inicia servidor de desenvolvimento
bun build            # Build para produção
bun start            # Inicia servidor de produção
bun lint             # Executa ESLint
bun type-check       # Verifica tipos TypeScript

# Database
bun prisma generate  # Gera cliente Prisma
bun prisma migrate   # Executa migrações
bun prisma studio    # Interface visual do banco

# ElectricSQL
bun electric start   # Inicia servidor Electric
bun electric migrate # Aplica migrações Electric
```

## 📱 PWA & Offline

O sistema funciona como uma Progressive Web App (PWA) completa:

- **Instalável**: Pode ser instalado como app nativo
- **Offline-first**: Funciona sem conexão
- **Sincronização**: Sync automática quando online
- **Push notifications**: Notificações mesmo quando fechado

## 🌐 Internacionalização

Suporte completo a múltiplos idiomas:

- **pt-BR**: Português (Brasil) - Idioma padrão
- **es**: Espanhol
- **en**: Inglês

Toda a interface utiliza o sistema de traduções. Não há texto hard-coded.

## 🔐 Permissões & Segurança

Sistema granular de permissões por usuário:

- **CRUD**: Create, Read, Update, Delete por recurso
- **Baseado em checkbox**: Interface amigável para administradores
- **Caching offline**: Permissões funcionam offline
- **Auditoria**: Log completo de ações

## 🏢 Multi-filial

Gestão completa de múltiplas filiais:

- **Inventário independente**: Cada filial tem seu estoque
- **Transferências rastreáveis**: Histórico completo
- **Relatórios consolidados**: Visão geral e por filial
- **Permissões por filial**: Acesso controlado

## 📊 Dashboard & Relatórios

Interface rica em dados:

- **Métricas em tempo real**: Vendas, leads, comissões
- **Gráficos interativos**: Análise visual de dados
- **Relatórios customizáveis**: Filtros avançados
- **Export**: PDF, Excel, CSV

## 🔄 Sincronização & Backup

Sistema robusto de sincronização:

- **Conflict resolution**: Resolução automática de conflitos
- **Partial sync**: Sincronização incremental
- **Backup automático**: Cópias de segurança regulares
- **Recovery**: Recuperação de dados

## 🧪 Testes

```bash
bun test           # Executa todos os testes
bun test:unit      # Testes unitários
bun test:e2e       # Testes end-to-end
bun test:coverage  # Relatório de cobertura
```

## 📈 Performance

Otimizações implementadas:

- **Code splitting**: Carregamento sob demanda
- **Image optimization**: Otimização automática de imagens
- **Caching**: Cache inteligente de recursos
- **Lazy loading**: Carregamento progressivo

## 🛠️ Desenvolvimento

### Estrutura de Pastas
```
src/
├── app/                 # Next.js App Router
├── components/          # Componentes reutilizáveis
├── lib/                 # Configurações e utilitários
├── hooks/              # Custom React hooks
├── stores/             # Gerenciamento de estado
├── types/              # Definições TypeScript
├── i18n/               # Internacionalização
├── db/                 # Esquemas e migrações
└── utils/              # Funções auxiliares
```

### Padrões de Código

- **TypeScript**: Tipagem estrita obrigatória
- **ESLint + Prettier**: Formatação automática
- **Conventional Commits**: Padrão de commits
- **Testing**: Cobertura mínima de 80%

## 📞 Suporte

Para suporte técnico ou dúvidas sobre o sistema:

- **Email**: contato.derikdev@gmail.com
- **Documentação**: Veja a pasta `/docs`
- **Issues**: Use o GitHub Issues

## 📄 Licença

Este projeto é proprietário de https://github.com/xdxddxd.

---

Desenvolvido com ❤️ para Casa Branca Consultoria Imobiliária
