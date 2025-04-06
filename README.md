README   link:https://d2wk73bhxwtu9d.cloudfront.net/

Este repositório é o front-end de um sistema de PDV (ponto de venda), construído com React + Vite. Utilizei algumas bibliotecas como Framer Motion e Tailwind CSS para facilitar a construção visual da aplicação.

Na página inicial, as comandas abertas são exibidas no painel da esquerda, enquanto o painel da direita mostra os detalhes das comandas existentes ou em criação. Ao clicar em uma comanda, é possível editá-la de diferentes formas: alterar o nome, modificar as quantidades e gerenciar os produtos.

Assim que uma comanda é aberta, uma faixa aparece na parte inferior da tela, apresentando o valor total da comanda e um botão para fechamento. Ao clicar nesse botão, o usuário pode escolher fechar ou não a comanda, se não fechada ela fica pendente no sistema, se confirmado o fechamento o usuário é redirecionado para a aba de pagamentos, onde pode selecionar diferentes formas de pagamento (não limitado a apenas uma por comanda). Após o registro correto do pagamento, uma nota fiscal fictícia é exibida.

Ainda na tela inicial, há uma barra lateral direita (acessada através do ícone de engrenagem no canto superior direito) com duas seções principais:
	•	Operações do PDV: abertura de caixa, suplemento, sangria, fechamento e histórico de notas. Essas funcionalidades são vitais para o funcionamento correto do sistema, incluindo os registros de faturamento diário.
	•	Cozinha: exibe os pedidos em andamento e os finalizados. Apenas produtos que necessitam de preparo na cozinha são mostrados, seguindo uma regra de negócio pré-estabelecida.

Também existem avisos e mensagens de erro que podem surgir durante o uso do sistema, com o objetivo de reduzir falhas e guiar o usuário em suas operações.

Este front-end está hospedado na AWS, utilizando integração via S3 e CloudFront (desculpe pelo link extenso!), mantendo o bucket seguro.

O sistema está conectado à minha API REST em Spring Boot (veja o repositório pdv), responsável pelo gerenciamento das requisições, formatação e acesso aos dados armazenados em um banco PostgreSQL — facilitando assim a exibição dos dados no front-end. Para mais detalhes, consulte o README do repositório da API.
