import { login } from './actions'

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <form action={login} className="flex w-80 flex-col gap-4">
        <h1 className="text-xl font-bold">Login</h1>
        {searchParams.error && (
          <p className="text-sm text-red-600">E-mail ou senha inválidos.</p>
        )}
        <input
          name="email"
          type="email"
          placeholder="E-mail"
          required
          className="border p-2 rounded"
        />
        <input
          name="password"
          type="password"
          placeholder="Senha"
          required
          className="border p-2 rounded"
        />
        <button type="submit" className="bg-black text-white p-2 rounded">
          Entrar
        </button>
      </form>
    </div>
  )
}