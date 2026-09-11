const ROTULOS: Record<string, string> = {
  RG: 'RG',
  CPF: 'CPF',
  comprovante_residencia: 'Comprovante de Residência',
}

export function nomeAmigavelDocumento(tipo: string): string {
  return ROTULOS[tipo] ?? tipo
}