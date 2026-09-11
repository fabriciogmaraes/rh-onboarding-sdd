import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function DashboardHomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: usuario } = await supabase
    .from('usuarios')
    .select('nome, papel')
    .eq('id', user.id)
    .single()

  const papel = usuario?.papel

  if (papel === 'rh') {
    const { data: operadores } = await supabase.from('operadores').select('status')
    const contagem = (status: string) => operadores?.filter((o) => o.status === status).length ?? 0

    const stats = [
      { label: 'Aguardando documentos', valor: contagem('pendente_documentacao') },
      { label: 'Em validação', valor: contagem('em_validacao') },
      { label: 'Aprovados (aguardando gestor)', valor: contagem('aprovado') },
      { label: 'Ativos', valor: contagem('ativo') },
    ]

    return (
      <div className="p-8">
        <h1 className="text-2xl mb-1">Olá, {usuario?.nome ?? 'RH'}</h1>
        <p className="text-sm text-muted mb-8">Visão geral do onboarding</p>

        <div className="grid grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="border border-black/10 rounded-lg p-5 bg-white">
              <p className="text-3xl font-semibold text-navy">{s.valor}</p>
              <p className="text-sm text-muted mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <Link href="/dashboard/operadores" className="inline-block mt-8 text-navy underline text-sm">
          Ver todos os operadores →
        </Link>
      </div>
    )
  }

  if (papel === 'gestor') {
    const { data: pendentes } = await supabase
      .from('operadores')
      .select('id')
      .eq('gestor_id', user.id)
      .eq('status', 'aprovado')

    const { data: ativos } = await supabase
      .from('operadores')
      .select('id')
      .eq('gestor_id', user.id)
      .eq('status', 'ativo')

    return (
      <div className="p-8">
        <h1 className="text-2xl mb-1">Olá, {usuario?.nome ?? 'Gestor'}</h1>
        <p className="text-sm text-muted mb-8">Visão geral da sua equipe</p>

        <div className="grid grid-cols-2 gap-4 max-w-2xl">
          <Link href="/dashboard/aprovacoes" className="border border-black/10 rounded-lg p-5 bg-white block hover:border-navy transition-colors">
            <p className="text-3xl font-semibold text-navy">{pendentes?.length ?? 0}</p>
            <p className="text-sm text-muted mt-1">Aprovações pendentes</p>
          </Link>
          <Link href="/dashboard/minha-equipe" className="border border-black/10 rounded-lg p-5 bg-white block hover:border-navy transition-colors">
            <p className="text-3xl font-semibold text-navy">{ativos?.length ?? 0}</p>
            <p className="text-sm text-muted mt-1">Operadores ativos (HC)</p>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl">Olá, {usuario?.nome ?? user.email}</h1>
    </div>
  )
}