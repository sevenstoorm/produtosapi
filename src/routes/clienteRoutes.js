const express = require("express");
const router = express.Router();

const ProdutoController = require("../controllers/clienteControllers");

router.get("/", ProdutoController.listarTodos);

router.get("/nome/:nome", ProdutoController.buscarPorNome);

router.get("/:id", ProdutoController.buscarPorId);

router.post("/", ProdutoController.criar);

router.put("/:id", ProdutoController.atualizar);

router.delete("/:id", ProdutoController.deletar);

module.exports = router;
