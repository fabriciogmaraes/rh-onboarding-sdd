import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function exigirPapel(papelEsperado: 'rh' | 'gestor') {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: usuario } = await supabase
    .from('usuarios')
    .select('papel')
    .eq('id', user.id)
    .single()

  if (usuario?.papel !== papelEsperado) {
    redirect('/dashboard')
  }

  return user
}