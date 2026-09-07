'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

function gerarEmailCorporativo(nomeCompleto: string): string {
  const partes = nomeCompleto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .toLowerCase()
    .trim()
    .split(' ')
    .filter(Boolean)

  const primeiroNome = partes[0]
  const ultimoNome = partes[partes.length - 1]

  return `${primeiroNome}.${ultimoNome}@guimrh.com.br`
}

export async function validarArquivo(formData: FormData) {
  const supabase = await createClient()

  const arquivoId = formData.get('arquivo_id') as string
  const operadorId = formData.get('operador_id') as string
  const novoStatus = formData.get('novo_status') as string

  const { data: { user } } = await supabase.auth.getUser()

  const { error: erroArquivo } = await supabase
    .from('arquivos')
    .update({ status: novoStatus, validado_por: user?.id })
    .eq('id', arquivoId)

  if (erroArquivo) throw new Error('Erro ao validar arquivo: ' + erroArquivo.message)

  const { data: arquivos } = await supabase
    .from('arquivos')
    .select('status')
    .eq('operador_id', operadorId)

  const todosAprovados =
    arquivos && arquivos.length > 0 && arquivos.every((a) => a.status === 'aprovado')

  if (todosAprovados) {
    const { data: operador } = await supabase
      .from('operadores')
      .select('nome_completo')
      .eq('id', operadorId)
      .single()

    if (operador) {
      const emailCorporativo = gerarEmailCorporativo(operador.nome_completo)
      await supabase
        .from('operadores')
        .update({ email_corporativo: emailCorporativo, status: 'aprovado' })
        .eq('id', operadorId)
    }
  }

  revalidatePath(`/dashboard/operadores/${operadorId}`)
  revalidatePath('/dashboard/operadores')
}