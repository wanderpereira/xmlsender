const MESES = {
    "01": "Jan",
    "02": "Fev",
    "03": "Mar",
    "04": "Abr",
    "05": "Mai",
    "06": "Jun",
    "07": "Jul",
    "08": "Ago",
    "09": "Set",
    "10": "Out",
    "11": "Nov",
    "12": "Dez",
  };

// Função para gerar o nome da pasta baseado em uma data de início e uma data de fim
function gerarNomePasta(mesini, anoini, diaini, mesfin, anofin, diafin) {
  // Converte o código do mês em seu nome correspondente usando o objeto MESES
  const mesInicial = MESES[mesini];
  const mesFinal = MESES[mesfin];

  // Usa um switch para determinar qual formato de nome de pasta deve ser retornado
  switch (true) {
    // Se a data de início e a data de fim forem no mesmo dia, retorna o formato "Jan-2022(01)"
    case inicial == final:
      return `${mesInicial}-${anoini}(${diaini})`;
    // Se a data de início e a data de fim forem no mesmo mês e no mesmo ano, mas abrange todo o mês (dias 1 a 31), retorna o formato "Jan-2022"
    case diaini == 1 && diafin == 31 && mesini == mesfin && anoini == anofin:
      return `${mesInicial}-${anoini}`;
    // Se a data de início e a data de fim forem no mesmo mês e no mesmo ano, mas abrange todo o mês (dias 1 a 30), retorna o formato "Jan-2022"
    case diaini == 1 && diafin == 30 && mesini == mesfin && anoini == anofin:
      return `${mesInicial}-${anoini}`;
    // Se a data de início e a data de fim forem em meses diferentes no mesmo ano, retorna o formato "Jan-2022@Feb-2022(01-15)"
    case mesini != mesfin && anoini == anofin:
      return `${mesInicial}-${anoini}@${mesFinal}-${anofin}(${diaini}-${diafin})`;
    // Se a data de início e a data de fim forem no mesmo dia e no mesmo mês, mas em anos diferentes, retorna o formato "Jan-2022(01-01)"
    case diaini == diafin && mesini == mesfin && anoini != anofin:
      return `${mesInicial}-${anoini}(${diaini}-${diafin})`;
    // Se a data de início e a data de fim forem no mesmo mês e no mesmo ano, mas em dias diferentes, retorna o formato "Jan-2022(01-15)"
    case mesini == mesfin && anoini == anofin:
      return `${mesInicial}-${anoini}(${diaini}-${diafin})`;
    // Se a data de início e a data de fim forem em meses e anos diferentes, retorna o formato "Jan-2022@Feb-2023(01-15)"
    case mesini != mesfin && anoini != anofin:
      return `${mesInicial}-${anoini}@${mesFinal}-${anofin}(${diaini}-${diafin})`;
    // Se a data de início e a data de fim forem em meses e anos diferentes, retorna o formato "Jan-2022@Feb-2023(01-15)"
    case mesini != mesfin && anoini != anofin:
      return `${mesInicial}-${anoini}@${mesFinal}-${anofin}(${diaini}-${diafin})`;
    // Caso nenhuma das condições acima seja satisfeita, retorna uma string vazia
    default:
      return "";
  }

  // Cria uma variável para armazenar o caminho da pasta com o nome gerado pela função gerarNomePasta
  const caminhoPasta = path.join(
    destino,
    gerarNomePasta(mesini, anoini, diaini, mesfin, anofin, diafin)
  );

  // Usa o método fs.accessSync para verificar se a pasta já existe
  try {
    fs.accessSync(caminhoPasta);
    console.log("Indexação já existente");
    M.toast({ html: "Indexação já existente" });
  } catch (err) {
    // Se a pasta não existir, cria a pasta com o método fs.mkdirSync
    fs.mkdirSync(caminhoPasta);
  }
}
