import { criarOperador } from '../actions'

export default function NovoOperadorPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl mb-6">Cadastrar operador</h1>
      <form action={criarOperador} className="flex w-96 flex-col gap-3">
        <input
          name="nome_completo"
          placeholder="Nome completo"
          required
          className="border border-black/15 bg-white p-2.5 rounded-md text-sm outline-none focus:border-navy"
        />
        <input
          name="email_pessoal"
          type="email"
          placeholder="E-mail pessoal (usado na vaga)"
          required
          className="border border-black/15 bg-white p-2.5 rounded-md text-sm outline-none focus:border-navy"
        />
        <button
          type="submit"
          className="bg-navy text-white p-2.5 rounded-md text-sm font-medium hover:bg-navy-dark transition-colors mt-1"
        >
          Cadastrar
        </button>
      </form>
    </div>
  )
}