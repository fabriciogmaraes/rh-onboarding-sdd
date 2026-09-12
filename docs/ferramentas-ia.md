# Ferramentas e Estratégias de IA

## Modelo utilizado
- Claude (Anthropic), via interface de chat — usado do início ao fim do processo: definição de escopo, especificação, arquitetura, geração de código, testes, correção de bugs e depuração em produção.

## Formato de interação
Pareamento guiado por chat: a IA propôs e explicou cada trecho de código e cada decisão antes de qualquer ação; o desenvolvedor digitou, executou e testou cada comando manualmente no seu próprio ambiente (nunca execução autônoma). Erros reais (mensagens de terminal, prints de tela, logs de produção) foram colados de volta na conversa para diagnóstico, criando um ciclo de feedback real entre ambiente e IA — inclusive após o deploy, quando problemas que só apareciam em produção (limite de upload, mudança de chaves do Supabase) precisaram ser diagnosticados dessa forma.

## Nível de autonomia adotado
Baixo, por escolha deliberada: a IA nunca executou comandos diretamente no ambiente do desenvolvedor. Cada arquivo criado, cada comando de terminal e cada instrução SQL foi revisado e aplicado manualmente antes de seguir para o próximo passo. Essa escolha fez sentido porque nenhum dos dois integrantes tinha experiência prévia com Next.js/Supabase, então a compreensão de cada peça durante a construção era mais importante do que a velocidade de um agente autônomo.

## Uso de SDD (Spec-Driven Development)
A especificação (`docs/spec.md`) foi produzida em conjunto com a IA antes de qualquer código: prompt inicial, entidades, papéis, casos de uso com pré/pós-condições, critérios de aceite em Given/When/Then (incluindo o caso de borda do token expirado) e plano de tarefas. O plano de tarefas guiou a ordem real de implementação e, consequentemente, a sequência dos commits no repositório. Esse mesmo critério de aceite (token expirado) foi depois formalizado como teste automatizado (Vitest), fechando o ciclo entre especificação e verificação.

## Guardrail configurado
Hook de pre-commit (Husky) executando `npm run build` antes de qualquer commit ser aceito — bloqueio real testado propositalmente com um erro de TypeScript (evidência em `docs/evidencias/guardrail-bloqueio.png`) e confirmado funcionando após a correção. Complementarmente, foi configurada proteção de branch no GitHub (revisão obrigatória via Pull Request na `main`), usada para revisar a contribuição do segundo integrante antes do merge.

## Onde houve divergência/decisão conjunta
- **Escolha da stack:** no início do projeto não havia linguagem nem framework definidos. A IA sugeriu Next.js + Supabase com base em critérios levantados pela dupla (familiaridade prévia com SQL, prazo disponível, facilidade de deploy); a decisão final e a confirmação foram da dupla.
- **ADR 001** (upload sem login): a IA propôs duas alternativas (RLS anônima vs. rota de API com service role key); a decisão final e o trade-off documentado foram discutidos e escolhidos em conjunto.
- Escopo de funcionalidades extras (PDI, feedback de gestor, disparo automático de e-mail ao candidato em caso de reprovação) foi conscientemente adiado para "próximos passos" após avaliação conjunta de custo x prazo.

## Testes automatizados
Regras de negócio centrais foram extraídas para funções puras (`lib/regras-negocio.ts`) especificamente para viabilizar testes automatizados sem duplicar lógica. Cobertura via Vitest inclui geração de e-mail corporativo, verificação de token expirado (caso de borda da spec) e a regra de aprovação condicionada a todos os documentos aprovados.

## Limitações conhecidas
- Controle de acesso por papel (RH/Gestor) é reforçado na camada de aplicação e parcialmente por RLS; nem toda tabela tem policy de escrita restrita por papel na camada de banco.
- O reenvio de documento reprovado já é suportado pelo sistema (o RH pode aprovar novamente após o candidato reenviar pelo mesmo link, e o novo arquivo substitui o anterior); o aviso ao candidato sobre a reprovação, porém, ainda é manual (feito por fora do sistema), sem disparo automático de e-mail.
