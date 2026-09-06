import { createAdminClient } from '@/lib/supabase/admin'
import { enviarDocumentos } from './actions'

export default async function UploadPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const supabase = createAdminClient()

  const { data: operador, error } = await supabase
    .from('operadores')
    .select('*')
    .eq('token_upload', token)
    .single()

  if (error || !operador) {
    return <div className="p-8">Link inválido.</div>
  }

  const tokenExpirado = new Date(operador.token_expira_em) < new Date()
  if (tokenExpirado) {
    return <div className="p-8">Este link expirou. Peça ao RH para gerar um novo.</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-4">Olá, {operador.nome_completo}</h1>
      <p className="mb-4">Envie os documentos abaixo para prosseguir com seu cadastro.</p>
      <form action={enviarDocumentos} className="flex flex-col gap-4 w-96">
        <input type="hidden" name="token" value={token} />
        <label className="flex flex-col gap-1">
          RG
          <input type="file" name="arquivo_rg" required />
        </label>
        <label className="flex flex-col gap-1">
          CPF
          <input type="file" name="arquivo_cpf" required />
        </label>
        <label className="flex flex-col gap-1">
          Comprovante de residência
          <input type="file" name="arquivo_comprovante_residencia" required />
        </label>
        <button type="submit" className="bg-black text-white p-2 rounded">
          Enviar
        </button>
      </form>
    </div>
  )
}