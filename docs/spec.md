# Spec App de Onboarding de RH

## Contexto
App de onboarding de RH: entrada de novo operador, geração de e-mail corporativo, validação de documentos, aprovação do gestor e inserção no HC ativo geral. Trabalho final da disciplina Dev Web com IA (SDD — Spec-Driven Development).

## Prompt inicial (behavior)
> Construir um sistema de onboarding de RH que cadastra novos operadores, gerencia envio e validação de documentos via link de acesso único (sem exigir login do candidato), gera e-mail corporativo automaticamente após aprovação dos documentos, vincula o operador a uma equipe e a um centro de custo da diretoria, encaminha para aprovação do gestor com agendamento de call de 1º dia, e mantém o registro de headcount ativo, incluindo o fluxo de desligamento. O sistema deve ter dois perfis autenticados (RH e Gestor).

## Formato de spec e justificativa
Optamos por um formato de spec estruturado próprio (equivalente a OpenSpec), cobrindo: contexto, prompt inicial, stack, papéis, entidades, casos de uso com pré/pós-condições, critérios de aceite em Given/When/Then e plano de tarefas. A escolha se deu por ser leve o suficiente para a dupla manter atualizado durante o desenvolvimento assistido por IA, sem a sobrecarga de configurar uma ferramenta externa dentro do prazo disponível, mantendo, ainda assim, todos os elementos exigidos (requisitos, critérios de aceite, plano de tarefas).

## Stack
- **Frontend/Backend:** Next.js (React)
- **Banco de dados:** Postgres via Supabase
- **Autenticação:** Supabase Auth (hash de senha via bcrypt, gerenciado automaticamente onde a senha nunca fica em texto puro)
- **Storage de arquivos:** Supabase Storage (documentos enviados pelo novato)
- **Deploy:** Vercel (URL pública)

## Papéis
- **RH**: cadastra operadores, valida documentos, vincula equipe/centro de custo
- **Gestor**: aprova operador, agenda call de 1º dia, autoriza desligamento
- **Novato**: sem login; acessa via link/token único enviado por e-mail pessoal, só para upload de documentos

## Entidades

### Usuario
| Campo | Tipo | Descrição |
|---|---|---|
| id | uuid | chave primária |
| nome | text | |
| email | text | |
| senha_hash | text | sem senha crua, usando Supabase Auth para cuidar disso |
| papel | enum | "rh" \| "gestor" |

### Operador
| Campo | Tipo | Descrição |
|---|---|---|
| id | uuid | chave primária |
| nome_completo | text | |
| email_pessoal | text | e-mail usado na inscrição da vaga; identificador até existir o corporativo |
| email_corporativo | text (nullable) | preenchido só após validação de todos os documentos |
| status | enum | pendente_documentacao → em_validacao → aprovado → ativo → desligado |
| token_upload | text | token único do link de upload |
| token_expira_em | timestamp | validade do token (ex: 72h) |
| equipe_id | uuid (nullable) | FK Equipe |
| centro_custo_id | uuid (nullable) | FK CentroCusto |
| gestor_id | uuid (nullable) | FK Usuario (papel=gestor) |
| data_cadastro | timestamp | |
| data_desligamento | timestamp (nullable) | |

### Equipe
| Campo | Tipo | Descrição |
|---|---|---|
| id | uuid | chave primária |
| nome | text | |
| gestor_id | uuid | FK Usuario (papel=gestor) |

### CentroCusto
| Campo | Tipo | Descrição |
|---|---|---|
| id | uuid | chave primária |
| nome | text | |
| diretoria | text | |

### Arquivo
| Campo | Tipo | Descrição |
|---|---|---|
| id | uuid | chave primária |
| operador_id | uuid | FK Operador |
| tipo_documento | text | ex: RG, CPF, comprovante_residencia |
| url_arquivo | text | caminho no Supabase Storage |
| status | enum | pendente \| aprovado \| reprovado |
| validado_por | uuid (nullable) | FK Usuario (papel=rh) |
| data_upload | timestamp | |

