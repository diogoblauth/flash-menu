# FlashMenu

## O que é este projeto

Sistema web onde restaurantes, lanchonetes e bares cadastram seu cardápio e recebem um QR code único. O cliente escaneia o QR com o celular e vê o cardápio completo — sem instalar app, sem criar conta, sem fricção nenhuma.

O restaurante gerencia tudo por um painel administrativo simples: cadastra pratos, organiza categorias, faz upload de fotos, ativa/desativa itens e personaliza a aparência da vitrine pública.

O nome do produto é **FlashMenu**. Ele aparece no título da aba do painel administrativo, no `<title>` da página de login/cadastro, e no e-mail de boas-vindas enviado após o cadastro. Na vitrine pública do restaurante, o nome FlashMenu **não aparece** — a experiência deve ser inteiramente da marca do estabelecimento.

---

## Contexto de negócio

O público-alvo são pequenos estabelecimentos brasileiros (restaurantes, lanchonetes, bares, cafeterias) que hoje usam cardápio físico impresso ou mandam foto do cardápio no WhatsApp. O produto resolve dois problemas reais:

1. **Atualização custosa**: cardápio impresso é difícil de atualizar quando o preço muda ou o item acaba.
2. **Experiência ruim para o cliente**: foto de cardápio no celular é pequena e difícil de ler.

A proposta de valor é: o restaurante cola o QR no balcão ou na mesa uma única vez, e a partir daí atualiza o cardápio direto pelo painel — sem reimprimir nada.

---

## Usuários do sistema

**Restaurante (usuário autenticado)**
Acessa o painel administrativo. Cadastra e edita o cardápio, faz upload de fotos, configura a aparência da vitrine e baixa o QR code para impressão. Cada restaurante só enxerga e edita seus próprios dados.

**Cliente final (usuário anônimo)**
Escaneia o QR code ou acessa o link direto. Vê o cardápio público sem precisar criar conta ou instalar nada. Não interage com o sistema além de visualizar.

---

## Fluxo principal de uso

1. Restaurante cria conta com e-mail e senha.
2. Sistema gera automaticamente um slug único a partir do nome (ex: "Pizzaria Roma" → `pizzaria-roma`).
3. Restaurante configura o perfil: nome, descrição, logo, horário de funcionamento e cor primária da vitrine.
4. Restaurante cria categorias (ex: Entradas, Pizzas, Bebidas, Sobremesas).
5. Restaurante cadastra os itens de cada categoria com nome, descrição, preço e foto.
6. Sistema disponibiliza a vitrine pública em `/<slug>` e o QR code para download em PNG.
7. Restaurante imprime o QR e coloca na mesa ou balcão.
8. Cliente escaneia → vê o cardápio no celular, sem nenhum passo adicional.

---

## Regras de negócio

### Slug
- Gerado automaticamente no cadastro a partir do nome do restaurante.
- Convertido para lowercase, espaços viram hífens, caracteres especiais são removidos.
- Deve ser único no sistema. Se já existir, um sufixo numérico é adicionado (ex: `pizzaria-roma-2`).
- Não pode ser alterado após o cadastro (garante que QR codes impressos continuem válidos).

### Itens do cardápio
- Um item pode estar **ativo** (visível no cardápio) ou **inativo** (aparece como "Esgotado" com visual diferente, mas não é deletado).
- Itens inativos continuam no banco — o restaurante pode reativá-los sem recadastrar.
- Foto é opcional. Item sem foto exibe um placeholder.
- Preço é obrigatório e sempre positivo.
- Cada item pertence a uma categoria, mas a categoria é opcional (item pode ficar sem categoria).

### Categorias
- Cada restaurante define suas próprias categorias.
- A ordem das categorias define a ordem de exibição no cardápio público.
- Não é possível deletar uma categoria que ainda tem itens vinculados.

### Cor primária
- Cada restaurante escolhe uma cor hexadecimal para personalizar sua vitrine pública.
- Essa cor é aplicada nos elementos de destaque do cardápio (pills de categoria, preços, botões).
- Valor padrão caso o restaurante não configure: um tom neutro escuro.

### QR Code
- Aponta sempre para a URL pública do cardápio do restaurante.
- É gerado pelo sistema e disponibilizado como imagem PNG para download.
- Não muda enquanto o slug não muda.

