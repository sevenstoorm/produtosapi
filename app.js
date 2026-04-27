const express = require('express');
const app = express();
const PORT = 3000;

const userRoutes = require('./src/routes/clienteRoutes');  
 
app.use(express.static('./public')); 
 
app.use(express.json()); 
 
app.use('/produtos', userRoutes);  
 
app.listen(PORT, () => { 
    console.log(`Servidor rodando em http://localhost:${PORT}`); 
}); 