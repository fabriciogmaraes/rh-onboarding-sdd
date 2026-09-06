# ADR 001: Upload de documentos por novato sem login

## Contexto
O novato precisa enviar documentos sem criar conta no sistema, usando um link com token único.

## Decisão
O upload não usa a chave pública (anon key) do Supabase diretamente do navegador.
Em vez disso, passa por uma rota de API do Next.js (server-side), que valida o
token manualmente e usa a service role key do Supabase (nunca exposta ao navegador)
para inserir o arquivo no banco.

## Alternativas consideradas
- Liberar RLS de inserção anônima na tabela `arquivos`: rejeitada por expor a
  tabela a qualquer requisição com a chave pública, que é visível no client-side.

## Consequências
- RLS permanece restrita a usuários autenticados (RH/Gestor).
- Toda validação de token acontece no servidor, não no banco.
- Exige criar uma rota de API dedicada (`/api/upload`) em vez de inserção direta.