### Visibilidade pública
- A vitrine pública é sempre acessível, mesmo que o restaurante não tenha itens cadastrados (exibe estado vazio).
- Não há mecanismo de "despublicar" o cardápio nesta versão — a vitrine fica sempre online enquanto a conta existir.

---

## Comportamentos esperados da interface

### Painel administrativo (área logada)

- O painel exibe sempre o link da vitrine pública e um botão de cópia.
- O QR code é exibido no painel e pode ser baixado em PNG com um clique.
- Ao ativar/desativar um item, a mudança reflete imediatamente no cardápio público (sem necessidade de "publicar").
- O restaurante consegue reordenar categorias e itens arrastando (sortOrder atualizado no backend).
- Upload de foto: preview antes de salvar, limite de 2MB, formatos aceitos: JPEG, PNG e WebP.

### Cardápio público (vitrine)

- Carrega sem estado de loading longo — os dados chegam em uma única requisição.
- Pills de categoria fixas no topo durante o scroll, facilitando a navegação.
- Ao clicar numa category pill, a lista rola até a seção correspondente.
- Itens esgotados (inativos) aparecem no final de cada categoria, com opacidade reduzida e badge "Esgotado".
- A cor primária do restaurante é aplicada via CSS custom property após a resposta da API.
- A página tem meta tags Open Graph com nome, descrição e logo do restaurante — ao compartilhar o link no WhatsApp, aparece preview correto.
- **Nenhuma menção ao FlashMenu aparece na vitrine** — sem rodapé, sem watermark, sem "Powered by". A experiência é 100% da marca do estabelecimento.

---

## Onde o nome FlashMenu aparece (e onde não aparece)

| Contexto | Exibe FlashMenu? |
|---|---|
| `<title>` das páginas de login e cadastro | ✅ Sim |
| Título da aba do painel administrativo | ✅ Sim |
| E-mail de boas-vindas após cadastro | ✅ Sim |
| Vitrine pública do restaurante | ❌ Não |
| QR code gerado para impressão | ❌ Não |
| Meta tags Open Graph da vitrine | ❌ Não |

---

## O que este projeto não faz (escopo intencional)

- **Sem pedidos online**: o cliente não faz pedido pelo sistema, apenas consulta o cardápio.
- **Sem pagamento**: nenhuma integração com gateway de pagamento.
- **Sem multi-idioma**: o sistema é inteiramente em português.
- **Sem planos/assinaturas**: todos os restaurantes têm as mesmas funcionalidades, sem tier pago.
- **Sem analytics**: não há rastreamento de visitas ou cliques nesta versão.
- **Sem notificações**: o restaurante não é notificado de nada.
- **Sem histórico de preços**: alterações de preço não são versionadas.

Estas limitações são intencionais para manter o escopo manejável. Funcionalidades futuras possíveis: pedidos, analytics de visitas, múltiplos usuários por restaurante, planos com limite de itens.

---

## Decisões de produto relevantes para o desenvolvimento

**Por que o slug não pode mudar?**
Restaurantes imprimem o QR code em cardápios físicos, adesivos e banners. Se o slug mudasse, todos os QR codes impressos deixariam de funcionar. Por isso o slug é imutável após o cadastro.

**Por que itens inativos não são deletados?**
O restaurante pode desativar um item temporariamente (ex: item esgotado hoje, disponível amanhã). Deletar e recadastrar seria trabalhoso. O toggle de disponibilidade é a solução correto.

**Por que a cor é um hex livre e não uma paleta pré-definida?**
Restaurantes já têm identidade visual definida (logo, material impresso). Forçar uma paleta limitada cria conflito com a marca do cliente. O hex livre dá liberdade real.

**Por que o cardápio público não tem paginação?**
A maioria dos cardápios de pequenos estabelecimentos tem entre 10 e 50 itens. Paginação adicionaria complexidade sem benefício real para este perfil de usuário.

**Por que o FlashMenu não aparece na vitrine pública?**
A vitrine é a cara do restaurante para o cliente final. Inserir branding do produto nesse espaço comprometeria a identidade visual do estabelecimento e adicionaria ruído para o consumidor, que não precisa saber por qual plataforma o cardápio é servido.
