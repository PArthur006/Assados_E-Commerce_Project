# Roadmap de Arquitetura: Projeto Assados

## Fase 1: Infraestrutura e Blindagem
**Objetivo:** Estabelecer a base de desenvolvimento e produção sem expor credenciais e garantindo que o VSCode se comunique com o MongoDB Atlas com latência mínima. 
**Custo de Oportunidade:** Falhar na segurança aqui significa vazamento de dados. Falhar na configuração de rede significa latência desnecessária entre a sua aplicação e o banco.

| Status | Tarefa Técnica | Justificativa Arquitetural |
| :---: | :--- | :--- |
| [] | Criar Cluster MongoDB Atlas (Tier Gratuito/M0 inicial) | Prover a infraestrutura em nuvem gerenciada. |
| [ ] | Configurar Network Access (IP Whitelist) | Restringir acessos apenas ao seu IP corporativo/pessoal e futura nuvem da aplicação. |
| [ ] | Criar Database User com privilégios mínimos | Evitar uso do usuário root na aplicação. |
| [ ] | Instalar extensão oficial do MongoDB no VSCode | Permitir manipulação de dados e execução de *playgrounds* direto no ambiente de código. |
| [ ] | Configurar `.env` localmente com a URI de conexão | Isolar as credenciais do controle de versão do Git. |

## Fase 2: Modelagem de Documentos (A Zona de Perigo)
**Objetivo:** Projetar as coleções `Catálogo`, `Clientes` e `Pedidos` respeitando a natureza orientada a documentos do MongoDB.
**Custo de Oportunidade:** Documentos com *Unbounded Arrays* (arrays que crescem sem limite) estouram a cota de 16MB do BSON, forçam o banco a mover o documento no disco e destroem a performance da memória RAM. Aninhamento excessivo força varreduras complexas na CPU.

| Status | Tarefa Técnica | Justificativa Arquitetural |
| :---: | :--- | :--- |
| [ ] | Desenhar o Schema BSON do `Catálogo` | Garantir leitura rápida dos produtos em cache/memória. |
| [ ] | Desenhar o Schema BSON de `Clientes` | Evitar embutir todo o histórico de compras no cadastro do cliente. |
| [ ] | Desenhar o Schema BSON de `Pedidos` | Otimizar para alta taxa de inserção (append-only) durante o domingo. |
| [ ] | Validar relações (Embedding vs Referencing) | Decidir o que fica embutido para evitar `$lookup` e o que fica referenciado para evitar duplicação em massa. |

## Fase 3: Indexação e Otimização de I/O
**Objetivo:** Criar estruturas de dados auxiliares (B-Trees) para que o MongoDB não precise ler a coleção inteira para achar um pedido ou cliente.
**Custo de Oportunidade:** Uma query sem índice causa um *Collection Scan* (COLLSCAN). Durante o domingo, ler o disco inteiro para achar um pedido específico consumirá toda a sua CPU e travará o banco para novos clientes.

| Status | Tarefa Técnica | Justificativa Arquitetural |
| :---: | :--- | :--- |
| [ ] | Identificar padrões de leitura do e-commerce | Saber exatamente quais campos a aplicação vai consultar com mais frequência (ex: Status do Pedido). |
| [ ] | Criar índices simples nos campos de busca | Acelerar buscas diretas (ex: CPF do cliente, ID do pedido). |
| [ ] | Criar índices compostos para ordenação | Otimizar buscas com filtros duplos (ex: Status do pedido + Data de criação). |
| [ ] | Analisar Planos de Execução (Explain Plan) | Provar via terminal/VSCode que a query está usando o índice (IXSCAN) e não varrendo o disco (COLLSCAN). |

## Fase 4: Simulação de Pico e Concorrência
**Objetivo:** Estressar o modelo criado para ver como a *engine* WiredTiger lida com múltiplos acessos simultâneos simulando o horário de almoço do final de semana.
**Custo de Oportunidade:** Descobrir contenção de gravação (*write locks*) apenas no dia da inauguração. Se muitos pedidos tentarem atualizar um único documento de "estoque" ao mesmo tempo, as transações vão enfileirar e gerar *timeout*.

| Status | Tarefa Técnica | Justificativa Arquitetural |
| :---: | :--- | :--- |
| [ ] | Criar script de carga de dados fictícios | Popular o banco com milhares de documentos via extensão do VSCode. |
| [ ] | Simular leituras e escritas concorrentes | Testar o comportamento do banco sob pressão de hardware. |
| [ ] | Monitorar o uso de RAM e Disco no Atlas | Garantir que o *Working Set* (dados mais acessados) cabe na memória alocada. |

## Fase 5: Preparação para Extração (Data Engineering & BI)
**Objetivo:** Preparar a arquitetura transacional para o seu futuro pipeline ETL (Python/Pentaho) sem impactar a operação.
**Custo de Oportunidade:** Rodar uma extração analítica pesada no nó primário do banco durante o funcionamento do e-commerce vai derrubar a aplicação.

| Status | Tarefa Técnica | Justificativa Arquitetural |
| :---: | :--- | :--- |
| [ ] | Incluir carimbos de data/hora (`created_at`, `updated_at`) | Permitir extração incremental (apenas dados novos/alterados) no ETL. |
| [ ] | Estabelecer política de exclusão lógica (`is_active`) | Proteger os dados históricos para o BI; nunca aplicar *hard delete* em dados transacionais. |
| [ ] | Planejar a string de conexão do ETL | Configurar `readPreference=secondary` para que o Pentaho/Python leia apenas da réplica