# ESCORTinRoad — Front-End Web

Aplicação web da ESCORTinRoad (transporte rodoviário, armazenagem e rastreamento),
construída com React, TypeScript, Vite e Tailwind CSS.

## Requisitos

- Node.js 20+
- npm 10+

## Como rodar

```bash
npm install     # instala as dependências
npm run dev     # sobe o servidor de desenvolvimento
```

## Scripts

| Comando             | Descrição                                  |
| ------------------- | ------------------------------------------ |
| `npm run dev`       | Servidor de desenvolvimento com hot reload |
| `npm run build`     | Checagem de tipos + build de produção      |
| `npm run preview`   | Servir localmente o build de produção      |
| `npm run typecheck` | Apenas a checagem de tipos                 |

## Estrutura

```
src/
  app/
    auth/         contexto de autenticação e rotas protegidas
    components/   componentes compartilhados (ui/, media/)
    data/         dados estáticos (catálogo de serviços)
    hooks/        hooks reutilizáveis
    lib/          utilitários
    pages/        páginas da aplicação
    routes.tsx    definição das rotas
  styles/         fontes, base do Tailwind e tokens de tema
```
