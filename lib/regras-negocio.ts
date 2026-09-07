export function gerarEmailCorporativo(nomeCompleto: string): string {
  const partes = nomeCompleto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .split(' ')
    .filter(Boolean)

  const primeiroNome = partes[0]
  const ultimoNome = partes[partes.length - 1]

  return `${primeiroNome}.${ultimoNome}@guimrh.com.br`
}

export function tokenExpirado(tokenExpiraEm: string): boolean {
  return new Date(tokenExpiraEm) < new Date()
}

export function todosArquivosAprovados(arquivos: { status: string }[]): boolean {
  return arquivos.length > 0 && arquivos.every((a) => a.status === 'aprovado')
}