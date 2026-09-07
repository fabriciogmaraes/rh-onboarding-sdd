# Ferramentas e Estratégias de IA

## Modelo utilizado
- Claude (Anthropic), via interface de chat — usado do início ao fim do processo: definição de escopo, especificação, arquitetura, geração de código e depuração.

## Formato de interação
Pareamento guiado por chat: a IA propôs e explicou cada trecho de código e cada decisão antes de qualquer ação; o desenvolvedor digitou, executou e testou cada comando manualmente no seu próprio ambiente (nunca execução autônoma). Erros reais (mensagens de terminal, prints de tela) foram colados de volta na conversa para diagnóstico, criando um ciclo de feedback real entre ambiente e IA.

## Nível de autonomia adotado
Baixo, por escolha deliberada: a IA nunca executou comandos diretamente no ambiente do desenvolvedor. Cada arquivo criado, cada comando de terminal e cada instrução SQL foi revisado e aplicado manualmente antes de seguir para o próximo passo. Essa escolha fez sentido porque nenhum dos dois integrantes tinha experiência prévia com Next.js/Supabase, então a compreensão de cada peça durante a construção era mais importante do que a velocidade de um agente autônomo.

## Uso de SDD (Spec-Driven Development)
A especificação (`docs/spec.md`) foi produzida em conjunto com a IA antes de qualquer código: prompt inicial, entidades, papéis, casos de uso com pré/pós-condições, critérios de aceite em Given/When/Then (incluindo o caso de borda do token expirado) e plano de tarefas. O plano de tarefas guiou a ordem real de implementação e, consequentemente, a sequência dos commits no repositório.

## Guardrail configurado
Hook de pre-commit (Husky) executando `npm run build` antes de qualquer commit ser aceito — bloqueio real testado propositalmente com um erro de TypeScript (evidência em `docs/evidencias/guardrail-bloqueio.png`) e confirmado funcionando após a correção.

## Onde houve divergência/decisão conjunta
- **ADR 001** (upload sem login): a IA propôs duas alternativas (RLS anônima vs. rota de API com service role key); a decisão final e o trade-off documentado foram discutidos e escolhidos em conjunto.
- Escopo de funcionalidades extras (fluxo de reenvio em caso de documento reprovado, PDI, feedback de gestor) foi conscientemente adiado para "próximos passos" após avaliação conjunta de custo x prazo.

## Limitações conhecidas
- Controle de acesso por papel (RH/Gestor) é reforçado na camada de aplicação e parcialmente por RLS; nem toda tabela tem policy de escrita restrita por papel na camada de banco.
- Reenvio de documento reprovado ainda é manual (RH avisa o candidato); não há disparo automático de e-mail.