## Casos de uso (as 10 ações funcionais)

1. **Cadastrar operador** — Ator: RH — Pré: nenhuma — Pós: cria Operador com status `pendente_documentacao` + gera `token_upload`
2. **Upload de documento** — Ator: Novato (via token) — Pré: token válido e não expirado — Pós: cria Arquivo com status `pendente`
3. **Validar documento** — Ator: RH — Pré: arquivo existe — Pós: muda Arquivo.status para `aprovado`/`reprovado`
4. **Gerar e-mail corporativo** — Ator: Sistema — Pré: todos os arquivos do operador `aprovado` — Pós: preenche `email_corporativo`, muda Operador.status para `aprovado`
5. **Vincular à equipe** — Ator: RH — Pré: operador `aprovado` — Pós: preenche `equipe_id`
6. **Vincular centro de custo** — Ator: RH — Pré: operador `aprovado` — Pós: preenche `centro_custo_id`
7. **Encaminhar pro gestor** — Ator: Sistema/RH — Pré: equipe e centro de custo preenchidos — Pós: notifica `gestor_id` da equipe
8. **Aprovar e agendar call** — Ator: Gestor — Pré: recebeu encaminhamento — Pós: registra data/hora da call, muda status para `ativo`
9. **Inserir no HC ativo** — Ator: Sistema — Pré: status `ativo` — Pós: operador passa a contar no total de HC ativo (view/query, não precisa tabela nova)
10. **Remover por desligamento** — Ator: RH/Gestor — Pré: operador `ativo` — Pós: muda status para `desligado`, preenche `data_desligamento`

## Regras de negócio
- `email_corporativo` só é gerado quando TODOS os documentos do operador estão `aprovado`
- `token_upload` expira em 72h — depois disso, RH precisa gerar novo token
- Senha nunca fica em texto puro — hash via Supabase Auth
- `HC ativo geral` = contagem de operadores com status `ativo` (view/query, não tabela própria)

## Critérios de aceite (Given/When/Then)

**Cadastro de operador**
- Given RH autenticado no sistema
- When RH cadastra um operador com nome e e-mail pessoal válidos
- Then o sistema cria o registro com status `pendente_documentacao` e gera um `token_upload` com validade de 72h

**Upload de documento — caso de borda (token expirado)**
- Given um `token_upload` gerado há mais de 72h
- When o novato tenta acessar o link de upload
- Then o sistema rejeita o acesso, exibe mensagem de link expirado e não permite envio de arquivo

**Geração automática de e-mail corporativo**
- Given todos os arquivos do operador com status `aprovado`
- When o RH conclui a validação do último documento pendente
- Then o sistema gera automaticamente o `email_corporativo` e muda o status do operador para `aprovado`

## Plano de tarefas
1. Setup do projeto (Next.js + Supabase + Vercel)
2. Modelagem do banco (Usuario, Operador, Equipe, CentroCusto, Arquivo)
3. Autenticação RH/Gestor (Supabase Auth)
4. CRUD de Operador + geração de token de upload
5. Rota pública de upload de documento via token
6. Validação de documento pelo RH
7. Geração automática de e-mail corporativo
8. Vínculo à equipe e ao centro de custo
9. Fluxo de aprovação do Gestor + agendamento de call de 1º dia
10. View de HC ativo + fluxo de desligamento
11. Testes automatizados dos principais fluxos
12. ADR + diagrama de arquitetura (Mermaid)
13. Deploy no Vercel + documentação final (tools doc + LinkedIn STAR)

## Entregáveis do trabalho
- Código-fonte (Next.js + Supabase) versionado no GitHub
- Este `spec.md` versionado junto
- Post no LinkedIn com: problema → solução → tecnologias (SDD, Next.js, Supabase) → resultado (requisito de nota)