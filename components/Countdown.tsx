'use client'

import { useEffect, useState } from 'react'

function formatar(ms: number) {
  if (ms <= 0) return 'Expirado'
  const horas = Math.floor(ms / (1000 * 60 * 60))
  const minutos = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
  return `${horas}h ${minutos}m restantes`
}

export function Countdown({ expiraEm }: { expiraEm: string }) {
  const [restante, setRestante] = useState(() => new Date(expiraEm).getTime() - Date.now())

  useEffect(() => {
    const id = setInterval(() => {
      setRestante(new Date(expiraEm).getTime() - Date.now())
    }, 60000)
    return () => clearInterval(id)
  }, [expiraEm])

  const expirado = restante <= 0
  const proximoDoLimite = restante > 0 && restante < 1000 * 60 * 60 * 12

  return (
    <span className={`text-xs font-medium ${expirado ? 'text-rose-600' : proximoDoLimite ? 'text-amber-600' : 'text-gray-500'}`}>
      {formatar(restante)}
    </span>
  )
}