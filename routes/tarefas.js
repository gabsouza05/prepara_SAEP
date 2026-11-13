const express = require('express');
const router = express.Router();
const db = require('../config/db');
const prioridades = ['Baixa', 'Média', 'Alta'];
const statusValidos = ['A fazer', 'Fazendo', 'Pronto'];
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM vw_tarefas ORDER BY data_cadastro DESC'
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({
            mensagem: 'Erro ao listar tarefas.'
        });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM vw_tarefas WHERE id = ?',
            [req.params.id]
        );
        if (rows.length === 0) {
            return res.status(404).json({
                mensagem: 'Tarefa não encontrada.'
            });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({
            mensagem: 'Erro ao buscar tarefa.'
        });
    }
});
router.post('/', async (req, res) => {
    const { usuario_id, descricao, setor, prioridade } = req.body;
    if (
        !usuario_id ||
        !descricao ||
        !descricao.trim() ||
        !setor ||
        !setor.trim() ||
        !prioridades.includes(prioridade)
    ) {
        return res.status(400).json({
            mensagem: 'Preencha todos os campos corretamente.'
        });

    }
    try {
        const [result] = await db.query(
            `INSERT INTO tarefas
            (usuario_id, descricao, setor, prioridade)
            VALUES (?, ?, ?, ?)`,
            [usuario_id, descricao.trim(), setor.trim(), prioridade]
        );
        res.status(201).json({
            mensagem: 'Cadastro concluído com sucesso.',
            id: result.insertId
        });
    } catch (error) {
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(400).json({
                mensagem: 'Selecione um usuário cadastrado.'
            });
        }
        res.status(500).json({
            mensagem: 'Erro ao cadastrar tarefa.'
        });
    }
});
router.put('/:id', async (req, res) => {
    const { usuario_id, descricao, setor, prioridade, status } = req.body;
    if (
        !usuario_id ||
        !descricao ||
        !descricao.trim() ||
        !setor ||
        !setor.trim() ||
        !prioridades.includes(prioridade) ||
        !statusValidos.includes(status)
    ) {
        return res.status(400).json({
            mensagem: 'Preencha todos os campos corretamente.'
        });
    }
    try {
        const [result] = await db.query(
            `UPDATE tarefas
            SET usuario_id = ?, descricao = ?, setor = ?,
            prioridade = ?, status = ?
            WHERE id = ?`,
            [
                usuario_id,
                descricao.trim(),
                setor.trim(),
                prioridade,
                status,
                req.params.id
            ]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({
                mensagem: 'Tarefa não encontrada.'
            });
        }
        res.json({
            mensagem: 'Tarefa atualizada com sucesso.'
        });
    } catch (error) {
        res.status(500).json({
            mensagem: 'Erro ao atualizar tarefa.'
        });
    }
});
router.patch('/:id/status', async (req, res) => {
    const { status } = req.body;
    if (!statusValidos.includes(status)) {
        return res.status(400).json({
            mensagem: 'Status inválido.'
        });
    }
    try {
        const [result] = await db.query(
            'UPDATE tarefas SET status = ? WHERE id = ?',
            [status, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({
                mensagem: 'Tarefa não encontrada.'
            });
        }
        res.json({
            mensagem: 'Status atualizado com sucesso.'
        });
    } catch (error) {
        res.status(500).json({
            mensagem: 'Erro ao atualizar status.'
        });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query(
            'DELETE FROM tarefas WHERE id = ?',
            [req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({
                mensagem: 'Tarefa não encontrada.'
            });
          }
        res.json({
            mensagem: 'Tarefa excluída com sucesso.'
        });
    } catch (error) {
        res.status(500).json({
            mensagem: 'Erro ao excluir tarefa.'
        });
    }
});
module.exports = router;
