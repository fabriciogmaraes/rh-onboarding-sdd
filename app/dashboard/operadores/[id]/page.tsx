import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import { validarArquivo, vincularEquipeCentroCusto } from './actions'
import { StatusBadge } from '@/components/StatusBadge'
import { nomeAmigavelDocumento } from '@/lib/rotulos'

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

  const { data: equipes } = await supabase.from('equipes').select('id, nome')
  const { data: centrosCusto } = await supabase.from('centros_custo').select('id, nome')

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
      <h1 className="text-2xl mb-2">{operador.nome_completo}</h1>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-sm text-muted">Status:</span>
        <StatusBadge status={operador.status} />
      </div>
      {operador.email_corporativo && (
        <p className="text-sm text-muted mb-6">E-mail corporativo: {operador.email_corporativo}</p>
      )}

      <div className="flex flex-col gap-3 mt-4">
        {arquivosComUrl.map((arquivo) => (
          <div key={arquivo.id} className="border border-black/10 bg-white p-4 rounded-lg flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <p className="font-medium">{nomeAmigavelDocumento(arquivo.tipo_documento)}</p>
              {arquivo.signedUrl && (
                <a href={arquivo.signedUrl} target="_blank" className="text-navy text-sm underline">
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
                  <button className="bg-emerald-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-emerald-700 transition-colors">Aprovar</button>
                </form>
                <form action={validarArquivo}>
                  <input type="hidden" name="arquivo_id" value={arquivo.id} />
                  <input type="hidden" name="operador_id" value={operador.id} />
                  <input type="hidden" name="novo_status" value="reprovado" />
                  <button className="bg-rose-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-rose-700 transition-colors">Reprovar</button>
                </form>
              </div>
            )}
          </div>
        ))}
      </div>

      {operador.status === 'aprovado' && (
        <div className="border border-black/10 bg-white p-5 rounded-lg mt-6 max-w-md">
          <h2 className="font-medium mb-3">Vincular equipe e centro de custo</h2>
          <form action={vincularEquipeCentroCusto} className="flex flex-col gap-3">
            <input type="hidden" name="operador_id" value={operador.id} />

            <select name="equipe_id" defaultValue={operador.equipe_id ?? ''} className="border border-black/15 p-2.5 rounded-md text-sm">
              <option value="">Selecione a equipe</option>
              {equipes?.map((eq) => (
                <option key={eq.id} value={eq.id}>{eq.nome}</option>
              ))}
            </select>

            <select name="centro_custo_id" defaultValue={operador.centro_custo_id ?? ''} className="border border-black/15 p-2.5 rounded-md text-sm">
              <option value="">Selecione o centro de custo</option>
              {centrosCusto?.map((c) => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </select>

            <button className="bg-navy text-white p-2.5 rounded-md text-sm font-medium hover:bg-navy-dark transition-colors">Salvar vínculo</button>
          </form>
        </div>
      )}
    </div>
  )
}