const API = '/api';
let tarefaEditando = null;

function elemento(id) {
    return document.getElementById(id);
}

async function requisicao(url, opcoes = {}) {

    const resposta = await fetch(url, {
        headers: {
            'Content-Type': 'application/json'
        },
        ...opcoes
    });

    const texto = await resposta.text();

    let dados;

    try {
        dados = texto ? JSON.parse(texto) : {};
    } catch (erro) {
        throw new Error('O servidor não retornou JSON. Verifique se o backend está funcionando e se a rota da API está correta.');
    }

    if (!resposta.ok) {
        throw new Error(dados.mensagem || 'Erro ao realizar a operação.');
    }

    return dados;
}
function mensagem(texto) {
    alert(texto);
}
function mostrarPagina(pagina) {
    document.querySelectorAll('.pagina').forEach(function (item) {
        item.style.display = 'none';
    });
    elemento(pagina).style.display = 'block';
    if (pagina === 'usuarios') {
        carregarUsuarios();
    }
    if (pagina === 'tarefas') {
        carregarUsuariosSelect();
    }
    if (pagina === 'gerenciar') {
        carregarTarefas();
    }
}
function protegerTexto(texto) {

    return String(texto ?? '').replace(/[&<>"']/g, function (caractere) {

        const caracteres = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return caracteres[caractere];
    });
}
elemento('formUsuario').addEventListener('submit', async function (evento) {
    evento.preventDefault();
    const nome = elemento('nome').value.trim();
    const email = elemento('email').value.trim();
    if (!nome || !email) {
        mensagem('Preencha todos os campos!');
        return;
    }
    try {
        const resultado = await requisicao(API + '/usuarios', {
            method: 'POST',

            body: JSON.stringify({
                nome: nome,
                email: email
            })
        });
        mensagem(resultado.mensagem || 'Usuário cadastrado com sucesso!');
        elemento('formUsuario').reset();
        carregarUsuarios();
    } catch (erro) {
        mensagem(erro.message);
    }
});
async function carregarUsuarios() {
    try {
        const usuarios = await requisicao(API + '/usuarios');
        let tabela = '';
        usuarios.forEach(function (usuario) {
            tabela += `
                <tr>
                    <td>${protegerTexto(usuario.id)}</td>
                    <td>${protegerTexto(usuario.nome)}</td>
                    <td>${protegerTexto(usuario.email)}</td>
                </tr>
            `;
        });
        if (usuarios.length === 0) {
            tabela = '<tr><td colspan="3">Nenhum usuário cadastrado.</td></tr>';
        }
        elemento('listaUsuarios').innerHTML = tabela;
    } catch (erro) {
        mensagem(erro.message);
    }
}
async function carregarUsuariosSelect(selecionado = '') {
    try {
        const usuarios = await requisicao(API + '/usuarios');
        let opcoes = '<option value="">Selecione um usuário</option>';
        usuarios.forEach(function (usuario) {
            opcoes += `
                <option value="${protegerTexto(usuario.id)}"
                    ${String(usuario.id) === String(selecionado) ? 'selected' : ''}>
                    ${protegerTexto(usuario.nome)}
                </option>
            `;
        });
        elemento('usuario').innerHTML = opcoes;
    } catch (erro) {
        mensagem(erro.message);
    }
}
elemento('formTarefa').addEventListener('submit', async function (evento) {
    evento.preventDefault();
    const descricao = elemento('descricao').value.trim();
    const setor = elemento('setor').value.trim();
    const usuario = elemento('usuario').value;
    const prioridade = elemento('prioridade').value;
    if (!descricao || !setor || !usuario || !prioridade) {
        mensagem('Preencha todos os campos!');
        return;
    }
    const dados = {
        usuario_id: usuario,
        descricao: descricao,
        setor: setor,
        prioridade: prioridade
    };
    let url = API + '/tarefas';
    let metodo = 'POST';
    if (tarefaEditando !== null) {
        url += '/' + tarefaEditando;
        metodo = 'PUT';
        dados.status = elemento('formTarefa').dataset.status || 'A fazer';
    }
    try {
        const resultado = await requisicao(url, {
            method: metodo,
            body: JSON.stringify(dados)
        });
        if (tarefaEditando !== null) {
            mensagem('Tarefa atualizada com sucesso!');
        } else {
            mensagem(resultado.mensagem || 'Tarefa cadastrada com sucesso!');
        }
        cancelarEdicao();
        mostrarPagina('gerenciar');
    } catch (erro) {
        mensagem(erro.message);
    }
});
function cancelarEdicao() {
    elemento('formTarefa').reset();
    tarefaEditando = null;
    elemento('botaoTarefa').textContent = 'Cadastrar';
    elemento('cancelarEdicao').style.display = 'none';
    delete elemento('formTarefa').dataset.status;
}
async function carregarTarefas() {
    try {
        const tarefas = await requisicao(API + '/tarefas');
        elemento('listaAFazer').innerHTML = '';
        elemento('listaFazendo').innerHTML = '';
        elemento('listaPronto').innerHTML = '';
        tarefas.forEach(function (tarefa) {
            const cartao = criarCartao(tarefa);
            if (tarefa.status === 'A fazer') {
                elemento('listaAFazer').innerHTML += cartao;
            } else if (tarefa.status === 'Fazendo') {
                elemento('listaFazendo').innerHTML += cartao;
            } else if (tarefa.status === 'Pronto') {
                elemento('listaPronto').innerHTML += cartao;
            }
        });
        if (elemento('listaAFazer').innerHTML === '') {
            elemento('listaAFazer').innerHTML = '<p class="vazio">Nenhuma tarefa.</p>';
        }
        if (elemento('listaFazendo').innerHTML === '') {
            elemento('listaFazendo').innerHTML = '<p class="vazio">Nenhuma tarefa.</p>';
        }
        if (elemento('listaPronto').innerHTML === '') {
            elemento('listaPronto').innerHTML = '<p class="vazio">Nenhuma tarefa.</p>';
        }
    } catch (erro) {
        mensagem(erro.message);
    }
}
function criarCartao(tarefa) {
    const data = tarefa.data_cadastro
        ? new Date(tarefa.data_cadastro).toLocaleDateString('pt-BR')
        : 'Não informada';
    return `
        <div class="cartao">
            <p><strong>Descrição:</strong> ${protegerTexto(tarefa.descricao)}</p>
            <p><strong>Setor:</strong> ${protegerTexto(tarefa.setor)}</p>
            <p><strong>Prioridade:</strong> ${protegerTexto(tarefa.prioridade)}</p>
            <p><strong>Vinculado a:</strong> ${protegerTexto(tarefa.usuario_nome || tarefa.nome_usuario || tarefa.usuario_id)}</p>
            <p><strong>Data:</strong> ${protegerTexto(data)}</p>
            <button onclick="editarTarefa(${Number(tarefa.id)})">
                Editar
            </button>
            <button class="excluir" onclick="excluirTarefa(${Number(tarefa.id)})">
                Excluir
            </button>
            <hr>
            <p><strong>Alterar status:</strong></p>
            <button onclick="alterarStatus(${Number(tarefa.id)}, 'A fazer')">
                A fazer
            </button>
            <button onclick="alterarStatus(${Number(tarefa.id)}, 'Fazendo')">
                Fazendo
            </button>
            <button onclick="alterarStatus(${Number(tarefa.id)}, 'Pronto')">
                Pronto
            </button>
        </div>
    `;
}
async function editarTarefa(id) {
    try {
        const tarefa = await requisicao(API + '/tarefas/' + id);
        tarefaEditando = id;
        elemento('descricao').value = tarefa.descricao;
        elemento('setor').value = tarefa.setor;
        elemento('prioridade').value = tarefa.prioridade;
        elemento('formTarefa').dataset.status = tarefa.status;
        await carregarUsuariosSelect(tarefa.usuario_id);
        elemento('botaoTarefa').textContent = 'Salvar alterações';
        elemento('cancelarEdicao').style.display = 'inline-block';
        mostrarPagina('tarefas');
        await carregarUsuariosSelect(tarefa.usuario_id);
    } catch (erro) {
        mensagem(erro.message);
    }
}
async function excluirTarefa(id) {
    const confirmar = confirm('Deseja realmente excluir esta tarefa?');
    if (!confirmar) {
        return;
    }
    try {
        const resultado = await requisicao(API + '/tarefas/' + id, {
            method: 'DELETE'
        });
        mensagem(resultado.mensagem || 'Tarefa excluída com sucesso!');
        carregarTarefas();
    } catch (erro) {
        mensagem(erro.message);
    }
}
async function alterarStatus(id, status) {
    try {
        const resultado = await requisicao(API + '/tarefas/' + id + '/status', {
            method: 'PATCH',
            body: JSON.stringify({
                status: status
            })
        });
        mensagem(resultado.mensagem || 'Status atualizado com sucesso!');
        carregarTarefas();
    } catch (erro) {
        mensagem(erro.message);
    }

}
carregarUsuarios();
carregarTarefas();
