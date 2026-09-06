import { criarOperador } from '../actions'

export default function NovoOperadorPage() {
  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-4">Cadastrar operador</h1>
      <form action={criarOperador} className="flex w-96 flex-col gap-4">
        <input
          name="nome_completo"
          placeholder="Nome completo"
          required
          className="border p-2 rounded"
        />
        <input
          name="email_pessoal"
          type="email"
          placeholder="E-mail pessoal (usado na vaga)"
          required
          className="border p-2 rounded"
        />
        <button type="submit" className="bg-black text-white p-2 rounded">
          Cadastrar
        </button>
      </form>
    </div>
  )
}