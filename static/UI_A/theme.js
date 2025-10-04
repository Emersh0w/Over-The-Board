/* theme.js
  Controle global de Matiz (hue shift) e Saturação (multiplicador).
  - Inclua <script src="theme.js" defer></script> em todas as páginas para aplicar o tema.
*/

(() => {
  // mapa das variáveis com seus valores originais (H, S, L)
  // Usei os valores que você passou (corrigi --border para 300 0% 50%).
  const original = {
    '--bg-dark':     {h:0,   s:0,   l:90},
    '--bg':          {h:300, s:0,   l:95},
    '--bg-light':    {h:300, s:50,  l:100},
    '--text':        {h:300, s:0,   l:4},
    '--text-muted':  {h:0,   s:0,   l:28},
    '--highlight':   {h:300, s:50,  l:100},
    '--border':      {h:300, s:0,   l:50},
    '--border-muted':{h:340, s:0,   l:62},
    '--primary':     {h:357, s:44,  l:32},
    '--secondary':   {h:183, s:100, l:9},
    '--danger':      {h:9,   s:21,  l:41},
    '--warning':     {h:52,  s:23,  l:34},
    '--success':     {h:147, s:19,  l:36},
    '--info':        {h:217, s:22,  l:41},
  };

  const root = document.documentElement;

  // UI elements (procura segura — caso não exista, script ainda funciona sem UI)
  const hueRange = document.getElementById('hueRange');
  const satRange = document.getElementById('satRange');
  const hueVal = document.getElementById('hueVal');
  const satVal = document.getElementById('satVal');
  const resetBtn = document.getElementById('resetBtn');

  // Carregar do localStorage
  const STORAGE_KEY = 'theme_hue_sat_v1';
  function loadSettings(){
    try{
      const raw = localStorage.getItem(STORAGE_KEY);
      if(!raw) return {hueShift:0, satMult:100};
      const parsed = JSON.parse(raw);
      return {
        hueShift: Number(parsed.hueShift) || 0,
        satMult: Number(parsed.satMult) || 100
      };
    }catch(e){
      return {hueShift:0, satMult:100};
    }
  }

  function saveSettings(hueShift, satMult){
    try{
      localStorage.setItem(STORAGE_KEY, JSON.stringify({hueShift, satMult}));
    }catch(e){
      // ignore
    }
  }

  // Atualiza as variáveis CSS baseado no deslocamento de matiz e multiplicador de saturação
  function applyTheme(hueShift = 0, satMult = 100){
    // satMult é percentual (100 = 100%)
    Object.entries(original).forEach(([varName, {h, s, l}]) => {
      // novo hue = soma do original com o shift, com wrap 0-360
      const newH = ((h + Number(hueShift)) % 360 + 360) % 360;
      // novo s = original * satMult/100, clamped 0-100
      const newS = Math.max(0, Math.min(100, Math.round(s * (Number(satMult) / 100))));
      const newL = l; // mantemos luminosidade original
      // escrever na root
      root.style.setProperty(varName, `hsl(${newH} ${newS}% ${newL}%)`);
    });
  }

  // Atualiza labels na UI e aplica + salva
  function onChange(hueShift, satMult){
    if(hueVal) hueVal.textContent = Number(hueShift).toString();
    if(satVal) satVal.textContent = Number(satMult).toString();
    applyTheme(hueShift, satMult);
    saveSettings(hueShift, satMult);
  }

  // Inicialização: carrega settings e aplica
  const initial = loadSettings();

  // Se existem ranges na página, conectamos eventos
  if(hueRange) hueRange.value = initial.hueShift;
  if(satRange) satRange.value = initial.satMult;

  // Aplica no carregamento
  onChange(initial.hueShift, initial.satMult);

  // Listeners
  if(hueRange){
    hueRange.addEventListener('input', (e) => {
      const v = e.target.value;
      onChange(v, satRange ? satRange.value : initial.satMult);
    });
  }
  if(satRange){
    satRange.addEventListener('input', (e) => {
      const v = e.target.value;
      onChange(hueRange ? hueRange.value : initial.hueShift, v);
    });
  }

  if(resetBtn){
    resetBtn.addEventListener('click', () => {
      // reset localStorage e UI
      const defaultHue = 0;
      const defaultSat = 100;
      if(hueRange) hueRange.value = defaultHue;
      if(satRange) satRange.value = defaultSat;
      onChange(defaultHue, defaultSat);
      try{ localStorage.removeItem(STORAGE_KEY); }catch(e){}
    });
  }

  // Aplicação automática em outras páginas:
  // Basta incluir este mesmo theme.js em qualquer página que use as variáveis -- ele lerá localStorage e aplicará.
})();
