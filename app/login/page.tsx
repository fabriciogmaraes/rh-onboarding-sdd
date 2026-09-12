import { login } from './actions'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-80">
        <p className="text-xs tracking-wide text-muted mb-1">RH ONBOARDING</p>
        <h1 className="text-2xl mb-6">Entrar</h1>

        <form action={login} className="flex flex-col gap-3">
          {error && (
            <p className="text-sm text-rose-600 -mt-1 mb-1">E-mail ou senha inválidos.</p>
          )}
          <input
            name="email"
            type="email"
            placeholder="E-mail"
            required
            className="border border-black/15 bg-white p-2.5 rounded-md text-sm outline-none focus:border-navy"
          />
          <input
            name="password"
            type="password"
            placeholder="Senha"
            required
            className="border border-black/15 bg-white p-2.5 rounded-md text-sm outline-none focus:border-navy"
          />
          <button
            type="submit"
            className="bg-navy text-white p-2.5 rounded-md text-sm font-medium mt-1 hover:bg-navy-dark transition-colors"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  )
}