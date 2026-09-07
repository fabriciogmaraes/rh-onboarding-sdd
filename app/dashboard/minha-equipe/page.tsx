import { exigirPapel } from '@/lib/auth/papel'
import { createClient } from '@/lib/supabase/server'
import { StatusBadge } from '@/components/StatusBadge'
import { iniciarDesligamento } from './actions'

export default async function MinhaEquipePage() {
  const user = await exigirPapel('gestor')
  const supabase = await createClient()

  const { data: operadores } = await supabase
    .from('operadores')
    .select('*, equipes(nome)')
    .eq('gestor_id', user.id)
    .eq('status', 'ativo')

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-1">Minha equipe</h1>
      <p className="text-sm text-gray-500 mb-4">
        {operadores?.length ?? 0} operador(es) ativo(s) — HC ativo da equipe
      </p>

      <div className="flex flex-col gap-4">
        {operadores?.map((op) => (
          <div key={op.id} className="border p-4 rounded max-w-md flex items-center justify-between">
            <div>
              <p className="font-medium">{op.nome_completo}</p>
              <p className="text-sm text-gray-500">{op.email_corporativo}</p>
              <StatusBadge status={op.status} />
            </div>
            <form action={iniciarDesligamento}>
              <input type="hidden" name="operador_id" value={op.id} />
              <button className="bg-rose-600 text-white px-3 py-1 rounded text-sm">
                Iniciar desligamento
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  )
}