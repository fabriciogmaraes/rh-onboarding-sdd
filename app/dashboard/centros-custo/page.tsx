import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { exigirPapel } from '@/lib/auth/papel'

export default async function CentrosCustoPage() {
  await exigirPapel('rh')
  const supabase = await createClient()
  const { data: centros } = await supabase.from('centros_custo').select('*')

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Centros de custo</h1>
        <Link href="/dashboard/centros-custo/novo" className="bg-black text-white px-4 py-2 rounded">
          + Cadastrar centro de custo
        </Link>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="text-left border-b">
            <th className="p-2">Nome</th>
            <th className="p-2">Diretoria</th>
          </tr>
        </thead>
        <tbody>
          {centros?.map((c) => (
            <tr key={c.id} className="border-b">
              <td className="p-2">{c.nome}</td>
              <td className="p-2">{c.diretoria}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}