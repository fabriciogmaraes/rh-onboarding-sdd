import { criarCentroCusto } from '../actions'

export default function NovoCentroCustoPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl mb-6">Cadastrar centro de custo</h1>
      <form action={criarCentroCusto} className="flex w-96 flex-col gap-3">
        <input
          name="nome"
          placeholder="Nome do centro de custo"
          required
          className="border border-black/15 bg-white p-2.5 rounded-md text-sm outline-none focus:border-navy"
        />
        <input
          name="diretoria"
          placeholder="Diretoria vinculada"
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