export default function handler(req, res) {
  // Lê as senhas das variáveis de ambiente
  const passCouveFlor = process.env.PASSWORD_COUVE_FLOR;
  const passBrocolis = process.env.PASSWORD_BROCOLIS;

  // Recebe a senha enviada pelo navegador
  const submittedPassword = req.body.password;

  let isValid = false;
  let user = null;

  if (submittedPassword === passCouveFlor) {
    isValid = true;
    user = 'couve-flor';
  } else if (submittedPassword === passBrocolis) {
    isValid = true;
    user = 'brocolis';
  }

  // Retorna o resultado para o navegador
  res.status(200).json({ isValid, user });
}