# Demo Workflow API

API de demonstração em TypeScript com Express, criada para ilustrar padrões de autenticação em rotas, proteção de endpoints e auditoria de segurança em aplicações web.

O projeto foi pensado como exemplo didático para mostrar:

- rotas públicas e privadas
- middleware de autenticação via Bearer Token
- organização por módulos de rotas
- pontos de atenção em segurança de APIs
- uso de workflow de auditoria para checar autenticação em endpoints

---

## Visão geral

A aplicação expõe endpoints de usuários, pedidos, pagamentos, produtos, perfil, administração e health checks. A autenticação é validada pelo middleware `requireAuth`, localizado em `src/middleware/auth.ts`.

A estrutura foi organizada para facilitar a compreensão e a análise de segurança de uma API REST básica.

---

## Estrutura do projeto

```text
demo-workflow/
├── .claude/
│   └── workflows/
│       └── audit-auth-routes.js
├── src/
│   ├── app.ts
│   ├── middleware/
│   │   └── auth.ts
│   └── routes/
│       ├── admin.routes.ts
│       ├── health.routes.ts
│       ├── orders.routes.ts
│       ├── payments.routes.ts
│       ├── products.routes.ts
│       ├── profile.routes.ts
│       ├── users.routes.ts
│       └── webhooks.routes.ts
├── .gitignore
├── package.json
├── tsconfig.json
├── package-lock.json
└── README.md
```

---

## Tecnologias

- Node.js
- TypeScript
- Express
- ts-node-dev
- TypeScript compiler (`tsc`)

---

## Pré-requisitos

Antes de iniciar o projeto, certifique-se de ter instalado:

- Node.js 18+
- npm

---

## Instalação

No diretório do projeto, execute:

```bash
npm install
```

---

## Scripts disponíveis

O arquivo `package.json` contém os seguintes comandos:

```bash
npm run dev
```

Inicia a aplicação em modo de desenvolvimento com recarga automática.

```bash
npm run build
```

Compila a aplicação para a pasta `dist`.

```bash
npm run typecheck
```

Valida a tipagem TypeScript sem gerar build.

---

## Como executar

```bash
npm run dev
```

A aplicação ficará disponível em:

```text
http://localhost:3000
```

Você também pode definir a porta via variável de ambiente:

```bash
PORT=4000 npm run dev
```

---

## Sistema de autenticação

A autenticação é feita via header HTTP:

```http
Authorization: Bearer <token>
```

O middleware `requireAuth` valida o token em `src/middleware/auth.ts` e aceita apenas os seguintes valores de exemplo:

- `demo-token-alice`
- `demo-token-bob`
- `demo-token-admin`

Se o header estiver ausente, mal formatado ou com token inválido, a API responde com status `401`.

Exemplo de requisição autenticada:

```bash
curl -H "Authorization: Bearer demo-token-alice" http://localhost:3000/users
```

---

## Endpoints

### Rotas autenticadas

| Método | Rota | Descrição |
| --- | --- | --- |
| GET | `/users` | Lista usuários |
| GET | `/users/:id` | Busca usuário por id |
| GET | `/orders` | Lista pedidos |
| GET | `/orders/:id` | Busca pedido por id |
| POST | `/orders` | Cria pedido |
| DELETE | `/orders/:id` | Remove pedido |
| GET | `/profile` | Recupera perfil do usuário |
| PUT | `/profile` | Atualiza perfil |
| PATCH | `/profile/password` | Altera senha |
| GET | `/payments/:id` | Consulta status do pagamento |
| GET | `/admin/dashboard` | Dashboard administrativo |
| GET | `/admin/users` | Lista usuários administrativos |
| POST | `/admin/users/:id/promote` | Promove usuário |

### Rotas públicas

| Método | Rota | Descrição |
| --- | --- | --- |
| GET | `/products` | Catálogo público |
| GET | `/products/:id` | Busca produto por id |
| GET | `/health` | Health check |
| POST | `/webhooks/stripe` | Webhook público por design |
| POST | `/webhooks/github` | Webhook público por design |

### Endpoints com atenção de segurança

Algumas rotas foram deixadas sem autenticação de propósito didático, para demonstrar cenários que exigem revisão.

Exemplos:

- `DELETE /users/:id` em `src/routes/users.routes.ts`
- `POST /payments/charge` em `src/routes/payments.routes.ts`
- `POST /admin/reset-database` em `src/routes/admin.routes.ts`

Esses casos são úteis para discutir riscos e melhorias de segurança, como:

- exigir autenticação para operações sensíveis
- validar autorização por papel (RBAC)
- aplicar rate limiting
- checar assinatura HMAC em webhooks
- bloquear ações destrutivas sem controle de acesso

---

## Exemplos de uso

### Health check

```bash
curl http://localhost:3000/health
```

### Listar produtos públicos

```bash
curl http://localhost:3000/products
```

### Obter dados de usuário autenticado

```bash
curl -H "Authorization: Bearer demo-token-alice" http://localhost:3000/profile
```

### Acessar rota sem autenticação

```bash
curl http://localhost:3000/users
```

Resposta esperada:

```json
{
  "error": "Missing or malformed Authorization header"
}
```

---

## Auditoria de autenticação

O projeto inclui um workflow de auditoria em:

```text
.claude/workflows/audit-auth-routes.js
```

Esse workflow verifica se as rotas foram protegidas corretamente pelo middleware `requireAuth`, ajudando a identificar endpoints que podem ter sido esquecidos ou deixados abertos sem intenção.

---

## Observações de segurança

Este é um projeto de demonstração, então algumas decisões foram tomadas para facilitar a aprendizagem, não para produção.

Recomendações para evolução real:

- usar JWTs assinado com segredo real
- aplicar autorização por perfil e permissões
- validar entrada com schemas e validações fortes
- proteger endpoints financeiros com camada adicional de segurança
- separar webhooks e endpoints públicos com validação criptográfica
- configurar CORS, rate limit e logs estruturados
- armazenar segredos em variáveis de ambiente e não no código-fonte

---

## Melhorias sugeridas

- adicionar testes automatizados com Vitest ou Jest
- criar camada de serviço para regras de negócio
- adicionar persistência com banco de dados
- implementar autenticação mais robusta baseada em usuários reais
- incluir documentação OpenAPI/Swagger
- estruturar middlewares de autorização e validação por domínio

---

## Conclusão

Este projeto funciona como uma base sólida para estudo de autenticação em APIs Express com TypeScript. Ele combina exemplos de rotas protegidas, endpoints públicos e cenários de auditoria para facilitar a prática de revisão de segurança em aplicações backend.

Se você quiser, também posso criar uma segunda versão deste README em inglês, ou adaptar o conteúdo para um projeto maior com Docker, testes e documentação Swagger.
