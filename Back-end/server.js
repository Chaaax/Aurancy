require('dotenv').config()
const app = require('./app');
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor Aundancy a correr na porta ${PORT}`);
});