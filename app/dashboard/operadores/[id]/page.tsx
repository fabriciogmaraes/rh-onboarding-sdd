import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import { validarArquivo } from './actions'
import { StatusBadge } from '@/components/StatusBadge'

export default async function OperadorDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: operador, error } = await supabase
    .from('operadores')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !operador) {
    return <div className="p-8">Operador não encontrado.</div>
  }

  const { data: arquivos } = await supabase
    .from('arquivos')
    .select('*')
    .eq('operador_id', id)

  const admin = createAdminClient()
  const arquivosComUrl = await Promise.all(
    (arquivos ?? []).map(async (arquivo) => {
      const { data } = await admin.storage
        .from('documentos')
        .createSignedUrl(arquivo.url_arquivo, 600)
      return { ...arquivo, signedUrl: data?.signedUrl }
    })
  )

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-2">{operador.nome_completo}</h1>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-sm text-gray-500">Status:</span>
        <StatusBadge status={operador.status} />
      </div>
      {operador.email_corporativo && (
        <p className="text-sm text-gray-500 mb-6">E-mail corporativo: {operador.email_corporativo}</p>
      )}

      <div className="flex flex-col gap-4 mt-4">
        {arquivosComUrl.map((arquivo) => (
          <div key={arquivo.id} className="border p-4 rounded flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <p className="font-medium">{arquivo.tipo_documento}</p>
              {arquivo.signedUrl && (
                <a href={arquivo.signedUrl} target="_blank" className="text-blue-600 text-sm underline">
                  Ver arquivo
                </a>
              )}
              <StatusBadge status={arquivo.status} />
            </div>
            {arquivo.status === 'pendente' && (
              <div className="flex gap-2">
                <form action={validarArquivo}>
                  <input type="hidden" name="arquivo_id" value={arquivo.id} />
                  <input type="hidden" name="operador_id" value={operador.id} />
                  <input type="hidden" name="novo_status" value="aprovado" />
                  <button className="bg-emerald-600 text-white px-3 py-1 rounded text-sm">Aprovar</button>
                </form>
                <form action={validarArquivo}>
                  <input type="hidden" name="arquivo_id" value={arquivo.id} />
                  <input type="hidden" name="operador_id" value={operador.id} />
                  <input type="hidden" name="novo_status" value="reprovado" />
                  <button className="bg-rose-600 text-white px-3 py-1 rounded text-sm">Reprovar</button>
                </form>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}