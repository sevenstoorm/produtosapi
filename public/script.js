// ========================================
// VARIÁVEIS GLOBAIS
// ========================================

let produtoEmEdicao = null;

// ========================================
// FUNÇÕES AUXILIARES
// ========================================

// Mostra uma mensagem modal
function mostrarMensagem(mensagem, tipo = 'info') {
    const modal = document.getElementById('modalMessage');
    const modalText = document.getElementById('modalText');
    
    modalText.textContent = mensagem;
    modal.style.display = 'flex';
    
    // Define a cor baseado no tipo
    if (tipo === 'sucesso') {
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    } else if (tipo === 'erro') {
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    }
}

// Fecha o modal de mensagens
function fecharModal() {
    document.getElementById('modalMessage').style.display = 'none';
}

// Limpa o formulário
function limparFormulario() {
    document.getElementById('clientForm').reset();
    produtoEmEdicao = null;
    document.querySelector('.form-section h2').textContent = 'Adicionar ou Editar Produto';
}

// Formata Preco para exibição
function formatarPreco(Preco) {
    if (!Preco) return '';
    return Preco.toFixed(2).replace('.', ',');
}

// Formata estoque para exibição
function formatarEstoque(estoque) {
    if (!estoque) return '';
    return estoque.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// ========================================
// OPERAÇÕES COM A API
// ========================================

// Busca todos os clientes
async function carregarProdutos() {
    const loadingMessage = document.getElementById('loadingMessage');
    const emptyMessage = document.getElementById('emptyMessage');
    const produtosList = document.getElementById('produtosList');
    
    loadingMessage.style.display = 'block';
    produtosList.innerHTML = '';
    
    try {
        const resposta = await fetch('/produtos');
        
        if (!resposta.ok) {
            throw new Error('Erro ao buscar produtos');
        }
        
        const produtos = await resposta.json();
        loadingMessage.style.display = 'none';
        
        if (produtos.length === 0) {
            emptyMessage.style.display = 'block';
            produtosList.innerHTML = '';
        } else {
            emptyMessage.style.display = 'none';
            exibirTabela(produtos);
        }
    } catch (erro) {
        loadingMessage.style.display = 'none';
        emptyMessage.style.display = 'block';
        console.error('Erro:', erro);
        mostrarMensagem('Erro ao carregegar os produtos. Tente novamente.', 'erro');
    }
}

// Cria um novo produto
async function criarProduto(dados) {
    try {
        const resposta = await fetch('/produtos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });
        
        if (!resposta.ok) {
            const erro = await resposta.json();
            throw new Error(erro.error || 'Erro ao criar produto');
        }
        
        const novoProduto = await resposta.json();
        mostrarMensagem('Produto cadastrado com sucesso!', 'sucesso');
        limparFormulario();
        carregarProdutos();
    } catch (erro) {
        console.error('Erro:', erro);
        mostrarMensagem('Erro: ' + erro.message, 'erro');
    }
}

// Atualiza um produto
async function atualizarProduto(id, dados) {
    try {
        const resposta = await fetch(`/produtos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });
        
        if (!resposta.ok) {
            const erro = await resposta.json();
            throw new Error(erro.error || 'Erro ao atualizar produto');
        }
        
        const produtoAtualizado = await resposta.json();
        mostrarMensagem('Produto atualizado com sucesso!', 'sucesso');
        limparFormulario();
        carregarProdutos();
        
    } catch (erro) {
        console.error('Erro:', erro);
        mostrarMensagem('Erro: ' + erro.message, 'erro');
    }
}

// Deleta um produto
async function deletarProduto(id) {
    if (!confirm('Tem certeza que deseja deletar este produto?')) {
        return;
    }
    
    try {
        const resposta = await fetch(`/produtos/${id}`, {
            method: 'DELETE'
        });
        
        if (!resposta.ok) {
            const erro = await resposta.json();
            throw new Error(erro.error || 'Erro ao deletar produto');
        }
        
        mostrarMensagem('Produto removido com sucesso!', 'sucesso');
        carregarProdutos();
        
    } catch (erro) {
        console.error('Erro:', erro);
        mostrarMensagem('Erro: ' + erro.message, 'erro');
    }
}

// ========================================
// EXIBIÇÃO DE DADOS
// ========================================

// Exibe a tabela de produtos
function exibirTabela(produtos) {
    const produtosList = document.getElementById('produtosList');
    let html = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Preço</th>
                    <th>Estoque</th>
                    <th>Categoria</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
    `;
    produtos.forEach(produto => {
        html += `
            <tr>
                <td>#${produto.id}</td>
                <td>${produto.nome}</td>
                <td>R$ ${parseFloat(produto.preco).toFixed(2)}</td>
                <td>${produto.estoque}</td>
                <td>${produto.categoria}</td>
                <td class="acoes">
                    <button class="btn btn-edit" onclick="editarProduto(${produto.id}, '${produto.nome}', ${produto.preco}, ${produto.estoque}, '${produto.categoria}')">✏️ Editar</button>
                    <button class="btn btn-danger" onclick="deletarProduto(${produto.id})">🗑️ Deletar</button>
                </td>
            </tr>
        `;
    });
    html += `
            </tbody>
        </table>
    `;
    produtosList.innerHTML = html;
}

// Carrega os dados do produto no formulário para edição
function editarProduto(id, nome, preco, estoque, categoria) {
    produtoEmEdicao = id;
    document.getElementById('nome').value = nome;
    document.getElementById('preco').value = preco;
    document.getElementById('estoque').value = estoque;
    document.getElementById('categoria').value = categoria;
    document.querySelector('.form-section h2').textContent = `Editando Produto #${id}`;
    // Scroll até o formulário
    document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
}

// ========================================
// BUSCA E FILTRO
// ========================================

// Busca produtos no backend
async function buscarProdutos(tipo, valor) {
    const loadingMessage = document.getElementById('loadingMessage');
    const emptyMessage = document.getElementById('emptyMessage');
    const produtosList = document.getElementById('produtosList');
   
    loadingMessage.style.display = 'block';
    produtosList.innerHTML = '';
   
    try {
        let url = '';

        if (tipo === 'nome') {
            url = `/produtos/nome/${encodeURIComponent(valor)}`;
        } else if (tipo === 'id') {
            url = `/produtos/${valor}`;
        }

        const resposta = await fetch(url);
       
        if (!resposta.ok) {
            throw new Error('Erro ao buscar produtos');
        }
       
        let produtos = await resposta.json();

        if (!Array.isArray(produtos)) {
            produtos = produtos ? [produtos] : [];
        }

        loadingMessage.style.display = 'none';
       
        if (produtos.length === 0) {
            emptyMessage.style.display = 'block';
            produtosList.innerHTML = '';
        } else {
            emptyMessage.style.display = 'none';
            exibirTabela(produtos);
        }
    } catch (erro) {
        loadingMessage.style.display = 'none';
        emptyMessage.style.display = 'block';
        console.error('Erro:', erro);
        mostrarMensagem('Erro ao buscar os produtos. Tente novamente.', 'erro');
    }
}

// Filtra produtos pela busca (agora busca no backend)
function filtrarProdutos() {
    const searchInput = document.getElementById('searchInput');
    const searchType = document.getElementById('searchType');
    const valor = searchInput.value.trim();
    
    if (valor === '') {
        // Se vazio, carrega todos
        carregarProdutos();
    } else {
        // Busca no backend
        buscarProdutos(searchType.value, valor);
    }
}

// ========================================
// EVENT LISTENERS
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // Carrega os produtos ao abrir a página
    carregarProdutos();
    
    // Formulário de envio
    document.getElementById('clientForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const nome = document.getElementById('nome').value.trim();
        const preco = document.getElementById('preco').value.trim();
        const estoque = document.getElementById('estoque').value.trim();
        const categoria = document.getElementById('categoria').value.trim();
        // Validação básica
        if (!nome || !preco || !estoque || !categoria) {
            mostrarMensagem('Por favor, preencha todos os campos!', 'erro');
            return;
        }
        const dados = { nome, preco, estoque, categoria };
        if (produtoEmEdicao) {
            atualizarProduto(produtoEmEdicao, dados);
        } else {
            criarProduto(dados);
        }
    });
    
    // Botão Limpar Formulário
    document.getElementById('btnLimpar').addEventListener('click', limparFormulario);
    
    // Botão Recarregar Lista
    document.getElementById('btnRecarregar').addEventListener('click', carregarProdutos);
    
    // Botão Buscar
    document.getElementById('btnBuscar').addEventListener('click', filtrarProdutos);
    
    // Busca em tempo real (opcional, pode ser removido se quiser apenas botão)
    document.getElementById('searchInput').addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            filtrarProdutos();
        }
    });
    
    // Fechar modal ao clicar fora
    document.getElementById('modalMessage').addEventListener('click', function(e) {
        if (e.target === this) {
            fecharModal();
        }
    });
});