export default function handler(req, res) {
  // Lê as variáveis de ambiente que você configurou na Vercel
  const apiKey = process.env.JSON_BIN_API_KEY;
  const binUrl = process.env.JSON_BIN_URL;

  // Retorna as chaves em formato JSON
  res.status(200).json({
    apiKey: apiKey,
    binUrl: binUrl,
  });
}