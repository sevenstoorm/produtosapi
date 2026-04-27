// ========================================
// ESTADO GLOBAL
// ========================================
let produtoEmEdicao = null;

// ========================================
// UTILIDADES
// ========================================
function mostrarMensagem(texto) {
    const modal = document.getElementById('modalMessage');
    document.getElementById('modalText').textContent = texto;
    modal.style.display = 'flex';
}

function fecharModal() {
    document.getElementById('modalMessage').style.display = 'none';
}

function limparFormulario() {
    document.getElementById('clientForm').reset();
    produtoEmEdicao = null;
    document.querySelector('.form-section h2').textContent = 'Adicionar Produto';
}

// ========================================
// API
// ========================================
async function request(url, options = {}) {
    const response = await fetch(url, {
            headers: { 'Content-Type': 'application/json' },
            ...options
        });

    if (!response.ok) {
            let erro = 'Erro na requisição';
            try {
                        const data = await response.json();
                        erro = data.error || erro;
                    } catch {}
              throw new Error(erro);
          }

      return response.json();
}

// ========================================
// CRUD
// ========================================
async function carregarProdutos() {
    toggleLoading(true);

    try {
            const produtos = await request('/produtos');
            renderTabela(produtos);
        } catch (err) {
                mostrarMensagem(err.message);
            } finally {
                    toggleLoading(false);
                }
}

async function criarProduto(dados) {
    try {
            await request('/produtos', {
                        method: 'POST',
                        body: JSON.stringify(dados)
                    });

            mostrarMensagem('Produto criado com sucesso!');
            limparFormulario();
            carregarProdutos();
        } catch (err) {
                mostrarMensagem(err.message);
            }
}

async function atualizarProduto(id, dados) {
    try {
            await request(`/produtos/${id}`, {
                        method: 'PUT',
                        body: JSON.stringify(dados)
                    });

            mostrarMensagem('Produto atualizado!');
            limparFormulario();
            carregarProdutos();
        } catch (err) {
                mostrarMensagem(err.message);
            }
}

async function deletarProduto(id) {
    if (!confirm('Deseja deletar este produto?')) return;

    try {
            await request(`/produtos/${id}`, {
                        method: 'DELETE'
                    });

            mostrarMensagem('Produto deletado!');
            carregarProdutos();
        } catch (err) {
                mostrarMensagem(err.message);
            }
}

// ========================================
// RENDERIZAÇÃO
// ========================================
function renderTabela(produtos) {
    const container = document.getElementById('clientsList');
    const empty = document.getElementById('emptyMessage');

    if (!produtos.length) {
            empty.style.display = 'block';
            container.innerHTML = '';
            return;
        }

      empty.style.display = 'none';

      container.innerHTML = `
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
                                                                                                                                                                                                                          ${produtos.map(p => `
                                                                                                                                                                                                                                              <tr>
                                                                                                                                                                                                                                                                      <td>#${p.id}</td>
                                                                                                                                                                                                                                                                                              <td>${p.nome}</td>
                                                                                                                                                                                                                                                                                                                      <td>R$ ${Number(p.preco).toFixed(2)}</td>
                                                                                                                                                                                                                                                                                                                                              <td>${p.estoque}</td>
                                                                                                                                                                                                                                                                                                                                                                      <td>${p.categoria}</td>
                                                                                                                                                                                                                                                                                                                                                                                              <td>
                                                                                                                                                                                                                                                                                                                                                                                                                          <button onclick="editarProduto(${p.id})">✏️</button>
                                                                                                                                                                                                                                                                                                                                                                                                                                                      <button onclick="deletarProduto(${p.id})">🗑️</button>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                              </td>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  </tr>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  `).join('')}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              </tbody>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      </table>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          `;
}

// ========================================
// EDIÇÃO
// ========================================
function editarProduto(id) {
    fetch(`/produtos/${id}`)
        .then(res => res.json())
        .then(produto => {
                    produtoEmEdicao = id;

                    document.getElementById('nome').value = produto.nome;
                    document.getElementById('preco').value = produto.preco;
                    document.getElementById('estoque').value = produto.estoque;
                    document.getElementById('categoria').value = produto.categoria;

                    document.querySelector('.form-section h2').textContent =
                        `Editando Produto #${id}`;

                    document.querySelector('.form-section')
                        .scrollIntoView({ behavior: 'smooth' });
                });
}

// ========================================
// BUSCA
// ========================================
async function buscarProdutos(tipo, valor) {
    toggleLoading(true);

    try {
            let url = tipo === 'nome'
                ? `/produtos/nome/${encodeURIComponent(valor)}`
                : `/produtos/${valor}`;

            let resultado = await request(url);

            if (!Array.isArray(resultado)) {
                        resultado = resultado ? [resultado] : [];
                    }

              renderTabela(resultado);
          } catch (err) {
                  mostrarMensagem(err.message);
              } finally {
                      toggleLoading(false);
                  }
}

function filtrarProdutos() {
    const valor = document.getElementById('searchInput').value.trim();
    const tipo = document.getElementById('searchType').value;

    if (!valor) {
            carregarProdutos();
        } else {
                buscarProdutos(tipo, valor);
            }
}

// ========================================
// UI
// ========================================
function toggleLoading(show) {
    document.getElementById('loadingMessage').style.display = show ? 'block' : 'none';
}

// ========================================
// EVENTOS
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    carregarProdutos();

    document.getElementById('clientForm').addEventListener('submit', e => {
            e.preventDefault();

            const dados = {
                        nome: nome.value.trim(),
                        preco: preco.value,
                        estoque: estoque.value,
                        categoria: categoria.value.trim()
                    };

            if (produtoEmEdicao) {
                        atualizarProduto(produtoEmEdicao, dados);
                    } else {
                                criarProduto(dados);
                            }
        });

      btnLimpar.addEventListener('click', limparFormulario);
      btnRecarregar.addEventListener('click', carregarProdutos);
      btnBuscar.addEventListener('click', filtrarProdutos);

      searchInput.addEventListener('keyup', e => {
              if (e.key === 'Enter') filtrarProdutos();
          });

      modalMessage.addEventListener('click', e => {
              if (e.target === modalMessage) fecharModal();
          });
});
