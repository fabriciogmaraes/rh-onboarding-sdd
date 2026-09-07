import { describe, it, expect } from 'vitest'
import { gerarEmailCorporativo, tokenExpirado, todosArquivosAprovados } from './regras-negocio'

describe('gerarEmailCorporativo', () => {
  it('gera e-mail com primeiro e último nome em minúsculo', () => {
    expect(gerarEmailCorporativo('Fabricio Alcântara')).toBe('fabricio.alcantara@guimrh.com.br')
  })

  it('remove acentos do nome', () => {
    expect(gerarEmailCorporativo('João da Conceição')).toBe('joao.conceicao@guimrh.com.br')
  })
})

describe('tokenExpirado', () => {
  it('retorna false para um token que ainda não venceu', () => {
    const dataFutura = new Date(Date.now() + 1000 * 60 * 60).toISOString() // +1h
    expect(tokenExpirado(dataFutura)).toBe(false)
  })

  it('retorna true para um token vencido (caso de borda da spec)', () => {
    const dataPassada = new Date(Date.now() - 1000 * 60 * 60).toISOString() // -1h
    expect(tokenExpirado(dataPassada)).toBe(true)
  })
})

describe('todosArquivosAprovados', () => {
  it('retorna true quando todos os arquivos estão aprovados', () => {
    const arquivos = [{ status: 'aprovado' }, { status: 'aprovado' }]
    expect(todosArquivosAprovados(arquivos)).toBe(true)
  })

  it('retorna false quando pelo menos um arquivo está pendente', () => {
    const arquivos = [{ status: 'aprovado' }, { status: 'pendente' }]
    expect(todosArquivosAprovados(arquivos)).toBe(false)
  })

  it('retorna false quando a lista de arquivos está vazia', () => {
    expect(todosArquivosAprovados([])).toBe(false)
  })
})