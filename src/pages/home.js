// Utilidades para gerenciar datas
const DateManager = {
  getYesterday() {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date.toLocaleDateString('pt-BR');
  },

  getToday() {
    return new Date().toLocaleDateString('pt-BR');
  },

  getFirstDayLastMonth() {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth() - 1, 1).toLocaleDateString('pt-BR');
  },

  getLastDayLastMonth() {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), 0).toLocaleDateString('pt-BR');
  }
};

// Inicializar valores padrões
function initializeDateFields() {
  const inicial = document.querySelector('[name="inicial"]');
  const final = document.querySelector('[name="final"]');

  if (!inicial || !final) return;

  inicial.defaultValue = DateManager.getFirstDayLastMonth();
  final.defaultValue = DateManager.getLastDayLastMonth();

  // Listener para mudanças no período
  const periodo = document.querySelector('[name="periodo"]');
  if (periodo) {
    periodo.addEventListener('change', handlePeriodoChange);
  }

  // Aplicar máscara de data
  applyDateMask(inicial);
  applyDateMask(final);
}

function handlePeriodoChange(event) {
  const inicial = document.querySelector('[name="inicial"]');
  const final = document.querySelector('[name="final"]');
  const selecionado = event.target.value;

  const dateRanges = {
    'ultimomes': {
      inicial: DateManager.getFirstDayLastMonth(),
      final: DateManager.getLastDayLastMonth()
    },
    'ontem': {
      inicial: DateManager.getYesterday(),
      final: DateManager.getYesterday()
    },
    'hoje': {
      inicial: DateManager.getToday(),
      final: DateManager.getToday()
    },
    'definir': {
      inicial: '',
      final: ''
    }
  };

  if (dateRanges[selecionado]) {
    inicial.value = dateRanges[selecionado].inicial;
    final.value = dateRanges[selecionado].final;
    saveToLocalStorage();
  }
}

// Máscara para campos de data
function applyDateMask(elm) {
  elm.addEventListener('keypress', (e) => {
    if (e.keyCode < 47 || e.keyCode > 57) {
      e.preventDefault();
    }

    const len = elm.value.length;

    if (len === 2 || len === 5) {
      elm.value += '/';
    }
  });
}

// Salvar dados no localStorage
function saveToLocalStorage() {
  const inicial = document.querySelector('[name="inicial"]');
  const final = document.querySelector('[name="final"]');
  
  if (inicial && final) {
    const data = {
      inicial: inicial.value,
      final: final.value,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('home', JSON.stringify(data));
  }
}

// Inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeDateFields);
} else {
  initializeDateFields();
}

const ipc = {
  home: home,
  ajustes: ajustes,
  avancado: avancado,
  email: smtp
}
require('electron').ipcRenderer.send('database', ipc);

}, 1000)

