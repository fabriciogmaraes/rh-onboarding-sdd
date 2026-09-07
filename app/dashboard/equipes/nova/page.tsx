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
      <h1 className="text-xl font-bold mb-4">Cadastrar equipe</h1>
      <form action={criarEquipe} className="flex w-96 flex-col gap-4">
        <input name="nome" placeholder="Nome da equipe" required className="border p-2 rounded" />

        <select name="gestor_id" className="border p-2 rounded">
          <option value="">Sem gestor definido (opcional)</option>
          {gestores?.map((g) => (
            <option key={g.id} value={g.id}>
              {g.nome}
            </option>
          ))}
        </select>

        <button type="submit" className="bg-black text-white p-2 rounded">
          Cadastrar
        </button>
      </form>
    </div>
  )
}