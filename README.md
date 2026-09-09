# Sistema de Onboarding de RH

Sistema web de onboarding de RH construído com **Spec-Driven Development (SDD)** e IA — da especificação ao deploy em produção. Trabalho final da disciplina *Desenvolvimento de Software com IA* (PPgTI/UFRN).

🔗 **Aplicação em produção:** [rh-onboarding-sdd-beryl.vercel.app](https://rh-onboarding-sdd-beryl.vercel.app)

## O que o sistema faz

Cobre o ciclo completo de entrada de um novo operador — do cadastro pelo RH até a ativação, com aprovação do Gestor:

1. Cadastro de operador (RH)
2. Upload de documento via link com token único (candidato, sem login)
3. Validação de documento (RH)
4. Geração automática de e-mail corporativo
5. Vínculo à equipe
6. Vínculo ao centro de custo
7. Encaminhamento automático ao gestor da equipe
8. Aprovação e agendamento da call de 1º dia (Gestor)
9. Contagem de HC ativo geral
10. Desligamento

## Stack

- **Next.js** (App Router) — front-end e back-end
- **Supabase** — Postgres, Auth e Storage
- **Vercel** — deploy
- **Vitest** — testes automatizados
- **Husky** — guardrail de pre-commit (roda o build antes de aceitar commits)

## Papéis

- **RH** — cadastra operadores, valida documentos, gerencia equipes e centros de custo
- **Gestor** — aprova operadores da própria equipe, agenda calls, acompanha HC ativo e desligamentos
- **Candidato** — acessa só via link com token, sem conta no sistema

## Documentação do processo (SDD)

- [`docs/spec.md`](docs/spec.md) — especificação completa: prompt inicial, entidades, casos de uso, critérios de aceite (Given/When/Then) e plano de tarefas
- [`docs/arquitetura.md`](docs/arquitetura.md) — diagrama de arquitetura e fluxo de upload (Mermaid)
- [`docs/adr/001-upload-anonimo-via-api-route.md`](docs/adr/001-upload-anonimo-via-api-route.md) — decisão de arquitetura sobre upload sem login
- [`docs/ferramentas-ia.md`](docs/ferramentas-ia.md) — modelos, estratégias e ferramentas de IA utilizadas
- [`docs/evidencias/`](docs/evidencias/) — evidência do guardrail bloqueando um commit com erro

## Rodando localmente

```bash
git clone https://github.com/fabriciogmaraes/rh-onboarding-sdd.git
cd rh-onboarding-sdd
npm install --legacy-peer-deps
```

Cria um `.env.local` na raiz com:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=
```
(valores disponíveis no painel do projeto Supabase, em Project Settings → API)

```bash
npm run dev
```

Acesse `http://localhost:3000`.

## Testes

```bash
npm test
```

Cobre as regras de negócio principais em `lib/regras-negocio.ts`, incluindo o caso de borda do token de upload expirado.

## Equipe

- Fabrício Guimarães Alcântara da Silva — Matrícula 20261009707
- Rafael Pereira de Alexandria Soares — Matrícula 20261006204

Disciplina: Desenvolvimento de Software com IA — PPgTI/UFRN — Prof. Jean Mário Moreira de Lima
