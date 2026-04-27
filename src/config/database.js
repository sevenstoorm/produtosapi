require("dotenv").config();

const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT),
});

pool.connect((erro, client, release) => {
  if (erro) {
    console.error("❌ Erro ao conectar ao PostgreSQL:", erro.message);
    console.error("💡 Verifique suas credenciais no arquivo .env");
  } else {
    console.log("✅ Conectado ao PostgreSQL!");
    console.log(`📊 Banco: ${process.env.DB_NAME}`);
    console.log(`🏠 Host: ${process.env.DB_HOST}:${process.env.DB_PORT}`);
    release();
  }
});

const criarTabela = async () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS clientes (
      id         SERIAL PRIMARY KEY,
      nome       VARCHAR(255)   NOT NULL,
      preco       decimal(10, 2)   NOT NULL,
      estoque       integer   NOT NULL,
      categoria       VARCHAR(18)   NOT NULL
    )
  `;

  try {
    await pool.query(sql);
    console.log("✅ Tabela clientes verificada/criada");
  } catch (erro) {
    console.error("❌ Erro ao criar tabela:", erro.message);
  }
};

criarTabela();

module.exports = pool;