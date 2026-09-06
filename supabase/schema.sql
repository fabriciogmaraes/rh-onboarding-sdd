-- Usuários do sistema (RH e Gestor) — vinculado à autenticação do Supabase
create table usuarios (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text not null,
  email text not null,
  papel text not null check (papel in ('rh', 'gestor')),
  criado_em timestamp with time zone default now()
);

-- Equipes
create table equipes (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  gestor_id uuid references usuarios(id)
);

-- Centros de custo da diretoria
create table centros_custo (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  diretoria text
);

-- Operadores (candidatos / novos funcionários)
create table operadores (
  id uuid primary key default gen_random_uuid(),
  nome_completo text not null,
  email_pessoal text not null,
  email_corporativo text,
  status text not null default 'pendente_documentacao'
    check (status in ('pendente_documentacao','em_validacao','aprovado','ativo','desligado')),
  token_upload uuid default gen_random_uuid(),
  token_expira_em timestamp with time zone,
  equipe_id uuid references equipes(id),
  centro_custo_id uuid references centros_custo(id),
  gestor_id uuid references usuarios(id),
  data_cadastro timestamp with time zone default now(),
  data_desligamento timestamp with time zone
);

-- Documentos enviados pelo operador
create table arquivos (
  id uuid primary key default gen_random_uuid(),
  operador_id uuid references operadores(id) on delete cascade,
  tipo_documento text not null,
  url_arquivo text,
  status text not null default 'pendente' check (status in ('pendente','aprovado','reprovado')),
  validado_por uuid references usuarios(id),
  data_upload timestamp with time zone default now()
);




-- Helper: verifica o papel do usuário autenticado
create or replace function auth_papel()
returns text
language sql
security definer
as $$
  select papel from usuarios where id = auth.uid();
$$;

-- usuarios: autenticado vê todos (precisa listar gestores), só edita o próprio
create policy "usuarios_select" on usuarios for select
  using (auth.role() = 'authenticated');
create policy "usuarios_update_self" on usuarios for update
  using (auth.uid() = id);

-- equipes: autenticado vê todas, só RH cria/edita
create policy "equipes_select" on equipes for select
  using (auth.role() = 'authenticated');
create policy "equipes_write_rh" on equipes for all
  using (auth_papel() = 'rh');

-- centros_custo: mesma regra de equipes
create policy "centros_custo_select" on centros_custo for select
  using (auth.role() = 'authenticated');
create policy "centros_custo_write_rh" on centros_custo for all
  using (auth_papel() = 'rh');

-- operadores: autenticado vê todos; RH cria; RH ou Gestor edita
create policy "operadores_select" on operadores for select
  using (auth.role() = 'authenticated');
create policy "operadores_insert_rh" on operadores for insert
  with check (auth_papel() = 'rh');
create policy "operadores_update" on operadores for update
  using (auth_papel() in ('rh','gestor'));

-- arquivos: só autenticado (RH) lê/valida. Inserção pública NÃO passa por aqui
-- (vai pela rota de API com service role key, que ignora RLS)
create policy "arquivos_select_rh" on arquivos for select
  using (auth_papel() = 'rh');
create policy "arquivos_update_rh" on arquivos for update
  using (auth_papel() = 'rh');