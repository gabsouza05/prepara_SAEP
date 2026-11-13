-- Banco de dados: gerenciamento_tarefas
CREATE DATABASE IF NOT EXISTS gerenciamento_tarefas
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE gerenciamento_tarefas;

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    email VARCHAR(160) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS tarefas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    descricao VARCHAR(500) NOT NULL,
    setor VARCHAR(120) NOT NULL,
    prioridade ENUM('Baixa', 'Média', 'Alta') NOT NULL,
    data_cadastro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status ENUM('A fazer', 'Fazendo', 'Pronto') NOT NULL DEFAULT 'A fazer',
    CONSTRAINT fk_tarefas_usuarios
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
      ON UPDATE CASCADE ON DELETE RESTRICT
);

-- Consulta de tarefas com o nome do usuário responsável
CREATE OR REPLACE VIEW vw_tarefas AS
SELECT
    t.id,
    t.usuario_id,
    t.descricao,
    t.setor,
    t.prioridade,
    t.data_cadastro,
    t.status,
    u.nome AS usuario_nome,
    u.email AS usuario_email
FROM tarefas t
INNER JOIN usuarios u ON u.id = t.usuario_id;

-- Exemplos opcionais para teste:
-- INSERT INTO usuarios (nome, email) VALUES ('Ana Souza', 'ana@email.com');
-- INSERT INTO tarefas (usuario_id, descricao, setor, prioridade)
-- VALUES (1, 'Conferir estoque', 'Estoque', 'Alta');
