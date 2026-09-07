import Link from 'next/link'
import { sair } from './actions'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <nav className="flex items-center justify-between border-b p-4">
        <div className="flex gap-4">
            <Link href="/dashboard" className="font-bold">
                RH Onboarding
            </Link>
            <Link href="/dashboard/operadores" className="text-sm">
                Operadores
            </Link>
            <Link href="/dashboard/equipes" className="text-sm">
                Equipes
            </Link>
            <Link href="/dashboard/centros-custo" className="text-sm">
                Centros de custo
            </Link>
            <Link href="/dashboard/aprovacoes" className="text-sm">
                Aprovações
            </Link>
        </div>
        <form action={sair}>
          <button className="text-sm text-red-600">Sair</button>
        </form>
      </nav>
      {children}
    </div>
  )
}