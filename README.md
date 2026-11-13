# TaskFlow — Sistema de Gerenciamento de Tarefas

Projeto desenvolvido com HTML, CSS, JavaScript, Node.js, Express e MySQL.

## 1. Requisitos
- Node.js instalado
- MySQL Server instalado e em execução
- Um navegador atualizado

## 2. Criar o banco de dados
1. Abra o MySQL Workbench (ou outro cliente MySQL).
2. Abra `database/banco_de_dados.sql`.
3. Execute todo o script para criar o banco `gerenciamento_tarefas`, as tabelas e a view.

## 3. Configurar a conexão
1. Na pasta principal, copie `.env.example` e renomeie a cópia para `.env`.
2. Abra o arquivo `.env`.
3. Informe usuário e senha do seu MySQL. Exemplo:
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=sua_senha
   DB_NAME=gerenciamento_tarefas
   PORT=3000

## 4. Instalar e executar
Abra o terminal na pasta do projeto e execute:

```bash
npm install
npm start
```

Acesse no navegador: http://localhost:3000

## 5. Como utilizar
1. A tela inicial é o quadro Kanban.
2. Entre em **Cadastro de usuários** e cadastre nome e e-mail.
3. Entre em **Cadastrar tarefa**, preencha descrição, setor, usuário e prioridade.
4. A tarefa será criada automaticamente com status **A fazer**.
5. No quadro, use os botões de status para mover a tarefa entre as colunas.
6. Use **Editar** para alterar os dados ou **Excluir** para remover após confirmar.

## 6. Estrutura do banco
- `usuarios`: id, nome e email.
- `tarefas`: id, usuario_id, descricao, setor, prioridade, data_cadastro e status.
- `vw_tarefas`: view que reúne a tarefa e os dados do usuário responsável.

A relação é de um para muitos: um usuário pode possuir várias tarefas; cada tarefa pertence a um único usuário.

## 7. Observações
- Os campos de cadastro são obrigatórios.
- O e-mail possui validação no navegador e no servidor.
- O status inicial da tarefa é **A fazer**, definido no banco.
- A exclusão de usuário com tarefas vinculadas é bloqueada para preservar a integridade referencial.
