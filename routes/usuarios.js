const express = require('express');
const router = express.Router();
const db = require('../config/db');
function emailValido(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT id, nome, email FROM usuarios ORDER BY nome'
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({
            mensagem: 'Erro ao listar usuários.'
        });
    }
});
router.post('/', async (req, res) => {
    const { nome, email } = req.body;
    if (!nome || !nome.trim() || !email || !email.trim()) {
        return res.status(400).json({
            mensagem: 'Preencha todos os campos.'
        });
    }
    if (!emailValido(email.trim())) {
        return res.status(400).json({
            mensagem: 'Digite um e-mail válido.'
        });
    }
    try {
        const [result] = await db.query(
            'INSERT INTO usuarios (nome, email) VALUES (?, ?)',
            [nome.trim(), email.trim().toLowerCase()]
        );
        res.status(201).json({
            mensagem: 'Cadastro concluído com sucesso.',
            id: result.insertId
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                mensagem: 'Este e-mail já está cadastrado.'
            });
        }
        res.status(500).json({
            mensagem: 'Erro ao cadastrar usuário.'
        });
      }
});
module.exports = router;
