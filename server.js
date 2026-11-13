const express = require('express');
const path = require('path');
require('dotenv').config();
const db = require('./config/db');
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/tarefas', require('./routes/tarefas'));
app.get('/api/health', async (req, res) => {
    try {
        await db.query('SELECT 1');
        res.json({
            status: 'ok',
            banco: 'conectado'
        });
    } catch (error) {
        res.status(500).json({
            status: 'erro',
            banco: 'desconectado'
        });
    }
});
app.use('/api', (req, res) => {
    res.status(404).json({
        mensagem: 'Rota da API não encontrada.'
    });
});
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.listen(PORT, () => {
    console.log(`Sistema disponível em http://localhost:${PORT}`);
});
