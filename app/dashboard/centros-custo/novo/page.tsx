import { criarCentroCusto } from '../actions'

export default function NovoCentroCustoPage() {
  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-4">Cadastrar centro de custo</h1>
      <form action={criarCentroCusto} className="flex w-96 flex-col gap-4">
        <input name="nome" placeholder="Nome do centro de custo" required className="border p-2 rounded" />
        <input name="diretoria" placeholder="Diretoria vinculada" required className="border p-2 rounded" />
        <button type="submit" className="bg-black text-white p-2 rounded">
          Cadastrar
        </button>
      </form>
    </div>
  )
}