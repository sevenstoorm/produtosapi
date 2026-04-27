const express = require("express");
const router = express.Router();

const clienteController = require("../controllers/produtosControllers");

router.get("/", clienteController.listarTodos);

router.get("/nome/:nome", clienteController.buscarPorNome);

router.get("/:id", clienteController.buscarPorId);

router.post("/", clienteController.criar);

router.put("/:id", clienteController.atualizar);

router.delete("/:id", clienteController.deletar);

module.exports = router;
