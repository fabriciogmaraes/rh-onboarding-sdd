import Link from 'next/link'
import { sair } from './actions'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let papel: string | null = null
  if (user) {
    const { data: usuario } = await supabase
      .from('usuarios')
      .select('papel')
      .eq('id', user.id)
      .single()
    papel = usuario?.papel ?? null
  }

  return (
    <div>
      <nav className="flex items-center justify-between border-b p-4">
        <div className="flex gap-4">
          <Link href="/dashboard" className="font-bold">
            RH Onboarding
          </Link>
          {papel === 'rh' && (
            <>
              <Link href="/dashboard/operadores" className="text-sm">
                Operadores
              </Link>
              <Link href="/dashboard/equipes" className="text-sm">
                Equipes
              </Link>
              <Link href="/dashboard/centros-custo" className="text-sm">
                Centros de custo
              </Link>
            </>
          )}
          {papel === 'gestor' && (
            <>
              <Link href="/dashboard/aprovacoes" className="text-sm">
                Aprovações
              </Link>
              <Link href="/dashboard/minha-equipe" className="text-sm">
                Minha equipe
              </Link>
            </>
          )}
        </div>
        <form action={sair}>
          <button className="text-sm text-red-600">Sair</button>
        </form>
      </nav>
      {children}
    </div>
  )
}