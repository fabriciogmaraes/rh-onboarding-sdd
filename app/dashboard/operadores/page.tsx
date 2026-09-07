import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { StatusBadge } from '@/components/StatusBadge'
import { Countdown } from '@/components/Countdown'

export default async function OperadoresPage() {
  const supabase = await createClient()

  const { data: operadores, error } = await supabase
    .from('operadores')
    .select('*')
    .order('data_cadastro', { ascending: false })

  if (error) {
    return <div className="p-8 text-red-600">Erro ao carregar operadores: {error.message}</div>
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Operadores</h1>
        <Link href="/dashboard/operadores/novo" className="bg-black text-white px-4 py-2 rounded">
          + Cadastrar operador
        </Link>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="text-left border-b">
            <th className="p-2">Nome</th>
            <th className="p-2">E-mail pessoal</th>
            <th className="p-2">Status</th>
            <th className="p-2">Prazo</th>
            <th className="p-2">Link de upload</th>
            <th className="p-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {operadores?.map((op) => (
            <tr key={op.id} className="border-b">
              <td className="p-2">{op.nome_completo}</td>
              <td className="p-2">{op.email_pessoal}</td>
              <td className="p-2">
                <StatusBadge status={op.status} />
              </td>
              <td className="p-2">
                {op.status === 'pendente_documentacao' ? (
                  <Countdown expiraEm={op.token_expira_em} />
                ) : (
                  <span className="text-gray-300 text-xs">—</span>
                )}
              </td>
              <td className="p-2">
                {op.status === 'pendente_documentacao' ? (
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                    /upload/{op.token_upload}
                  </code>
                ) : (
                  <span className="text-gray-300 text-xs">—</span>
                )}
              </td>
              <td className="p-2">
                <Link href={`/dashboard/operadores/${op.id}`} className="text-blue-600 underline text-sm">
                  Ver detalhes
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}