// Thème clair/sombre
const root = document.documentElement;
try { const t = localStorage.getItem('theme'); if (t) root.dataset.theme = t; } catch (e) {}
document.getElementById('themeBtn').onclick = () => {
  const dark = root.dataset.theme ? root.dataset.theme === 'dark'
    : matchMedia('(prefers-color-scheme: dark)').matches;
  root.dataset.theme = dark ? 'light' : 'dark';
  try { localStorage.setItem('theme', root.dataset.theme); } catch (e) {}
};

// Simulation (illustrative) de la carte thermique
const N = 36, racks = document.getElementById('racks');
const cells = Array.from({ length: N }, () => racks.appendChild(document.createElement('div')));
cells.forEach(c => c.className = 'cell');
let ml = false, t = 0;
const load = Array.from({ length: N }, () => Math.random());

function color(temp) {
  const x = Math.min(1, Math.max(0, (temp - 18) / 17));
  const stops = [[14,165,233],[250,204,21],[249,115,22]];
  const [a, b, k] = x < .5 ? [stops[0], stops[1], x * 2] : [stops[1], stops[2], (x - .5) * 2];
  return `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * k)).join(',')})`;
}

function tick() {
  t += 2;
  let sum = 0;
  load.forEach((l, i) => {
    load[i] = Math.min(1, Math.max(0, l + (Math.random() - .5) * .25));
    // ML : refroidissement ciblé → températures homogènes autour de la cible
    const temp = ml ? 24 + load[i] * 3 + Math.random() : 19 + load[i] * 14 + Math.random() * 2;
    cells[i].style.backgroundColor = color(temp);
    sum += temp;
  });
  document.getElementById('avgT').textContent = (sum / N).toFixed(1) + '°C';
  document.getElementById('power').textContent = (ml ? 68 + Math.random() * 4 : 100).toFixed(0) + '%';
  document.getElementById('clock').textContent = `t = ${t}s`;
}

const setMode = v => {
  ml = v;
  document.getElementById('modeML').classList.toggle('on', v);
  document.getElementById('modeStatic').classList.toggle('on', !v);
  tick();
};
document.getElementById('modeML').onclick = () => setMode(true);
document.getElementById('modeStatic').onclick = () => setMode(false);
tick(); setInterval(tick, 1600);
