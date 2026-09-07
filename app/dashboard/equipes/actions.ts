'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function criarEquipe(formData: FormData) {
  const supabase = await createClient()

  const nome = formData.get('nome') as string
  const gestor_id = formData.get('gestor_id') as string

  const { error } = await supabase.from('equipes').insert({
    nome,
    gestor_id: gestor_id || null,
  })

  if (error) throw new Error('Erro ao criar equipe: ' + error.message)

  revalidatePath('/dashboard/equipes')
  redirect('/dashboard/equipes')
}