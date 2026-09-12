import { createClient } from '@/lib/supabase/server'
import { criarEquipe } from '../actions'

export default async function NovaEquipePage() {
  const supabase = await createClient()

  const { data: gestores } = await supabase
    .from('usuarios')
    .select('id, nome')
    .eq('papel', 'gestor')

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-6">Cadastrar equipe</h1>
      <form action={criarEquipe} className="flex w-96 flex-col gap-3">
        <input
          name="nome"
          placeholder="Nome da equipe"
          required
          className="border border-black/15 bg-white p-2.5 rounded-md text-sm outline-none focus:border-navy"
        />

        <select
          name="gestor_id"
          className="border border-black/15 bg-white p-2.5 rounded-md text-sm outline-none focus:border-navy"
        >
          <option value="">Sem gestor definido (opcional)</option>
          {gestores?.map((g) => (
            <option key={g.id} value={g.id}>
              {g.nome}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="bg-navy text-white p-2.5 rounded-md text-sm font-medium hover:bg-navy-dark transition-colors mt-1"
        >
          Cadastrar
        </button>
      </form>
    </div>
  )
}