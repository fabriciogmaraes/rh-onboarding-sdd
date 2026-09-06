'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function criarOperador(formData: FormData) {
  const supabase = await createClient()

  const nome_completo = formData.get('nome_completo') as string
  const email_pessoal = formData.get('email_pessoal') as string

  const tokenExpiraEm = new Date()
  tokenExpiraEm.setHours(tokenExpiraEm.getHours() + 72)

  const { error } = await supabase.from('operadores').insert({
    nome_completo,
    email_pessoal,
    token_expira_em: tokenExpiraEm.toISOString(),
  })

  if (error) {
    console.error(error)
    throw new Error('Erro ao cadastrar operador: ' + error.message)
  }

  revalidatePath('/dashboard/operadores')
  redirect('/dashboard/operadores')
}