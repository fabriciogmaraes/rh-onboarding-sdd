import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function EquipesPage() {
  const supabase = await createClient()

  const { data: equipes } = await supabase
    .from('equipes')
    .select('*, usuarios(nome)')

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl">Equipes</h1>
        <Link
          href="/dashboard/equipes/nova"
          className="bg-navy text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-navy-dark transition-colors"
        >
          + Cadastrar equipe
        </Link>
      </div>

      <div className="border border-black/10 rounded-lg overflow-hidden bg-white">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="text-left border-b border-black/10 bg-black/[0.02]">
              <th className="p-3 font-medium text-muted">Nome</th>
              <th className="p-3 font-medium text-muted">Gestor</th>
            </tr>
          </thead>
          <tbody>
            {equipes?.map((eq) => (
              <tr key={eq.id} className="border-b border-black/5 last:border-0 hover:bg-black/[0.015]">
                <td className="p-3">{eq.nome}</td>
                <td className="p-3 text-muted">{eq.usuarios?.nome ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}