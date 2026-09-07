'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function iniciarDesligamento(formData: FormData) {
  const supabase = await createClient()
  const operadorId = formData.get('operador_id') as string

  const { error } = await supabase
    .from('operadores')
    .update({
      status: 'desligado',
      data_desligamento: new Date().toISOString(),
    })
    .eq('id', operadorId)

  if (error) throw new Error('Erro ao desligar: ' + error.message)

  revalidatePath('/dashboard/minha-equipe')
}