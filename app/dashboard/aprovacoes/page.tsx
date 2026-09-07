import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { aprovarEAgendarCall } from '../operadores/[id]/actions'

export default async function AprovacoesPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: usuario } = await supabase
    .from('usuarios')
    .select('papel')
    .eq('id', user.id)
    .single()

  if (usuario?.papel !== 'gestor') {
    return <div className="p-8">Essa área é exclusiva do Gestor.</div>
  }

  const { data: operadores } = await supabase
    .from('operadores')
    .select('*, equipes(nome), centros_custo(nome)')
    .eq('gestor_id', user.id)
    .eq('status', 'aprovado')

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-4">Aprovações pendentes</h1>

      {operadores?.length === 0 && (
        <p className="text-gray-500 text-sm">Nenhum operador aguardando aprovação no momento.</p>
      )}

      <div className="flex flex-col gap-4">
        {operadores?.map((op) => (
          <div key={op.id} className="border p-4 rounded max-w-md">
            <h2 className="font-medium">{op.nome_completo}</h2>
            <p className="text-sm text-gray-500">{op.email_corporativo}</p>
            <p className="text-sm text-gray-500 mb-3">
              {op.equipes?.nome} · {op.centros_custo?.nome}
            </p>

            <form action={aprovarEAgendarCall} className="flex flex-col gap-2">
              <input type="hidden" name="operador_id" value={op.id} />
              <label className="text-sm">
                Data/hora da call de 1º dia
                <input
                  type="datetime-local"
                  name="data_call"
                  required
                  className="border p-2 rounded w-full mt-1"
                />
              </label>
              <button className="bg-emerald-600 text-white p-2 rounded">
                Aprovar e agendar
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  )
}