export function getEstadoInspecaoDetalhado(ultimaInspecao, mesMatricula) {
  if (!ultimaInspecao || mesMatricula === undefined) return null;

  const ultima = new Date(ultimaInspecao);
  const hoje = new Date();

  const fim = new Date(ultima);
  fim.setFullYear(ultima.getFullYear() + 1);
  fim.setMonth(mesMatricula, 0); // último dia do mês da matrícula
  fim.setHours(23, 59, 59, 999);

  const diasRestantes = Math.ceil((fim - hoje) / (1000 * 60 * 60 * 24));

  if (diasRestantes < 0) return 'expirada';
  if (diasRestantes <= 30) return `Faltam ${diasRestantes} dias`;
  if (diasRestantes <= 60) return 'Faltam 2 meses';
  if (diasRestantes <= 90) return 'Faltam 3 meses';
  return null;
}

export function isSeguroExpirado(dataSeguro) {
  if (!dataSeguro) return false;
  return new Date() > new Date(dataSeguro);
}

export function isSeguroPertoDoFim(dataSeguro) {
  if (!dataSeguro) return false;
  const diasRestantes = (new Date(dataSeguro) - new Date()) / (1000 * 60 * 60 * 24);
  return diasRestantes > 0 && diasRestantes <= 30;
}
