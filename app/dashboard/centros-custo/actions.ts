'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function criarCentroCusto(formData: FormData) {
  const supabase = await createClient()

  const nome = formData.get('nome') as string
  const diretoria = formData.get('diretoria') as string

  const { error } = await supabase.from('centros_custo').insert({ nome, diretoria })

  if (error) throw new Error('Erro ao criar centro de custo: ' + error.message)

  revalidatePath('/dashboard/centros-custo')
  redirect('/dashboard/centros-custo')
}