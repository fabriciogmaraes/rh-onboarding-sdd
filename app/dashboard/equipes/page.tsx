import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { exigirPapel } from '@/lib/auth/papel'

export default async function EquipesPage() {
  await exigirPapel('rh')
  const supabase = await createClient()

  const { data: equipes } = await supabase
    .from('equipes')
    .select('*, usuarios(nome)')

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Equipes</h1>
        <Link href="/dashboard/equipes/nova" className="bg-black text-white px-4 py-2 rounded">
          + Cadastrar equipe
        </Link>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="text-left border-b">
            <th className="p-2">Nome</th>
            <th className="p-2">Gestor</th>
          </tr>
        </thead>
        <tbody>
          {equipes?.map((eq) => (
            <tr key={eq.id} className="border-b">
              <td className="p-2">{eq.nome}</td>
              <td className="p-2">{eq.usuarios?.nome ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}