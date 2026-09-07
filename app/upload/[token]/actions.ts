'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import { tokenExpirado } from '@/lib/regras-negocio'

const TIPOS = [
  { campo: 'arquivo_rg', tipo: 'RG' },
  { campo: 'arquivo_cpf', tipo: 'CPF' },
  { campo: 'arquivo_comprovante_residencia', tipo: 'comprovante_residencia' },
]

export async function enviarDocumentos(formData: FormData) {
  const supabase = createAdminClient()
  const token = formData.get('token') as string

  const { data: operador, error: erroOperador } = await supabase
    .from('operadores')
    .select('*')
    .eq('token_upload', token)
    .single()

  if (erroOperador || !operador) {
    throw new Error('Token inválido')
  }

  if (tokenExpirado(operador.token_expira_em)) {
    throw new Error('Token expirado')
  }

  for (const { campo, tipo } of TIPOS) {
    const arquivo = formData.get(campo) as File
    if (!arquivo || arquivo.size === 0) continue

    const caminho = `${operador.id}/${tipo}-${Date.now()}-${arquivo.name}`

    const { error: erroUpload } = await supabase.storage
      .from('documentos')
      .upload(caminho, arquivo)

    if (erroUpload) throw new Error(`Erro ao enviar ${tipo}: ${erroUpload.message}`)

    const { error: erroInsert } = await supabase.from('arquivos').insert({
      operador_id: operador.id,
      tipo_documento: tipo,
      url_arquivo: caminho,
      status: 'pendente',
    })

    if (erroInsert) throw new Error(`Erro ao registrar ${tipo}: ${erroInsert.message}`)
  }

  await supabase.from('operadores').update({ status: 'em_validacao' }).eq('id', operador.id)

  redirect('/upload/obrigado')
}