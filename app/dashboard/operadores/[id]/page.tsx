import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import { validarArquivo } from './actions'

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
      <h1 className="text-xl font-bold mb-1">{operador.nome_completo}</h1>
      <p className="text-sm text-gray-500 mb-1">Status: {operador.status}</p>
      {operador.email_corporativo && (
        <p className="text-sm text-gray-500 mb-6">E-mail corporativo: {operador.email_corporativo}</p>
      )}

      <div className="flex flex-col gap-4">
        {arquivosComUrl.map((arquivo) => (
          <div key={arquivo.id} className="border p-4 rounded flex items-center justify-between">
            <div>
              <p className="font-medium">{arquivo.tipo_documento}</p>
              {arquivo.signedUrl && (
                <a href={arquivo.signedUrl} target="_blank" className="text-blue-600 text-sm underline">
                  Ver arquivo
                </a>
              )}
              <p className="text-xs text-gray-500">Status: {arquivo.status}</p>
            </div>
            {arquivo.status === 'pendente' && (
              <div className="flex gap-2">
                <form action={validarArquivo}>
                  <input type="hidden" name="arquivo_id" value={arquivo.id} />
                  <input type="hidden" name="operador_id" value={operador.id} />
                  <input type="hidden" name="novo_status" value="aprovado" />
                  <button className="bg-green-600 text-white px-3 py-1 rounded text-sm">Aprovar</button>
                </form>
                <form action={validarArquivo}>
                  <input type="hidden" name="arquivo_id" value={arquivo.id} />
                  <input type="hidden" name="operador_id" value={operador.id} />
                  <input type="hidden" name="novo_status" value="reprovado" />
                  <button className="bg-red-600 text-white px-3 py-1 rounded text-sm">Reprovar</button>
                </form>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}