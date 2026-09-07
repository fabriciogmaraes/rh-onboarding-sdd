const CONFIG: Record<string, { label: string; badge: string; dot: string }> = {
  pendente_documentacao: { label: 'Aguardando documentos', badge: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  em_validacao:           { label: 'Em validação',          badge: 'bg-sky-50 text-sky-700 border-sky-200',     dot: 'bg-sky-500' },
  aprovado:                { label: 'Aprovado',              badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  reprovado:               { label: 'Reprovado',             badge: 'bg-rose-50 text-rose-700 border-rose-200',  dot: 'bg-rose-500' },
  pendente:                { label: 'Pendente',              badge: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  ativo:                   { label: 'Ativo',                 badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  desligado:               { label: 'Desligado',             badge: 'bg-gray-100 text-gray-500 border-gray-200', dot: 'bg-gray-400' },
}

export function StatusBadge({ status }: { status: string }) {
  const c = CONFIG[status] ?? { label: status, badge: 'bg-gray-100 text-gray-600 border-gray-200', dot: 'bg-gray-400' }
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${c.badge}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  )
}