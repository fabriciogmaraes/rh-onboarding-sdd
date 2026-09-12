import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function CentrosCustoPage() {
  const supabase = await createClient()
  const { data: centros } = await supabase.from('centros_custo').select('*')

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl">Centros de custo</h1>
        <Link
          href="/dashboard/centros-custo/novo"
          className="bg-navy text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-navy-dark transition-colors"
        >
          + Cadastrar centro de custo
        </Link>
      </div>

      <div className="border border-black/10 rounded-lg overflow-hidden bg-white">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="text-left border-b border-black/10 bg-black/[0.02]">
              <th className="p-3 font-medium text-muted">Nome</th>
              <th className="p-3 font-medium text-muted">Diretoria</th>
            </tr>
          </thead>
          <tbody>
            {centros?.map((c) => (
              <tr key={c.id} className="border-b border-black/5 last:border-0 hover:bg-black/[0.015]">
                <td className="p-3">{c.nome}</td>
                <td className="p-3 text-muted">{c.diretoria}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}