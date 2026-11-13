# TaskFlow — Sistema de Gerenciamento de Tarefas

## Sobre o projeto

O **TaskFlow** é um sistema de gerenciamento de tarefas desenvolvido como parte da avaliação prática do SAEP.

O objetivo do sistema é facilitar a organização e o acompanhamento de atividades, permitindo cadastrar usuários, registrar tarefas e acompanhar seu andamento por meio de um quadro Kanban.

As tarefas são organizadas em três etapas:

- **A fazer:** tarefas que ainda não foram iniciadas.
- **Fazendo:** tarefas que estão em andamento.
- **Pronto:** tarefas que foram concluídas.

## Funcionalidades

- Cadastro de usuários.
- Cadastro de tarefas vinculadas a usuários.
- Listagem de tarefas em formato Kanban.
- Organização das tarefas por status.
- Edição de tarefas cadastradas.
- Exclusão de tarefas.
- Alteração do status das tarefas.
- Definição de prioridade: baixa, média ou alta.
- Armazenamento das informações no banco de dados MySQL.

## Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript
- Node.js
- Express
- MySQL

## Estrutura do projeto

    prepara_SAEP/
    │
    ├── config/
    │   └── db.js
    │
    ├── database/
    │   └── banco_de_dados.sql
    │
    ├── diagramas/
    │   ├── DER_SAEP.png
    │   └── Caso_De_Uso.png
    │
    ├── public/
    │   ├── css/
    │   │   └── style.css
    │   ├── js/
    │   │   └── app.js
    │   └── index.html
    │
    ├── routes/
    │   ├── tarefas.js
    │   └── usuarios.js
    │
    ├── server.js
    └── README.md

## Como executar o projeto

### 1. Pré-requisitos

Antes de iniciar, é necessário ter instalado:

- Node.js
- MySQL
- Visual Studio Code ou outro editor de código.

### 2. Configuração do banco de dados

1. Abra o MySQL.
2. Execute o arquivo `database/banco_de_dados.sql`.
3. Confira se o banco de dados e as tabelas foram criados corretamente.

### 3. Configuração da conexão

Verifique as informações de conexão com o banco de dados no arquivo `config/db.js`.

Configure o acesso de acordo com os dados do seu MySQL.

### 4. Instalação das dependências

Abra o terminal na pasta principal do projeto e execute:

    npm install

Caso ainda não tenha as dependências instaladas, utilize:

    npm install express mysql2 dotenv

### 5. Inicialização do sistema

No terminal, execute:

    node server.js

Após iniciar o servidor, acesse pelo navegador:

    http://localhost:3000

## Banco de dados

O sistema utiliza o MySQL para armazenar os dados.

As principais entidades são:

- **Usuários:** armazenam as informações dos usuários cadastrados.
- **Tarefas:** armazenam as informações das atividades, incluindo descrição, setor, prioridade, status e o usuário responsável.

Um usuário pode possuir várias tarefas, enquanto cada tarefa está vinculada a um único usuário.

O projeto também utiliza uma visualização (`vw_tarefas`) para consultar as tarefas com as informações relacionadas.

## Diagramas

Os diagramas do projeto estão disponíveis na pasta `diagramas`:

- Diagrama Entidade-Relacionamento (DER).
- Diagrama de Caso de Uso.

## Objetivo da avaliação

Desenvolver um sistema funcional de gerenciamento de tarefas, aplicando conhecimentos de desenvolvimento web, integração com banco de dados, operações CRUD e organização de atividades utilizando o método Kanban.

**Projeto desenvolvido para fins educacionais — SAEP.**
