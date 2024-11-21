
const express = require("express");
const fetch = require("node-fetch"); // Certifique-se de instalar com npm install node-fetch

const app = express();
app.use(express.json()); // Para processar requisições com JSON no corpo

app.post("/webhook", async (req, res) => {
  const cep = req.body.cep; // O CEP deve ser enviado no corpo da requisição

  if (!cep) {
    return res.status(400).json({ error: "CEP não fornecido" });
  }

  const url = `https://viacep.com.br/ws/${cep}/json/`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.erro) {
      return res.status(404).json({ error: "CEP inválido" });
    }

    const resultado = {
      rua: data.logradouro,
      cidade: data.localidade,
      estado: data.uf,
    };

    return res.json(resultado);
  } catch (error) {
    console.error("Erro ao acessar a API:", error);
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
});

// Porta para o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
