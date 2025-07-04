# Desafio FrontEnd - Gestão de Eventos
Cria uma aplicação de gestão e venda de eventos fazendo o gerenciamento com os CRUDs de eventos, setores, cupons e também a edição do perfil e configurações.

## Instalar dependências
```bash
npm install | yarn install | pnpm install | bun install
```

## Como executar

Frontend
```bash
npm run dev | yarn dev | pnpm dev | bun dev
```

Mock server
```bash
npm run mock | yarn mock | pnpm mock | bun mock
```

web-socket-server
```bash
npm run socket | yarn socket | pnpm socket | bun socket
```

## Estutura de pastas
```
/api (db.json rotas da API fake via JSON Server)
/src
  /app
    /(public) (rotas públicas: login, cadastro)
      /login
      /signup
      /events
    /(protected) (rotas privadas - requer autenticação)
      /dashboard
      /my-events
      /customer
      /sectors
      /coupons
      /profile
      /settings
      /checkout
    layout.tsx (providers: Zustand, Socket.io, etc.)
  /components (componentes reutilizáveis)
    /ui
  /lib
    /api (client do JSON Server)
    /socket (config do WebSocket)
    /stores (Zustand)
  /styles (globals.css)
  /types
```

## Variaveis de ambiente
Crie um arquivo .env na raiz do projeto e adicione as linhas abaixo:
```
NEXT_PUBLIC_BASE_URL=http://localhost:3000

NEXT_PUBLIC_API_BASE_URL=http://localhost:3001

NEXT_PUBLIC_SOCKET_URL=http://localhost:3002

NEXT_PUBLIC_BASE_PORT=3000

NEXT_PUBLIC_API_PORT=3001

NEXT_PUBLIC_SOCKET_PORT=3002

NEXT_PUBLIC_API_HOST=localhost

NEXT_PUBLIC_SOCKET_HOST=localhost

```

## Arquitetura

* Next.js (App Router): Roteamento integrado, SSR para SEO e performance.

* Zustand + React Query: Estado global simples + cache eficiente.

* Tailwind: UI consistente sem perder flexibilidade.

* JSON Server: API fake rápida para prototipação.

* Login/Cadastro
     - NextAuth.js com provedor credentials (simulado via JSON Server).
     - Formulários com React Hook Form + Zod.

* CRUDs (Eventos, Setores, Cupons, Lotes)
     - Páginas SSR (Server Components) para listagem.
     - Modais/interfaces de edição com Client Components.
     - Zustand para estado global (ex: useEventStore).
     - React Query para cache e sincronização com a API fake.

* Checkout (PIX)
     - Biblioteca como react-qrcode para exibir o QR Code.
     - Zustand para gerenciar o estado do carrinho.
     - vWebSocket para atualizar status do pagamento.

* WebSocket (Notificações)
     - Socket.io client no layout.tsx para escutar eventos globais.

* Configurações da Loja
     - Formulário dinâmico (salvo no JSON Server).
     - Preview em tempo real com Tailwind CSS (ex: alterar cores primárias).
 
* Perfil e Segurança
    - Página de perfil com edição de dados + modal para resetar senha.
* API Fake (JSON Server)
    - Arquivo db.json com estrutura:
    ```
        {
          "users": [
          
          ],
          "events": [

          ],
          "sectors": [

          ],
          "lots": [

          ],
          "orders": [

          ],
          "coupons": [

          ],
          "tickets": [

          ],
          "payments": [

          ],
          "settings": [

          ],
          "upload": [

          ]
        }
    ```
    - Rotas simuladas via json-server (ex: POST /api/events).

