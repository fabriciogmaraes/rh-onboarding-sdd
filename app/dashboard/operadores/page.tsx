import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { StatusBadge } from '@/components/StatusBadge'
import { Countdown } from '@/components/Countdown'
import { exigirPapel } from '@/lib/auth/papel'

export default async function OperadoresPage() {
  await exigirPapel('rh')
  const supabase = await createClient()

  const { data: operadores, error } = await supabase
    .from('operadores')
    .select('*')
    .order('data_cadastro', { ascending: false })

  if (error) {
    return <div className="p-8 text-rose-600">Erro ao carregar operadores: {error.message}</div>
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl">Operadores</h1>
        <Link
          href="/dashboard/operadores/novo"
          className="bg-navy text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-navy-dark transition-colors"
        >
          + Cadastrar operador
        </Link>
      </div>

      <div className="border border-black/10 rounded-lg overflow-hidden bg-white">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="text-left border-b border-black/10 bg-black/[0.02]">
              <th className="p-3 font-medium text-muted">Nome</th>
              <th className="p-3 font-medium text-muted">E-mail pessoal</th>
              <th className="p-3 font-medium text-muted">Status</th>
              <th className="p-3 font-medium text-muted">Prazo</th>
              <th className="p-3 font-medium text-muted">Link de upload</th>
              <th className="p-3 font-medium text-muted">Ações</th>
            </tr>
          </thead>
          <tbody>
            {operadores?.map((op) => (
              <tr key={op.id} className="border-b border-black/5 last:border-0 hover:bg-black/[0.015]">
                <td className="p-3">{op.nome_completo}</td>
                <td className="p-3 text-muted">{op.email_pessoal}</td>
                <td className="p-3">
                  <StatusBadge status={op.status} />
                </td>
                <td className="p-3">
                  {op.status === 'pendente_documentacao' ? (
                    <Countdown expiraEm={op.token_expira_em} />
                  ) : (
                    <span className="text-muted/40 text-xs">—</span>
                  )}
                </td>
                <td className="p-3">
                  {op.status === 'pendente_documentacao' ? (
                    <code className="text-xs bg-ice/40 text-navy px-2 py-1 rounded">
                      /upload/{op.token_upload}
                    </code>
                  ) : (
                    <span className="text-muted/40 text-xs">—</span>
                  )}
                </td>
                <td className="p-3">
                  <Link href={`/dashboard/operadores/${op.id}`} className="text-navy underline text-sm">
                    Ver detalhes
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}