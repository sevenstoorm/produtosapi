const pool = require("../config/database");

// ========================================
// LISTAR TODOS
// ========================================
async function listarTodos() {
  const result = await pool.query(
      "SELECT * FROM produtos ORDER BY id"
    );
  return result.rows;
}

// ========================================
// BUSCAR POR ID
// ========================================
async function buscarPorId(id) {
  const result = await pool.query(
      "SELECT * FROM produtos WHERE id = $1",
      [id]
    );

  return result.rows[0];
}

// ========================================
// CRIAR PRODUTO
// ========================================
async function criar(dados) {
  const { nome, preco, estoque, categoria } = dados;

    const sql = `
        INSERT INTO produtos (nome, preco, estoque, categoria)
            VALUES ($1, $2, $3, $4)
                RETURNING *
                  `;

    const result = await pool.query(sql, [
        nome,
        preco,
        estoque,
        categoria
      ]);

    return result.rows[0];
}

// ========================================
// ATUALIZAR PRODUTO
// ========================================
async function atualizar(id, dados) {
  const { nome, preco, estoque, categoria } = dados;

    const sql = `
        UPDATE produtos
            SET nome = $1,
                    preco = $2,
                            estoque = $3,
                                    categoria = $4
                                        WHERE id = $5
                                            RETURNING *
                                              `;

    const result = await pool.query(sql, [
        nome,
        preco,
        estoque,
        categoria,
        id
      ]);

    return result.rows[0] || null;
}

// ========================================
// DELETAR PRODUTO
// ========================================
async function deletar(id) {
  const result = await pool.query(
      "DELETE FROM produtos WHERE id = $1",
      [id]
    );

  return result.rowCount > 0;
}

// ========================================
// BUSCAR POR NOME
// ========================================
async function buscarPorNome(nome) {
  const result = await pool.query(
      "SELECT * FROM produtos WHERE nome ILIKE $1",
      [`%${nome}%`]
    );

  return result.rows;
}

module.exports = {
  listarTodos,
  buscarPorId,
  criar,
  atualizar,
  deletar,
  buscarPorNome,
};
