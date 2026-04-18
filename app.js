/* ============================================
STUDENT TOOLS - Core Application Logic
============================================ */

// -- NAVIGATION --
function showPanel(id) {
document.querySelectorAll('.tool-panel').forEach(p => p.classList.remove('active'));
document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
const panel = document.getElementById('panel-' + id);
if (panel) panel.classList.add('active');
const nav = document.querySelector(`.nav-item[data-panel="${id}"]`);
if (nav) nav.classList.add('active');
// Close mobile sidebar
document.getElementById('sidebar').classList.remove('open');
document.getElementById('mobileOverlay').classList.remove('open');
window.scrollTo(0, 0);
if (id === 'gamestudy' && typeof gsPopulateQuizDropdown === 'function') {
  gsPopulateQuizDropdown();
  gsRenderHighScore();
}
if (id === 'studytime' && typeof stRenderSessionList === 'function') {
  stRenderSessionList();
}
}

function toggleSidebar() {
document.getElementById('sidebar').classList.toggle('open');
document.getElementById('mobileOverlay').classList.toggle('open');
}

// -- THEME SWITCHER --
function initTheme() {
const savedTheme = localStorage.getItem('theme-preference');
if (savedTheme) {
document.documentElement.setAttribute('data-theme', savedTheme);
updateThemeButton(savedTheme);
} else {
const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
const theme = prefersLight ? 'light' : '';
if (theme) document.documentElement.setAttribute('data-theme', theme);
}
}

function toggleTheme() {
const currentTheme = document.documentElement.getAttribute('data-theme');
const newTheme = currentTheme === 'light' ? '' : 'light';
document.documentElement.setAttribute('data-theme', newTheme);
localStorage.setItem('theme-preference', newTheme);
updateThemeButton(newTheme);
}

function updateThemeButton(theme) {
const cb = document.getElementById('theme-toggle-checkbox');
if (cb) cb.checked = theme === 'light';
}

// -- UTILITY --
function clearInputs(...ids) {
ids.forEach(id => {
const el = document.getElementById(id);
if (el) {
if (el.tagName === 'DIV') el.innerHTML = '';
else el.value = '';
}
});
}

function fmt(n, decimals = 6) {
if (typeof n !== 'number' || isNaN(n)) return 'undefined';
if (!isFinite(n)) return n > 0 ? '∞' : '-∞';
const rounded = parseFloat(n.toFixed(decimals));
return rounded.toString();
}

function parseExpr(expr) {
// Allow more natural notation
return expr.replace(/(\d)([a-zA-Z])/g, '$1*$2');
}

// -- COOKIE BANNER --
function acceptCookies() {
document.getElementById('cookieBanner').classList.remove('show');
localStorage.setItem('cookies_accepted', 'true');
}

window.addEventListener('DOMContentLoaded', () => {
initTheme();
if (!localStorage.getItem('cookies_accepted')) {
setTimeout(() => {
document.getElementById('cookieBanner').classList.add('show');
}, 1500);
}
drawUnitCircle();
});

// ============================================
// LINEAR EQUATION SOLVER
// ============================================
function solveLinear() {
const a = parseFloat(document.getElementById('lin-a').value);
const b = parseFloat(document.getElementById('lin-b').value);
const c = parseFloat(document.getElementById('lin-c').value);
const box = document.getElementById('linear-result');

if (isNaN(a) || isNaN(b) || isNaN(c)) {
box.innerHTML = '<span class="result-error">Please enter all coefficients.</span>';
return;
}

let html = '<div class="result-label">Solution Steps</div>';
html += `<div class="result-step">Given: ${a}x + ${b} = ${c}</div>`;

if (a === 0) {
if (b === c) {
html += '<div class="result-step result-success">Infinite solutions - the equation is always true.</div>';
} else {
html += '<div class="result-step result-error">No solution - the equation is contradictory.</div>';
}
} else {
const rhs = c - b;
html += `<div class="result-step">Subtract ${b} from both sides: ${a}x = ${fmt(rhs)}</div>`;
const x = rhs / a;
html += `<div class="result-step">Divide both sides by ${a}: x = ${fmt(rhs)} / ${a}</div>`;
html += `<div class="result-step"><span class="result-highlight" style="font-size:20px">x = ${fmt(x)}</span></div>`;
}
box.innerHTML = html;
}

// ============================================
// QUADRATIC SOLVER
// ============================================
function solveQuadratic() {
const a = parseFloat(document.getElementById('quad-a').value);
const b = parseFloat(document.getElementById('quad-b').value);
const c = parseFloat(document.getElementById('quad-c').value);
const box = document.getElementById('quadratic-result');

if (isNaN(a) || isNaN(b) || isNaN(c)) {
box.innerHTML = '<span class="result-error">Please enter all coefficients.</span>';
return;
}
if (a === 0) {
box.innerHTML = '<span class="result-error">Coefficient "a" cannot be 0 for a quadratic.</span>';
return;
}

const disc = b * b - 4 * a * c;
const vertex_x = -b / (2 * a);
const vertex_y = a * vertex_x * vertex_x + b * vertex_x + c;

let html = '<div class="result-label">Analysis</div>';
html += `<div class="result-step">Equation: ${a}x² + ${b}x + ${c} = 0</div>`;
html += `<div class="result-step">Discriminant: b² - 4ac = ${b}² - 4(${a})(${c}) = <span class="result-highlight">${fmt(disc)}</span></div>`;

if (disc > 0) {
const r1 = (-b + Math.sqrt(disc)) / (2 * a);
const r2 = (-b - Math.sqrt(disc)) / (2 * a);
html += `<div class="result-step">Two real roots (disc &gt; 0):</div>`;
html += `<div class="result-step"><span class="result-highlight" style="font-size:18px">x₁ = ${fmt(r1)}</span></div>`;
html += `<div class="result-step"><span class="result-highlight" style="font-size:18px">x₂ = ${fmt(r2)}</span></div>`;
} else if (disc === 0) {
const r = -b / (2 * a);
html += `<div class="result-step">One repeated root (disc = 0):</div>`;
html += `<div class="result-step"><span class="result-highlight" style="font-size:18px">x = ${fmt(r)}</span></div>`;
} else {
const realPart = -b / (2 * a);
const imagPart = Math.sqrt(-disc) / (2 * a);
html += `<div class="result-step">Two complex roots (disc &lt; 0):</div>`;
html += `<div class="result-step"><span class="result-highlight">x₁ = ${fmt(realPart)} + ${fmt(imagPart)}i</span></div>`;
html += `<div class="result-step"><span class="result-highlight">x₂ = ${fmt(realPart)} - ${fmt(imagPart)}i</span></div>`;
}

html += `<div class="result-step">Vertex: <span class="result-highlight">(${fmt(vertex_x)}, ${fmt(vertex_y)})</span></div>`;
html += `<div class="result-step">Axis of symmetry: <span class="result-highlight">x = ${fmt(vertex_x)}</span></div>`;
html += `<div class="result-step">Opens: <span class="result-highlight">${a > 0 ? 'Upward ↑' : 'Downward ↓'}</span></div>`;

box.innerHTML = html;
}

// ============================================
// SYSTEMS OF EQUATIONS (2x2)
// ============================================
function solveSystem2() {
const a1 = parseFloat(document.getElementById('sys-a1').value);
const b1 = parseFloat(document.getElementById('sys-b1').value);
const c1 = parseFloat(document.getElementById('sys-c1').value);
const a2 = parseFloat(document.getElementById('sys-a2').value);
const b2 = parseFloat(document.getElementById('sys-b2').value);
const c2 = parseFloat(document.getElementById('sys-c2').value);
const box = document.getElementById('system-result');

if ([a1,b1,c1,a2,b2,c2].some(isNaN)) {
box.innerHTML = '<span class="result-error">Please enter all six values.</span>';
return;
}

const det = a1 * b2 - a2 * b1;
let html = "<div class=\"result-label\">Cramer's Rule</div>";
html += `<div class="result-step">Eq1: ${a1}x + ${b1}y = ${c1}</div>`;
html += `<div class="result-step">Eq2: ${a2}x + ${b2}y = ${c2}</div>`;
html += `<div class="result-step">Determinant D = (${a1})(${b2}) - (${a2})(${b1}) = ${fmt(det)}</div>`;

if (det === 0) {
html += '<div class="result-step result-error">System has no unique solution (D = 0). Lines are parallel or identical.</div>';
} else {
const dx = c1 * b2 - c2 * b1;
const dy = a1 * c2 - a2 * c1;
const x = dx / det;
const y = dy / det;
html += `<div class="result-step">Dx = ${fmt(dx)}, Dy = ${fmt(dy)}</div>`;
html += `<div class="result-step"><span class="result-highlight" style="font-size:18px">x = ${fmt(x)}</span></div>`;
html += `<div class="result-step"><span class="result-highlight" style="font-size:18px">y = ${fmt(y)}</span></div>`;
}
box.innerHTML = html;
}

// ============================================
// POLYNOMIAL TOOLS
// ============================================
function evalPolynomial() {
const expr = document.getElementById('poly-expr').value.trim();
const xVal = parseFloat(document.getElementById('poly-x').value);
const box = document.getElementById('poly-result');

if (!expr) { box.innerHTML = '<span class="result-error">Enter an expression.</span>'; return; }
if (isNaN(xVal)) { box.innerHTML = '<span class="result-error">Enter a value for x.</span>'; return; }

try {
const parsed = parseExpr(expr);
const result = math.evaluate(parsed, { x: xVal });
box.innerHTML = `<div class="result-label">Evaluation</div> <div class="result-step">f(x) = ${expr}</div> <div class="result-step">f(${xVal}) = <span class="result-highlight" style="font-size:20px">${fmt(result)}</span></div>`;
} catch(e) {
box.innerHTML = `<span class="result-error">Error: ${e.message}. Use * for multiplication, e.g. 2*x^3</span>`;
}
}

function factorQuadratic() {
const a = parseFloat(document.getElementById('fac-a').value);
const b = parseFloat(document.getElementById('fac-b').value);
const c = parseFloat(document.getElementById('fac-c').value);
const box = document.getElementById('factor-result');

if (isNaN(a) || isNaN(b) || isNaN(c) || a === 0) {
box.innerHTML = '<span class="result-error">Enter valid a, b, c (a ≠ 0).</span>';
return;
}

const disc = b * b - 4 * a * c;
let html = '<div class="result-label">Factoring</div>';
html += `<div class="result-step">${a}x² + ${b}x + ${c}</div>`;

if (disc < 0) {
html += '<div class="result-step result-error">Cannot factor over the reals (discriminant < 0).</div>';
} else {
const r1 = (-b + Math.sqrt(disc)) / (2 * a);
const r2 = (-b - Math.sqrt(disc)) / (2 * a);

if (a === 1) {
  html += `<div class="result-step"><span class="result-highlight" style="font-size:18px">(x - ${fmt(r1)})(x - ${fmt(r2)})</span></div>`;
} else {
  html += `<div class="result-step"><span class="result-highlight" style="font-size:18px">${a}(x - ${fmt(r1)})(x - ${fmt(r2)})</span></div>`;
}
html += `<div class="result-step">Roots: x = ${fmt(r1)}, x = ${fmt(r2)}</div>`;

}
box.innerHTML = html;
}

// ============================================
// GRAPHING CALCULATOR
// ============================================
function plotGraph() {
const canvas = document.getElementById('graphCanvas');
const ctx = canvas.getContext('2d');
const dpr = window.devicePixelRatio || 1;

canvas.width = canvas.clientWidth * dpr;
canvas.height = canvas.clientHeight * dpr;
ctx.scale(dpr, dpr);

const W = canvas.clientWidth;
const H = canvas.clientHeight;

const xmin = parseFloat(document.getElementById('graph-xmin').value) || -10;
const xmax = parseFloat(document.getElementById('graph-xmax').value) || 10;
const ymin = parseFloat(document.getElementById('graph-ymin').value) || -10;
const ymax = parseFloat(document.getElementById('graph-ymax').value) || 10;

ctx.fillStyle = '#0c0c16';
ctx.fillRect(0, 0, W, H);

// Grid
function toScreen(x, y) {
return [(x - xmin) / (xmax - xmin) * W, H - (y - ymin) / (ymax - ymin) * H];
}

// Grid lines
ctx.strokeStyle = 'rgba(255,255,255,0.05)';
ctx.lineWidth = 1;
for (let x = Math.ceil(xmin); x <= xmax; x++) {
const [sx] = toScreen(x, 0);
ctx.beginPath(); ctx.moveTo(sx, 0); ctx.lineTo(sx, H); ctx.stroke();
}
for (let y = Math.ceil(ymin); y <= ymax; y++) {
const [, sy] = toScreen(0, y);
ctx.beginPath(); ctx.moveTo(0, sy); ctx.lineTo(W, sy); ctx.stroke();
}

// Axes
ctx.strokeStyle = 'rgba(255,255,255,0.25)';
ctx.lineWidth = 1.5;
const [ox, oy] = toScreen(0, 0);
ctx.beginPath(); ctx.moveTo(0, oy); ctx.lineTo(W, oy); ctx.stroke();
ctx.beginPath(); ctx.moveTo(ox, 0); ctx.lineTo(ox, H); ctx.stroke();

// Axis labels
ctx.fillStyle = 'rgba(255,255,255,0.35)';
ctx.font = '11px JetBrains Mono, monospace';
ctx.textAlign = 'center';
for (let x = Math.ceil(xmin); x <= xmax; x++) {
if (x === 0) continue;
const [sx] = toScreen(x, 0);
ctx.fillText(x, sx, oy + 14);
}
ctx.textAlign = 'right';
for (let y = Math.ceil(ymin); y <= ymax; y++) {
if (y === 0) continue;
const [, sy] = toScreen(0, y);
ctx.fillText(y, ox - 6, sy + 4);
}

// Plot functions
const colors = ['#00d4ff', '#ff4466', '#00e68a'];
const fInputs = ['graph-f1', 'graph-f2', 'graph-f3'];

fInputs.forEach((inputId, idx) => {
const expr = document.getElementById(inputId).value.trim();
if (!expr) return;

try {
  const parsed = parseExpr(expr);
  const compiled = math.compile(parsed);
  ctx.strokeStyle = colors[idx];
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  let started = false;

  const steps = W * 2;
  for (let i = 0; i <= steps; i++) {
    const x = xmin + (xmax - xmin) * (i / steps);
    try {
      const y = compiled.evaluate({ x });
      if (typeof y !== 'number' || isNaN(y) || !isFinite(y)) {
        started = false;
        continue;
      }
      const [sx, sy] = toScreen(x, y);
      if (sy < -100 || sy > H + 100) {
        started = false;
        continue;
      }
      if (!started) { ctx.moveTo(sx, sy); started = true; }
      else ctx.lineTo(sx, sy);
    } catch { started = false; }
  }
  ctx.stroke();

  // Label
  ctx.fillStyle = colors[idx];
  ctx.font = 'bold 12px DM Sans, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(expr, 10, 20 + idx * 18);
} catch(e) {
  ctx.fillStyle = '#ff4466';
  ctx.font = '12px DM Sans, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(`Error in f${idx+1}: ${e.message}`, 10, 20 + idx * 18);
}

});
}

function clearGraph() {
const canvas = document.getElementById('graphCanvas');
const ctx = canvas.getContext('2d');
ctx.clearRect(0, 0, canvas.width, canvas.height);
document.getElementById('graph-f1').value = '';
document.getElementById('graph-f2').value = '';
document.getElementById('graph-f3').value = '';
}

// ============================================
// LOGARITHM CALCULATOR
// ============================================
function calcLog() {
const base = parseFloat(document.getElementById('log-base').value);
const val = parseFloat(document.getElementById('log-value').value);
const box = document.getElementById('log-result');

if (isNaN(base) || isNaN(val) || base <= 0 || base === 1 || val <= 0) {
box.innerHTML = '<span class="result-error">Base must be > 0 and ≠ 1. Value must be > 0.</span>';
return;
}

const result = Math.log(val) / Math.log(base);
let html = '<div class="result-label">Result</div>';
html += `<div class="result-step">log<sub>${base}</sub>(${val}) = <span class="result-highlight" style="font-size:20px">${fmt(result)}</span></div>`;
html += `<div class="result-step">ln(${val}) = ${fmt(Math.log(val))}</div>`;
html += `<div class="result-step">log₁₀(${val}) = ${fmt(Math.log10(val))}</div>`;
html += `<div class="result-step" style="color:var(--text-muted);font-size:12px">Change of base formula: log_b(x) = ln(x) / ln(b)</div>`;
box.innerHTML = html;
}

function convertExpLog() {
const b = parseFloat(document.getElementById('conv-b').value);
const y = parseFloat(document.getElementById('conv-y').value);
const box = document.getElementById('conv-result');

if (isNaN(b) || isNaN(y) || b <= 0) {
box.innerHTML = '<span class="result-error">Enter valid base and exponent.</span>';
return;
}

const x = Math.pow(b, y);
let html = '<div class="result-label">Conversion</div>';
html += `<div class="result-step">Exponential form: <span class="result-highlight">${b}<sup>${y}</sup> = ${fmt(x)}</span></div>`;
html += `<div class="result-step">Logarithmic form: <span class="result-highlight">log<sub>${b}</sub>(${fmt(x)}) = ${y}</span></div>`;
box.innerHTML = html;
}

// ============================================
// TRIG CALCULATOR
// ============================================
let trigMode = 'deg';

function setTrigMode(mode, btn) {
trigMode = mode;
btn.parentElement.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
btn.classList.add('active');
}

function calcTrig() {
const angle = parseFloat(document.getElementById('trig-angle').value);
const box = document.getElementById('trig-result');

if (isNaN(angle)) { box.innerHTML = '<span class="result-error">Enter an angle.</span>'; return; }

const rad = trigMode === 'deg' ? angle * Math.PI / 180 : angle;
const deg = trigMode === 'deg' ? angle : angle * 180 / Math.PI;

const sin = Math.sin(rad);
const cos = Math.cos(rad);
const tan = Math.abs(cos) < 1e-12 ? undefined : sin / cos;
const csc = Math.abs(sin) < 1e-12 ? undefined : 1 / sin;
const sec = Math.abs(cos) < 1e-12 ? undefined : 1 / cos;
const cot = Math.abs(sin) < 1e-12 ? undefined : cos / sin;

const items = [
{ label: 'sin θ', value: fmt(sin) },
{ label: 'cos θ', value: fmt(cos) },
{ label: 'tan θ', value: tan === undefined ? 'undefined' : fmt(tan) },
{ label: 'csc θ', value: csc === undefined ? 'undefined' : fmt(csc) },
{ label: 'sec θ', value: sec === undefined ? 'undefined' : fmt(sec) },
{ label: 'cot θ', value: cot === undefined ? 'undefined' : fmt(cot) },
{ label: 'Degrees', value: fmt(deg, 4) + '°' },
{ label: 'Radians', value: fmt(rad, 6) },
];

box.innerHTML = items.map(i =>
`<div class="stat-card"><div class="stat-label">${i.label}</div><div class="stat-value">${i.value}</div></div>`
).join('');
}

function degToRad() {
const d = parseFloat(document.getElementById('deg-input').value);
if (!isNaN(d)) document.getElementById('rad-input').value = (d * Math.PI / 180).toFixed(6);
}

function radToDeg() {
const r = parseFloat(document.getElementById('rad-input').value);
if (!isNaN(r)) document.getElementById('deg-input').value = (r * 180 / Math.PI).toFixed(4);
}

// ============================================
// UNIT CIRCLE
// ============================================
function drawUnitCircle() {
const canvas = document.getElementById('unitCircleCanvas');
if (!canvas) return;
const ctx = canvas.getContext('2d');
const W = 420, H = 420;
const cx = W / 2, cy = H / 2, R = 160;

ctx.fillStyle = '#0c0c16';
ctx.fillRect(0, 0, W, H);

// Axes
ctx.strokeStyle = 'rgba(255,255,255,0.15)';
ctx.lineWidth = 1;
ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.stroke();
ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, H); ctx.stroke();

// Circle
ctx.strokeStyle = 'rgba(0,212,255,0.4)';
ctx.lineWidth = 2;
ctx.beginPath(); ctx.arc(cx, cy, R, 0, 2 * Math.PI); ctx.stroke();

// Key angles
const angles = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330];

angles.forEach(deg => {
const rad = deg * Math.PI / 180;
const px = cx + R * Math.cos(rad);
const py = cy - R * Math.sin(rad);

ctx.fillStyle = '#00d4ff';
ctx.beginPath(); ctx.arc(px, py, 5, 0, 2 * Math.PI); ctx.fill();

ctx.fillStyle = 'rgba(255,255,255,0.6)';
ctx.font = '10px JetBrains Mono, monospace';
ctx.textAlign = px > cx + 5 ? 'left' : px < cx - 5 ? 'right' : 'center';
ctx.textBaseline = py > cy + 5 ? 'top' : py < cy - 5 ? 'bottom' : 'middle';
const dx = (px > cx ? 10 : px < cx ? -10 : 0);
const dy = (py > cy ? 10 : py < cy ? -10 : 0);
ctx.fillText(deg + '°', px + dx, py + dy);

});

// Axis labels
ctx.fillStyle = 'rgba(255,255,255,0.3)';
ctx.font = '12px DM Sans, sans-serif';
ctx.textAlign = 'center';
ctx.fillText('0, 2π', cx + R + 25, cy + 4);
ctx.fillText('π', cx - R - 20, cy + 4);
ctx.fillText('π/2', cx, cy - R - 10);
ctx.fillText('3π/2', cx, cy + R + 16);

// Click handler
canvas.onclick = (e) => {
const rect = canvas.getBoundingClientRect();
const mx = e.clientX - rect.left;
const my = e.clientY - rect.top;
let angle = Math.atan2(-(my - cy), mx - cx);
if (angle < 0) angle += 2 * Math.PI;
const deg = angle * 180 / Math.PI;

// Snap to nearest common angle
let closest = angles.reduce((prev, curr) =>
  Math.abs(curr - deg) < Math.abs(prev - deg) ? curr : prev
);

const rad = closest * Math.PI / 180;
const cosV = Math.cos(rad);
const sinV = Math.sin(rad);

const info = document.getElementById('uc-details');
info.innerHTML = `
  <div class="result-label">θ = ${closest}° = ${closest === 0 ? '0' : closest === 180 ? 'π' : closest === 90 ? 'π/2' : closest === 270 ? '3π/2' : closest + '°'}</div>
  <div class="result-step">cos θ = <span class="result-highlight">${fmt(cosV, 4)}</span></div>
  <div class="result-step">sin θ = <span class="result-highlight">${fmt(sinV, 4)}</span></div>
  <div class="result-step">tan θ = <span class="result-highlight">${Math.abs(cosV) < 1e-10 ? 'undefined' : fmt(sinV/cosV, 4)}</span></div>
  <div class="result-step">Point: (${fmt(cosV, 4)}, ${fmt(sinV, 4)})</div>
  <div class="result-step" style="color:var(--text-muted);font-size:11px;">Quadrant: ${closest < 90 ? 'I' : closest < 180 ? 'II' : closest < 270 ? 'III' : 'IV'}</div>
`;

// Redraw with highlight
drawUnitCircle();
const px = cx + R * Math.cos(rad);
const py = cy - R * Math.sin(rad);
ctx.fillStyle = '#00e68a';
ctx.beginPath(); ctx.arc(px, py, 7, 0, 2 * Math.PI); ctx.fill();
ctx.strokeStyle = 'rgba(0,230,138,0.3)';
ctx.lineWidth = 1;
ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(px, py); ctx.stroke();

};
}

// ============================================
// LIMITS CALCULATOR (numerical)
// ============================================
function calcLimit() {
const expr = document.getElementById('lim-expr').value.trim();
const a = parseFloat(document.getElementById('lim-val').value);
const box = document.getElementById('limit-result');

if (!expr || isNaN(a)) { box.innerHTML = '<span class="result-error">Enter f(x) and the approach value.</span>'; return; }

try {
const parsed = parseExpr(expr);
const compiled = math.compile(parsed);

const offsets = [0.1, 0.01, 0.001, 0.0001, 0.00001];
let leftVals = [], rightVals = [];

offsets.forEach(h => {
  try { leftVals.push({ h: -h, val: compiled.evaluate({ x: a - h }) }); } catch {}
  try { rightVals.push({ h: h, val: compiled.evaluate({ x: a + h }) }); } catch {}
});

let html = '<div class="result-label">Numerical Approach</div>';
html += `<div class="result-step" style="font-weight:600">lim x→${a} [${expr}]</div>`;

html += `<div class="result-step" style="margin-top:8px"><strong>From the left (x → ${a}⁻):</strong></div>`;
leftVals.forEach(v => {
  html += `<div class="result-step">  x = ${(a + v.h).toFixed(6)} → f(x) = ${fmt(v.val)}</div>`;
});

html += `<div class="result-step" style="margin-top:8px"><strong>From the right (x → ${a}⁺):</strong></div>`;
rightVals.forEach(v => {
  html += `<div class="result-step">  x = ${(a + v.h).toFixed(6)} → f(x) = ${fmt(v.val)}</div>`;
});

const leftLimit = leftVals.length ? leftVals[leftVals.length - 1].val : NaN;
const rightLimit = rightVals.length ? rightVals[rightVals.length - 1].val : NaN;

if (isFinite(leftLimit) && isFinite(rightLimit) && Math.abs(leftLimit - rightLimit) < 0.001) {
  const avg = (leftLimit + rightLimit) / 2;
  html += `<div class="result-step" style="margin-top:12px"><span class="result-highlight" style="font-size:20px">Limit ≈ ${fmt(avg)}</span></div>`;
} else if (isFinite(leftLimit) || isFinite(rightLimit)) {
  html += `<div class="result-step result-error" style="margin-top:12px">Left and right limits differ - limit may not exist.</div>`;
  html += `<div class="result-step">Left limit ≈ ${fmt(leftLimit)}, Right limit ≈ ${fmt(rightLimit)}</div>`;
} else {
  html += `<div class="result-step result-error" style="margin-top:12px">Could not determine limit numerically.</div>`;
}

box.innerHTML = html;

} catch(e) {
box.innerHTML = `<span class="result-error">Error: ${e.message}</span>`;
}
}

// ============================================
// DERIVATIVE CALCULATOR
// ============================================
function calcDerivative() {
const expr = document.getElementById('deriv-expr').value.trim();
const atX = document.getElementById('deriv-at').value.trim();
const box = document.getElementById('deriv-result');

if (!expr) { box.innerHTML = '<span class="result-error">Enter f(x).</span>'; return; }

try {
const parsed = parseExpr(expr);
const derivative = math.derivative(parsed, 'x');

let html = '<div class="result-label">Derivative</div>';
html += `<div class="result-step">f(x) = ${expr}</div>`;
html += `<div class="result-step"><span class="result-highlight" style="font-size:18px">f′(x) = ${derivative.toString()}</span></div>`;

if (atX !== '') {
  const xVal = parseFloat(atX);
  if (!isNaN(xVal)) {
    const val = derivative.evaluate({ x: xVal });
    html += `<div class="result-step">f′(${xVal}) = <span class="result-highlight" style="font-size:18px">${fmt(val)}</span></div>`;
    html += `<div class="result-step" style="color:var(--text-muted);font-size:12px">This is the slope of the tangent line at x = ${xVal}</div>`;
  }
}

// Try second derivative
try {
  const secondDeriv = math.derivative(derivative, 'x');
  html += `<div class="result-step" style="margin-top:8px">f″(x) = ${secondDeriv.toString()}</div>`;
} catch {}

box.innerHTML = html;

} catch(e) {
box.innerHTML = `<span class="result-error">Error: ${e.message}. Use * for multiplication.</span>`;
}
}

// ============================================
// INTEGRAL CALCULATOR (Simpson's Rule)
// ============================================
function calcIntegral() {
const expr = document.getElementById('int-expr').value.trim();
const a = parseFloat(document.getElementById('int-a').value);
const b = parseFloat(document.getElementById('int-b').value);
const box = document.getElementById('integral-result');

if (!expr || isNaN(a) || isNaN(b)) {
box.innerHTML = '<span class="result-error">Enter f(x) and bounds.</span>';
return;
}

try {
const parsed = parseExpr(expr);
const compiled = math.compile(parsed);

// Simpson's rule with n=1000
const n = 1000;
const h = (b - a) / n;
let sum = compiled.evaluate({ x: a }) + compiled.evaluate({ x: b });

for (let i = 1; i < n; i++) {
  const x = a + i * h;
  const fv = compiled.evaluate({ x });
  sum += (i % 2 === 0) ? 2 * fv : 4 * fv;
}
const result = (h / 3) * sum;

let html = '<div class="result-label">Definite Integral (Simpson\'s Rule)</div>';
html += `<div class="result-step">∫ from ${a} to ${b} of [${expr}] dx</div>`;
html += `<div class="result-step"><span class="result-highlight" style="font-size:22px">≈ ${fmt(result, 8)}</span></div>`;
html += `<div class="result-step" style="color:var(--text-muted);font-size:12px">Computed using Simpson's rule with ${n} subdivisions</div>`;

box.innerHTML = html;

} catch(e) {
box.innerHTML = `<span class="result-error">Error: ${e.message}</span>`;
}
}

// ============================================
// SEQUENCES & SERIES
// ============================================
function calcArithmetic() {
const a1 = parseFloat(document.getElementById('arith-a1').value);
const d = parseFloat(document.getElementById('arith-d').value);
const n = parseInt(document.getElementById('arith-n').value);
const box = document.getElementById('arith-result');

if (isNaN(a1) || isNaN(d) || isNaN(n) || n < 1) {
box.innerHTML = '<span class="result-error">Enter valid a₁, d, and n.</span>';
return;
}

const an = a1 + (n - 1) * d;
const sum = (n / 2) * (a1 + an);
const terms = [];
for (let i = 0; i < Math.min(n, 10); i++) terms.push(fmt(a1 + i * d, 4));

let html = '<div class="result-label">Arithmetic Sequence</div>';
html += `<div class="result-step">a₁ = ${a1}, d = ${d}, n = ${n}</div>`;
html += `<div class="result-step">a_n = a₁ + (n-1)d = <span class="result-highlight" style="font-size:18px">${fmt(an)}</span></div>`;
html += `<div class="result-step">S_n = n/2 (a₁ + a_n) = <span class="result-highlight" style="font-size:18px">${fmt(sum)}</span></div>`;
html += `<div class="result-step" style="color:var(--text-muted)">First terms: ${terms.join(', ')}${n > 10 ? ', ...' : ''}</div>`;
box.innerHTML = html;
}

function calcGeometric() {
const a1 = parseFloat(document.getElementById('geo-a1').value);
const r = parseFloat(document.getElementById('geo-r').value);
const n = parseInt(document.getElementById('geo-n').value);
const box = document.getElementById('geo-result');

if (isNaN(a1) || isNaN(r) || isNaN(n) || n < 1) {
box.innerHTML = '<span class="result-error">Enter valid a₁, r, and n.</span>';
return;
}

const an = a1 * Math.pow(r, n - 1);
const sum = r === 1 ? a1 * n : a1 * (1 - Math.pow(r, n)) / (1 - r);
const terms = [];
for (let i = 0; i < Math.min(n, 10); i++) terms.push(fmt(a1 * Math.pow(r, i), 4));

let html = '<div class="result-label">Geometric Sequence</div>';
html += `<div class="result-step">a₁ = ${a1}, r = ${r}, n = ${n}</div>`;
html += `<div class="result-step">a_n = a₁ · r^(n-1) = <span class="result-highlight" style="font-size:18px">${fmt(an)}</span></div>`;
html += `<div class="result-step">S_n = a₁(1 - r^n)/(1 - r) = <span class="result-highlight" style="font-size:18px">${fmt(sum)}</span></div>`;

if (Math.abs(r) < 1) {
const sInf = a1 / (1 - r);
html += `<div class="result-step">S_∞ = a₁/(1-r) = <span class="result-highlight">${fmt(sInf)}</span> (converges since |r| < 1)</div>`;
} else if (Math.abs(r) > 1) {
html += `<div class="result-step" style="color:var(--accent-orange)">Series diverges (|r| ≥ 1)</div>`;
}

html += `<div class="result-step" style="color:var(--text-muted)">First terms: ${terms.join(', ')}${n > 10 ? ', ...' : ''}</div>`;
box.innerHTML = html;
}

// ============================================
// DESCRIPTIVE STATISTICS
// ============================================
function calcStats() {
const raw = document.getElementById('stats-data').value.trim();
const grid = document.getElementById('stats-result-grid');
const extra = document.getElementById('stats-extra');

if (!raw) { grid.innerHTML = '<span class="result-error">Enter data.</span>'; return; }

const data = raw.split(/[\s,]+/).map(Number).filter(n => !isNaN(n));
if (data.length === 0) { grid.innerHTML = '<span class="result-error">No valid numbers found.</span>'; return; }

data.sort((a, b) => a - b);
const n = data.length;
const sum = data.reduce((a, b) => a + b, 0);
const mean = sum / n;
const median = n % 2 === 1 ? data[Math.floor(n/2)] : (data[n/2 - 1] + data[n/2]) / 2;

// Mode
const freq = {};
data.forEach(v => freq[v] = (freq[v] || 0) + 1);
const maxFreq = Math.max(...Object.values(freq));
const modes = Object.keys(freq).filter(k => freq[k] === maxFreq);
const modeStr = maxFreq === 1 ? 'None' : modes.join(', ');

// Variance & StdDev
const variance = data.reduce((s, v) => s + (v - mean) ** 2, 0) / n;
const sampleVar = n > 1 ? data.reduce((s, v) => s + (v - mean) ** 2, 0) / (n - 1) : 0;
const stdDev = Math.sqrt(variance);
const sampleStdDev = Math.sqrt(sampleVar);

// Quartiles
const q1Idx = (n - 1) * 0.25;
const q3Idx = (n - 1) * 0.75;
const q1 = data[Math.floor(q1Idx)] + (q1Idx % 1) * (data[Math.ceil(q1Idx)] - data[Math.floor(q1Idx)]);
const q3 = data[Math.floor(q3Idx)] + (q3Idx % 1) * (data[Math.ceil(q3Idx)] - data[Math.floor(q3Idx)]);
const iqr = q3 - q1;
const range = data[n - 1] - data[0];

const stats = [
{ label: 'Count', value: n },
{ label: 'Mean', value: fmt(mean, 4) },
{ label: 'Median', value: fmt(median, 4) },
{ label: 'Mode', value: modeStr },
{ label: 'Std Dev (pop)', value: fmt(stdDev, 4) },
{ label: 'Std Dev (sample)', value: fmt(sampleStdDev, 4) },
{ label: 'Variance (pop)', value: fmt(variance, 4) },
{ label: 'Min', value: fmt(data[0]) },
{ label: 'Q1', value: fmt(q1, 4) },
{ label: 'Q3', value: fmt(q3, 4) },
{ label: 'IQR', value: fmt(iqr, 4) },
{ label: 'Max', value: fmt(data[n - 1]) },
{ label: 'Range', value: fmt(range) },
{ label: 'Sum', value: fmt(sum) },
];

grid.innerHTML = stats.map(s =>
`<div class="stat-card"><div class="stat-label">${s.label}</div><div class="stat-value">${s.value}</div></div>`
).join('');

// Five-number summary
extra.innerHTML = `<div class="result-label">Five-Number Summary</div> <div class="result-step">Min = ${fmt(data[0])} | Q1 = ${fmt(q1,4)} | Median = ${fmt(median,4)} | Q3 = ${fmt(q3,4)} | Max = ${fmt(data[n-1])}</div> <div class="result-step" style="color:var(--text-muted);font-size:12px">Outlier fences: [${fmt(q1 - 1.5*iqr,2)}, ${fmt(q3 + 1.5*iqr,2)}]</div>`;
}

// ============================================
// PROBABILITY
// ============================================
function factorial(n) {
if (n <= 1) return 1;
let result = 1;
for (let i = 2; i <= n; i++) result *= i;
return result;
}

function comb(n, r) {
if (r > n || r < 0) return 0;
return factorial(n) / (factorial(r) * factorial(n - r));
}

function perm(n, r) {
if (r > n || r < 0) return 0;
return factorial(n) / factorial(n - r);
}

function calcCombPerm() {
const n = parseInt(document.getElementById('prob-n').value);
const r = parseInt(document.getElementById('prob-r').value);
const box = document.getElementById('combperm-result');

if (isNaN(n) || isNaN(r) || n < 0 || r < 0) {
box.innerHTML = '<span class="result-error">Enter valid n and r (non-negative integers).</span>';
return;
}

let html = '<div class="result-label">Results</div>';
html += `<div class="result-step">C(${n}, ${r}) = <span class="result-highlight" style="font-size:18px">${comb(n, r).toLocaleString()}</span></div>`;
html += `<div class="result-step">P(${n}, ${r}) = <span class="result-highlight" style="font-size:18px">${perm(n, r).toLocaleString()}</span></div>`;
html += `<div class="result-step">${n}! = ${factorial(n).toLocaleString()}</div>`;
box.innerHTML = html;
}

function calcBinomial() {
const n = parseInt(document.getElementById('binom-n').value);
const k = parseInt(document.getElementById('binom-k').value);
const p = parseFloat(document.getElementById('binom-p').value);
const box = document.getElementById('binom-result');

if (isNaN(n) || isNaN(k) || isNaN(p) || n < 1 || k < 0 || k > n || p < 0 || p > 1) {
box.innerHTML = '<span class="result-error">Check inputs: n ≥ 1, 0 ≤ k ≤ n, 0 ≤ p ≤ 1.</span>';
return;
}

const prob = comb(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
const expVal = n * p;
const stdDev = Math.sqrt(n * p * (1 - p));

let html = '<div class="result-label">Binomial Distribution</div>';
html += `<div class="result-step">P(X = ${k}) = C(${n},${k}) · ${p}^${k} · ${fmt(1-p)}^${n-k}</div>`;
html += `<div class="result-step"><span class="result-highlight" style="font-size:20px">P(X = ${k}) = ${fmt(prob, 8)}</span></div>`;
html += `<div class="result-step">≈ ${(prob * 100).toFixed(4)}%</div>`;
html += `<div class="result-step">E[X] = np = <span class="result-highlight">${fmt(expVal)}</span></div>`;
html += `<div class="result-step">σ = √(np(1-p)) = <span class="result-highlight">${fmt(stdDev)}</span></div>`;
box.innerHTML = html;
}

function calcNormal() {
const x = parseFloat(document.getElementById('norm-x').value);
const mean = parseFloat(document.getElementById('norm-mean').value);
const sd = parseFloat(document.getElementById('norm-sd').value);
const box = document.getElementById('normal-result');

if (isNaN(x) || isNaN(mean) || isNaN(sd) || sd <= 0) {
box.innerHTML = '<span class="result-error">Enter valid x, μ, and σ (σ > 0).</span>';
return;
}

const z = (x - mean) / sd;

// Approximate CDF using error function approximation
function erf(x) {
const t = 1 / (1 + 0.3275911 * Math.abs(x));
const poly = t * (0.254829592 + t * (-0.284496736 + t * (1.421413741 + t * (-1.453152027 + t * 1.061405429))));
const val = 1 - poly * Math.exp(-x * x);
return x >= 0 ? val : -val;
}

const cdf = 0.5 * (1 + erf(z / Math.sqrt(2)));

let html = '<div class="result-label">Normal Distribution</div>';
html += `<div class="result-step">x = ${x}, μ = ${mean}, σ = ${sd}</div>`;
html += `<div class="result-step"><span class="result-highlight" style="font-size:20px">z = ${fmt(z, 4)}</span></div>`;
html += `<div class="result-step">P(X ≤ ${x}) ≈ <span class="result-highlight">${fmt(cdf, 6)}</span> (${(cdf * 100).toFixed(3)}%)</div>`;
html += `<div class="result-step">P(X > ${x}) ≈ <span class="result-highlight">${fmt(1 - cdf, 6)}</span></div>`;
box.innerHTML = html;
}

// ============================================
// REGRESSION
// ============================================
function calcRegression() {
const xRaw = document.getElementById('reg-x').value.trim();
const yRaw = document.getElementById('reg-y').value.trim();
const box = document.getElementById('reg-result');

if (!xRaw || !yRaw) { box.innerHTML = '<span class="result-error">Enter x and y values.</span>'; return; }

const xs = xRaw.split(/[\s,]+/).map(Number).filter(n => !isNaN(n));
const ys = yRaw.split(/[\s,]+/).map(Number).filter(n => !isNaN(n));

if (xs.length !== ys.length || xs.length < 2) {
box.innerHTML = '<span class="result-error">x and y must have the same number of values (≥ 2).</span>';
return;
}

const n = xs.length;
const sumX = xs.reduce((a, b) => a + b, 0);
const sumY = ys.reduce((a, b) => a + b, 0);
const sumXY = xs.reduce((s, x, i) => s + x * ys[i], 0);
const sumX2 = xs.reduce((s, x) => s + x * x, 0);
const sumY2 = ys.reduce((s, y) => s + y * y, 0);

const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
const intercept = (sumY - slope * sumX) / n;

// R-squared
const ssRes = xs.reduce((s, x, i) => s + (ys[i] - (slope * x + intercept)) ** 2, 0);
const ssTot = ys.reduce((s, y) => s + (y - sumY / n) ** 2, 0);
const r2 = ssTot === 0 ? 1 : 1 - ssRes / ssTot;
const r = Math.sqrt(r2) * (slope >= 0 ? 1 : -1);

let html = '<div class="result-label">Least Squares Regression</div>';
html += `<div class="result-step">n = ${n} data points</div>`;
html += `<div class="result-step"><span class="result-highlight" style="font-size:18px">ŷ = ${fmt(slope, 4)}x + ${fmt(intercept, 4)}</span></div>`;
html += `<div class="result-step">Slope (b₁) = <span class="result-highlight">${fmt(slope, 6)}</span></div>`;
html += `<div class="result-step">Intercept (b₀) = <span class="result-highlight">${fmt(intercept, 6)}</span></div>`;
html += `<div class="result-step">r = <span class="result-highlight">${fmt(r, 6)}</span></div>`;
html += `<div class="result-step">r² = <span class="result-highlight">${fmt(r2, 6)}</span></div>`;
html += `<div class="result-step" style="color:var(--text-muted);font-size:12px">${(r2 * 100).toFixed(2)}% of variation in y is explained by x</div>`;

box.innerHTML = html;
}

// ============================================
// ============================================
//  STUDY TOOLS - Flashcards & Quiz Maker
// ============================================
// ============================================

// -- LOCAL STORAGE HELPERS --
function stLoad(key, fallback) {
try {
const raw = localStorage.getItem(key);
return raw ? JSON.parse(raw) : fallback;
} catch { return fallback; }
}

function stSave(key, data) {
try { localStorage.setItem(key, JSON.stringify(data)); } catch(e) { console.warn('Storage full:', e); }
}

// ============================================
// STUDY TIME TRACKER
// ============================================
let stSessions = stLoad('mt_st_sessions', []);
let stActiveSessionId = null;
let stActiveStartTime = null;
let stActivePauseTime = null;
let stTimerInterval = null;
let stElapsedMs = 0;
let stAccumulatedMs = 0;

function stFormatTime(ms) {
const totalSeconds = Math.floor(ms / 1000);
const hours = Math.floor(totalSeconds / 3600);
const minutes = Math.floor((totalSeconds % 3600) / 60);
const seconds = totalSeconds % 60;

if (hours > 0) {
return `${hours}h ${minutes}m ${seconds}s`;
} else if (minutes > 0) {
return `${minutes}m ${seconds}s`;
} else {
return `${seconds}s`;
}
}

function stFormatTimeHMS(ms) {
const totalSeconds = Math.floor(ms / 1000);
const hours = Math.floor(totalSeconds / 3600);
const minutes = Math.floor((totalSeconds % 3600) / 60);
const seconds = totalSeconds % 60;

return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function stPromptAndStart() {
const defaultName = 'Session ' + new Date().toLocaleDateString();
showModal('Create Study Session', [
{
id: 'st-session-name-input',
label: 'Session Name',
placeholder: 'e.g., Math Chapter 5',
value: defaultName
}
], function(values) {
const name = values['st-session-name-input'].trim() || defaultName;
stStartSession(name);
closeModal();
});
}

function stStartSession(name = null) {
const session = {
id: generateId(),
name: name || 'Session ' + new Date().toLocaleDateString(),
startTime: Date.now(),
endTime: null,
duration: 0,
pauseCount: 0,
notes: '',
isPaused: false,
sessionBusts: []
};

stSessions.push(session);
stSave('mt_st_sessions', stSessions);

stActiveSessionId = session.id;
stActiveStartTime = Date.now();
stActivePauseTime = null;
stElapsedMs = 0;
stAccumulatedMs = 0;

showPanel('studytime');
stRenderActiveSession();
stStartTimer();
}

function stStartTimer() {
if (stTimerInterval) clearInterval(stTimerInterval);

stTimerInterval = setInterval(() => {
  if (!stActivePauseTime && stActiveStartTime) {
    stElapsedMs = stAccumulatedMs + (Date.now() - stActiveStartTime);
    const display = document.getElementById('st-timer-display');
    if (display) {
      display.textContent = stFormatTimeHMS(stElapsedMs);
      display.classList.remove('paused');
    }
  }
}, 100);
}

function stTogglePause() {
if (stActivePauseTime) {
stResumeSession();
} else {
stPauseSession();
}
}

function stPauseSession() {
if (!stActiveSessionId) return;

stAccumulatedMs += Date.now() - stActiveStartTime;
stActivePauseTime = Date.now();
if (stTimerInterval) clearInterval(stTimerInterval);

const display = document.getElementById('st-timer-display');
if (display) {
display.classList.add('paused');
}

const btn = document.getElementById('st-pause-btn');
if (btn) btn.textContent = 'Resume';

const session = stSessions.find(s => s.id === stActiveSessionId);
if (session) {
session.isPaused = true;
session.pauseCount = (session.pauseCount || 0) + 1;
stSave('mt_st_sessions', stSessions);
}
}

function stResumeSession() {
if (!stActiveSessionId || !stActivePauseTime) return;

const pauseDuration = Date.now() - stActivePauseTime;
stActiveStartTime = Date.now();
stActivePauseTime = null;

const display = document.getElementById('st-timer-display');
if (display) {
display.classList.remove('paused');
}

const btn = document.getElementById('st-pause-btn');
if (btn) btn.textContent = 'Pause';

const session = stSessions.find(s => s.id === stActiveSessionId);
if (session) {
session.isPaused = false;
stSave('mt_st_sessions', stSessions);
}

stStartTimer();
}

function stEndSession(notes = null) {
if (!stActiveSessionId) return;

if (stTimerInterval) clearInterval(stTimerInterval);

const finalMs = stActivePauseTime
  ? stAccumulatedMs
  : stAccumulatedMs + (stActiveStartTime ? Date.now() - stActiveStartTime : 0);

const session = stSessions.find(s => s.id === stActiveSessionId);
if (session) {
session.endTime = Date.now();
session.duration = finalMs;
if (notes) session.notes = notes;
stSave('mt_st_sessions', stSessions);
}

stActiveSessionId = null;
stActiveStartTime = null;
stActivePauseTime = null;
stElapsedMs = 0;
stAccumulatedMs = 0;

const listDiv = document.getElementById('st-session-list');
const activeDiv = document.getElementById('st-active-session');
if (listDiv) listDiv.style.display = 'block';
if (activeDiv) activeDiv.style.display = 'none';

stRenderSessionList();
}

function stDeleteSession(sessionId) {
if (!confirm('Delete this session?')) return;
stSessions = stSessions.filter(s => s.id !== sessionId);
stSave('mt_st_sessions', stSessions);
stRenderSessionList();
}

function stRenderSessionList() {
const listDiv = document.getElementById('st-session-list');
if (!listDiv) return;

let statsHtml = '';
if (stSessions.length > 0) {
const totalMs = stSessions.reduce((sum, s) => sum + (s.duration || 0), 0);
const avgMs = totalMs / stSessions.length;
const longestMs = Math.max(...stSessions.map(s => s.duration || 0));

statsHtml = `
  <div class="st-stat-card">
    <span class="st-stat-label">Total Study Time</span>
    <div class="st-stat-value">${stFormatTime(totalMs)}</div>
  </div>
  <div class="st-stat-card">
    <span class="st-stat-label">Sessions</span>
    <div class="st-stat-value">${stSessions.length}</div>
  </div>
  <div class="st-stat-card">
    <span class="st-stat-label">Avg. Length</span>
    <div class="st-stat-value">${stFormatTime(avgMs)}</div>
  </div>
  <div class="st-stat-card">
    <span class="st-stat-label">Longest</span>
    <div class="st-stat-value">${stFormatTime(longestMs)}</div>
  </div>
`;
}

const statsDiv = document.getElementById('st-stats-dashboard');
if (statsDiv) statsDiv.innerHTML = statsHtml;

const grid = document.getElementById('st-session-grid');
if (!grid) return;

let html = '';

stSessions.forEach(session => {
const durationStr = stFormatTime(session.duration || 0);
const startDate = new Date(session.startTime);
const dateStr = startDate.toLocaleDateString();
const timeStr = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

html += `<div class="st-session-card" onclick="stShowSessionDetails('${session.id}')">
  <div style="display:flex;justify-content:space-between;align-items:flex-start">
    <div class="st-session-badge">Completed</div>
    <button class="st-delete-btn" onclick="event.stopPropagation();stDeleteSession('${session.id}')" title="Delete session">&times;</button>
  </div>
  <div class="st-session-name">${escHtml(session.name)}</div>
  <div class="st-session-time">${dateStr} at ${timeStr}</div>
  <div class="st-session-duration">${durationStr}</div>
</div>`;
});

if (stSessions.length === 0) {
html += `<div class="empty-state" style="grid-column:1/-1">
  <div class="empty-icon">⏱️</div>
  <p>No study sessions yet - start your first one!</p>
</div>`;
}

grid.innerHTML = html;
}

function stRenderActiveSession() {
const listDiv = document.getElementById('st-session-list');
const activeDiv = document.getElementById('st-active-session');

if (listDiv) listDiv.style.display = 'none';
if (activeDiv) activeDiv.style.display = 'block';

const session = stSessions.find(s => s.id === stActiveSessionId);
if (session && activeDiv) {
const nameInput = activeDiv.querySelector('.st-session-name');
if (nameInput) nameInput.value = session.name;

const btn = activeDiv.querySelector('#st-pause-btn');
if (btn) btn.textContent = stActivePauseTime ? 'Resume' : 'Pause';
}
}

function stBackToList() {
if (stActiveSessionId) {
if (!confirm('You have an active session. End it?')) return;
stEndSession();
} else {
const listDiv = document.getElementById('st-session-list');
const activeDiv = document.getElementById('st-active-session');
if (listDiv) listDiv.style.display = 'block';
if (activeDiv) activeDiv.style.display = 'none';
}
}

function stShowSessionDetails(sessionId) {
const session = stSessions.find(s => s.id === sessionId);
if (!session) return;

showModal(`Session Details`, [], () => {});

const modal = document.getElementById('app-modal');
if (modal) {
const modalBox = modal.querySelector('.modal-box');
if (modalBox) {
  const startDate = new Date(session.startTime);
  const endDate = new Date(session.endTime);

  modalBox.innerHTML = `
    <div class="st-detail-header">
      <div class="st-detail-name">${escHtml(session.name)}</div>
      <button class="btn btn-danger btn-sm" onclick="stDeleteSession('${session.id}'); closeModal()">Delete</button>
    </div>
    <div class="st-detail-grid">
      <div class="st-detail-item">
        <span class="st-detail-label">Start Time</span>
        <div class="st-detail-value">${startDate.toLocaleString()}</div>
      </div>
      <div class="st-detail-item">
        <span class="st-detail-label">End Time</span>
        <div class="st-detail-value">${endDate.toLocaleString()}</div>
      </div>
      <div class="st-detail-item">
        <span class="st-detail-label">Duration</span>
        <div class="st-detail-value">${stFormatTime(session.duration)}</div>
      </div>
      <div class="st-detail-item">
        <span class="st-detail-label">Pause Count</span>
        <div class="st-detail-value">${session.pauseCount || 0}</div>
      </div>
    </div>
    ${session.notes ? `<div class="st-detail-notes"><span class="st-detail-notes-label">Notes</span><div class="st-detail-notes-text">${escHtml(session.notes)}</div></div>` : ''}
    <div style="margin-top:20px;text-align:right">
      <button class="btn btn-secondary" onclick="closeModal()">Close</button>
    </div>
  `;
}
}
}

function generateId() {
return '_' + Math.random().toString(36).substr(2, 9);
}

// ============================================
// FLASHCARDS
// ============================================
let fcDecks = stLoad('mt_fc_decks', []);
let fcCurrentDeckId = null;
let fcStudyCards = [];
let fcStudyIndex = 0;
let fcIsShuffled = false;

function fcRenderDecks() {
const grid = document.getElementById('fc-deck-grid');
if (!grid) return;

let html = `<div class="deck-card-new" onclick="fcCreateDeck()">
<div class="plus-icon">+</div>
<span>New Deck</span>

  </div>`;

fcDecks.forEach(deck => {
html += `<div class="deck-card"> <div class="deck-emoji">🃏</div> <div class="deck-name">${escHtml(deck.name)}</div> <div class="deck-count">${deck.cards.length} card${deck.cards.length !== 1 ? 's' : ''}</div> <div class="deck-actions"> <button onclick="fcOpenDeck('${deck.id}')">Edit</button> <button onclick="event.stopPropagation(); fcStudyDeckDirect('${deck.id}')">Study</button> <button onclick="event.stopPropagation(); fcRenameDeck('${deck.id}')" title="Rename">✎</button> <button class="btn-danger" onclick="event.stopPropagation(); fcDeleteDeck('${deck.id}')">✕</button> </div> </div>`;
});

if (fcDecks.length === 0) {
html += `<div class="empty-state" style="grid-column:1/-1"> <div class="empty-icon">🃏</div> <p>No decks yet - create your first one!</p> </div>`;
}

grid.innerHTML = html;
}

function escHtml(str) {
const el = document.createElement('span');
el.textContent = str;
return el.innerHTML;
}

function fcCreateDeck() {
showModal('New Flashcard Deck', [
{ id: 'md-deck-name', label: 'Deck Name', placeholder: 'e.g. AP Calc Derivatives' }
], (values) => {
const name = values['md-deck-name'].trim();
if (!name) return;
const deck = { id: generateId(), name, cards: [], created: Date.now() };
fcDecks.push(deck);
stSave('mt_fc_decks', fcDecks);
closeModal();
fcOpenDeck(deck.id);
});
}

function fcRenameDeck(deckId) {
const deck = fcDecks.find(d => d.id === deckId);
if (!deck) return;
showModal('Rename Deck', [
{ id: 'md-deck-rename', label: 'New Name', placeholder: deck.name, value: deck.name }
], (values) => {
const name = values['md-deck-rename'].trim();
if (!name) return;
deck.name = name;
stSave('mt_fc_decks', fcDecks);
closeModal();
fcRenderDecks();
if (fcCurrentDeckId === deckId) {
document.getElementById('fc-editor-title').textContent = name;
}
});
}

function fcDeleteDeck(deckId) {
const deck = fcDecks.find(d => d.id === deckId);
if (!deck) return;
if (!confirm(`Delete "${deck.name}" and all its cards? This can't be undone.`)) return;
fcDecks = fcDecks.filter(d => d.id !== deckId);
stSave('mt_fc_decks', fcDecks);
fcRenderDecks();
}

function fcOpenDeck(deckId) {
fcCurrentDeckId = deckId;
const deck = fcDecks.find(d => d.id === deckId);
if (!deck) return;

document.getElementById('fc-deck-list').style.display = 'none';
document.getElementById('fc-deck-editor').style.display = 'block';
document.getElementById('fc-study-mode').style.display = 'none';

document.getElementById('fc-editor-title').textContent = deck.name;
fcRenderCardList();
}

function fcBackToDecks() {
document.getElementById('fc-deck-list').style.display = 'block';
document.getElementById('fc-deck-editor').style.display = 'none';
document.getElementById('fc-study-mode').style.display = 'none';
fcCurrentDeckId = null;
fcRenderDecks();
}

function fcRenderCardList() {
const deck = fcDecks.find(d => d.id === fcCurrentDeckId);
if (!deck) return;

document.getElementById('fc-editor-count').textContent = `${deck.cards.length} card${deck.cards.length !== 1 ? 's' : ''}`;

const list = document.getElementById('fc-card-list');
if (deck.cards.length === 0) {
list.innerHTML = `<div class="empty-state"> <div class="empty-icon">📝</div> <p>No cards yet - add your first one below.</p> </div>`;
return;
}

list.innerHTML = deck.cards.map((card, i) => `<div class="card-editor-row"> <div class="card-num">Card ${i + 1}</div> <input type="text" class="form-input" value="${escHtml(card.front)}" onchange="fcUpdateCard(${i}, 'front', this.value)"> <input type="text" class="form-input" value="${escHtml(card.back)}" onchange="fcUpdateCard(${i}, 'back', this.value)"> <button class="card-delete-btn" onclick="fcDeleteCard(${i})" title="Delete">✕</button> </div>`).join('');
}

function fcAddCard() {
const deck = fcDecks.find(d => d.id === fcCurrentDeckId);
if (!deck) return;

const front = document.getElementById('fc-new-front').value.trim();
const back = document.getElementById('fc-new-back').value.trim();
if (!front || !back) return;

deck.cards.push({ front, back });
stSave('mt_fc_decks', fcDecks);

document.getElementById('fc-new-front').value = '';
document.getElementById('fc-new-back').value = '';
document.getElementById('fc-new-front').focus();

fcRenderCardList();
}

function fcUpdateCard(index, side, value) {
const deck = fcDecks.find(d => d.id === fcCurrentDeckId);
if (!deck || !deck.cards[index]) return;
deck.cards[index][side] = value;
stSave('mt_fc_decks', fcDecks);
}

function fcDeleteCard(index) {
const deck = fcDecks.find(d => d.id === fcCurrentDeckId);
if (!deck) return;
deck.cards.splice(index, 1);
stSave('mt_fc_decks', fcDecks);
fcRenderCardList();
}

// -- STUDY MODE --
function fcStudyDeckDirect(deckId) {
fcCurrentDeckId = deckId;
fcOpenDeck(deckId);
fcStartStudy();
}

function fcStartStudy(shuffled) {
shuffled = shuffled || false;
const deck = fcDecks.find(d => d.id === fcCurrentDeckId);
if (!deck || deck.cards.length === 0) {
alert('Add some cards first!');
return;
}

fcStudyCards = deck.cards.slice();
fcIsShuffled = shuffled;

if (shuffled) {
for (let i = fcStudyCards.length - 1; i > 0; i--) {
const j = Math.floor(Math.random() * (i + 1));
[fcStudyCards[i], fcStudyCards[j]] = [fcStudyCards[j], fcStudyCards[i]];
}
}

fcStudyIndex = 0;

document.getElementById('fc-deck-list').style.display = 'none';
document.getElementById('fc-deck-editor').style.display = 'none';
document.getElementById('fc-study-mode').style.display = 'block';

var badgeArea = document.getElementById('fc-shuffle-badge-area');
badgeArea.innerHTML = shuffled ? '<span class="shuffle-badge">🔀 Shuffled</span>' : '';

fcRenderStudyCard();
}

function fcShuffleStudy() { fcStartStudy(true); }

function fcRenderStudyCard() {
var card = fcStudyCards[fcStudyIndex];
if (!card) return;

document.getElementById('fc-front-text').textContent = card.front;
document.getElementById('fc-back-text').textContent = card.back;
document.getElementById('fc-inner').classList.remove('flipped');

var total = fcStudyCards.length;
var current = fcStudyIndex + 1;
document.getElementById('fc-study-progress').textContent = 'Card ' + current + ' of ' + total;
document.getElementById('fc-progress-fill').style.width = ((current / total) * 100) + '%';
}

function fcFlip() {
document.getElementById('fc-inner').classList.toggle('flipped');
}

function fcNext() {
if (fcStudyIndex < fcStudyCards.length - 1) {
fcStudyIndex++;
fcRenderStudyCard();
}
}

function fcPrev() {
if (fcStudyIndex > 0) {
fcStudyIndex--;
fcRenderStudyCard();
}
}

function fcBackToEditor() {
document.getElementById('fc-study-mode').style.display = 'none';
document.getElementById('fc-deck-editor').style.display = 'block';
}

// Keyboard shortcuts for study mode
document.addEventListener('keydown', function(e) {
var studyMode = document.getElementById('fc-study-mode');
if (!studyMode || studyMode.style.display === 'none') return;
if (['INPUT', 'TEXTAREA', 'SELECT'].indexOf(document.activeElement.tagName) !== -1) return;

if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'ArrowDown') {
e.preventDefault();
fcFlip();
} else if (e.code === 'ArrowRight') {
e.preventDefault();
fcNext();
} else if (e.code === 'ArrowLeft') {
e.preventDefault();
fcPrev();
}
});

// ============================================
// QUIZ MAKER
// ============================================
var qzQuizzes = stLoad('mt_qz_quizzes', []);
var qzCurrentQuizId = null;
var qzAnswers = {};

function qzRenderList() {
var grid = document.getElementById('qz-quiz-grid');
if (!grid) return;

var html = '<div class="deck-card-new" onclick="qzCreateQuiz()">' +
'<div class="plus-icon">+</div><span>New Quiz</span></div>';

qzQuizzes.forEach(function(quiz) {
html += '<div class="deck-card">' +
'<div class="deck-emoji">✏️</div>' +
'<div class="deck-name">' + escHtml(quiz.name) + '</div>' +
'<div class="deck-count">' + quiz.questions.length + ' question' + (quiz.questions.length !== 1 ? 's' : '') + '</div>' +
'<div class="deck-actions">' +
'<button onclick="qzOpenEditor(\'' + quiz.id + '\')">Edit</button>' +
'<button onclick="event.stopPropagation(); qzTakeQuizDirect(\'' + quiz.id + '\')">Take</button>' +
'<button onclick="event.stopPropagation(); qzRenameQuiz(\'' + quiz.id + '\')" title="Rename">✎</button>' +
'<button class="btn-danger" onclick="event.stopPropagation(); qzDeleteQuiz(\'' + quiz.id + '\')">✕</button>' +
'</div></div>';
});

if (qzQuizzes.length === 0) {
html += '<div class="empty-state" style="grid-column:1/-1">' +
'<div class="empty-icon">✏️</div>' +
'<p>No quizzes yet - create your first one!</p></div>';
}

grid.innerHTML = html;
}

function qzCreateQuiz() {
showModal('New Quiz', [
{ id: 'md-quiz-name', label: 'Quiz Name', placeholder: 'e.g. Chapter 5 Review' }
], function(values) {
var name = values['md-quiz-name'].trim();
if (!name) return;
var quiz = { id: generateId(), name: name, questions: [], created: Date.now() };
qzQuizzes.push(quiz);
stSave('mt_qz_quizzes', qzQuizzes);
closeModal();
qzOpenEditor(quiz.id);
});
}

function qzRenameQuiz(quizId) {
var quiz = qzQuizzes.find(function(q) { return q.id === quizId; });
if (!quiz) return;
showModal('Rename Quiz', [
{ id: 'md-quiz-rename', label: 'New Name', placeholder: quiz.name, value: quiz.name }
], function(values) {
var name = values['md-quiz-rename'].trim();
if (!name) return;
quiz.name = name;
stSave('mt_qz_quizzes', qzQuizzes);
closeModal();
qzRenderList();
if (qzCurrentQuizId === quizId) {
document.getElementById('qz-editor-title').textContent = name;
}
});
}

function qzDeleteQuiz(quizId) {
var quiz = qzQuizzes.find(function(q) { return q.id === quizId; });
if (!quiz) return;
if (!confirm("Delete \"" + quiz.name + "\"? This can't be undone.")) return;
qzQuizzes = qzQuizzes.filter(function(q) { return q.id !== quizId; });
stSave('mt_qz_quizzes', qzQuizzes);
qzRenderList();
}

function qzShowView(view) {
['qz-quiz-list', 'qz-editor', 'qz-take-mode', 'qz-results'].forEach(function(id) {
document.getElementById(id).style.display = 'none';
});
document.getElementById(view).style.display = 'block';
}

function qzBackToList() {
qzCurrentQuizId = null;
qzShowView('qz-quiz-list');
qzRenderList();
}

function qzBackToEditor() {
qzShowView('qz-editor');
qzRenderEditor();
}

function qzOpenEditor(quizId) {
qzCurrentQuizId = quizId;
qzShowView('qz-editor');
qzRenderEditor();
}

function qzRenderEditor() {
var quiz = qzQuizzes.find(function(q) { return q.id === qzCurrentQuizId; });
if (!quiz) return;

document.getElementById('qz-editor-title').textContent = quiz.name;
document.getElementById('qz-editor-count').textContent = quiz.questions.length + ' question' + (quiz.questions.length !== 1 ? 's' : '');

var container = document.getElementById('qz-question-editor-list');

if (quiz.questions.length === 0) {
container.innerHTML = '<div class="empty-state">' +
'<div class="empty-icon">📝</div>' +
'<p>No questions yet - add one below.</p></div>';
return;
}

var letters = ['A', 'B', 'C', 'D'];

container.innerHTML = quiz.questions.map(function(q, qi) {
var isMC = q.type === 'mc';
var html = '<div class="quiz-editor-question">' +
'<div class="qe-header">' +
'<span class="qe-number">Question ' + (qi + 1) + '</span>' +
'<div style="display:flex;gap:6px;align-items:center">' +
'<div class="qe-type-toggle">' +
'<button class="qe-type-btn ' + (isMC ? 'active' : '') + '" onclick="qzChangeType(' + qi + ', \'mc\')">MC</button>' +
'<button class="qe-type-btn ' + (!isMC ? 'active' : '') + '" onclick="qzChangeType(' + qi + ', \'tf\')">T/F</button>' +
'</div>' +
'<button class="card-delete-btn" onclick="qzDeleteQuestion(' + qi + ')" title="Delete">✕</button>' +
'</div>' +
'</div>' +
'<div class="form-group" style="margin-bottom:10px">' +
'<input type="text" class="form-input" value="' + escHtml(q.question) + '" placeholder="Enter question..." onchange="qzUpdateQuestion(' + qi + ', \'question\', this.value)">' +
'</div>';

if (isMC) {
  html += '<div class="qe-options">';
  q.options.forEach(function(opt, oi) {
    html += '<div class="qe-option-row">' +
      '<input type="radio" class="qe-correct-radio" name="qe-correct-' + qi + '" ' + (q.correct === oi ? 'checked' : '') + ' onchange="qzSetCorrect(' + qi + ', ' + oi + ')" title="Mark as correct">' +
      '<input type="text" class="form-input" value="' + escHtml(opt) + '" placeholder="Option ' + letters[oi] + '" onchange="qzUpdateOption(' + qi + ', ' + oi + ', this.value)">' +
    '</div>';
  });
  html += '</div>';
} else {
  html += '<div class="qe-options">' +
    '<div class="qe-option-row">' +
      '<input type="radio" class="qe-correct-radio" name="qe-correct-' + qi + '" ' + (q.correct === 0 ? 'checked' : '') + ' onchange="qzSetCorrect(' + qi + ', 0)">' +
      '<span style="font-size:14px;color:var(--text-secondary)">True</span>' +
    '</div>' +
    '<div class="qe-option-row">' +
      '<input type="radio" class="qe-correct-radio" name="qe-correct-' + qi + '" ' + (q.correct === 1 ? 'checked' : '') + ' onchange="qzSetCorrect(' + qi + ', 1)">' +
      '<span style="font-size:14px;color:var(--text-secondary)">False</span>' +
    '</div></div>';
}

html += '</div>';
return html;

}).join('');
}

function qzAddQuestion(type) {
var quiz = qzQuizzes.find(function(q) { return q.id === qzCurrentQuizId; });
if (!quiz) return;

if (type === 'mc') {
quiz.questions.push({ type: 'mc', question: '', options: ['', '', '', ''], correct: 0 });
} else {
quiz.questions.push({ type: 'tf', question: '', options: ['True', 'False'], correct: 0 });
}

stSave('mt_qz_quizzes', qzQuizzes);
qzRenderEditor();
}

function qzUpdateQuestion(qi, field, value) {
var quiz = qzQuizzes.find(function(q) { return q.id === qzCurrentQuizId; });
if (!quiz || !quiz.questions[qi]) return;
quiz.questions[qi][field] = value;
stSave('mt_qz_quizzes', qzQuizzes);
}

function qzUpdateOption(qi, oi, value) {
var quiz = qzQuizzes.find(function(q) { return q.id === qzCurrentQuizId; });
if (!quiz || !quiz.questions[qi]) return;
quiz.questions[qi].options[oi] = value;
stSave('mt_qz_quizzes', qzQuizzes);
}

function qzSetCorrect(qi, oi) {
var quiz = qzQuizzes.find(function(q) { return q.id === qzCurrentQuizId; });
if (!quiz || !quiz.questions[qi]) return;
quiz.questions[qi].correct = oi;
stSave('mt_qz_quizzes', qzQuizzes);
}

function qzChangeType(qi, newType) {
var quiz = qzQuizzes.find(function(q) { return q.id === qzCurrentQuizId; });
if (!quiz || !quiz.questions[qi]) return;
var q = quiz.questions[qi];
if (q.type === newType) return;
q.type = newType;
if (newType === 'mc') {
q.options = ['', '', '', ''];
} else {
q.options = ['True', 'False'];
}
q.correct = 0;
stSave('mt_qz_quizzes', qzQuizzes);
qzRenderEditor();
}

function qzDeleteQuestion(qi) {
var quiz = qzQuizzes.find(function(q) { return q.id === qzCurrentQuizId; });
if (!quiz) return;
quiz.questions.splice(qi, 1);
stSave('mt_qz_quizzes', qzQuizzes);
qzRenderEditor();
}

// -- TAKE QUIZ --
function qzTakeQuizDirect(quizId) {
qzCurrentQuizId = quizId;
qzOpenEditor(quizId);
qzStartQuiz();
}

// Holds the (possibly shuffled) questions used during an active quiz
var qzActiveQuestions = [];
var qzIsShuffled = false;

function qzShuffleQuiz() { qzStartQuiz(true); }

function qzStartQuiz(shuffled) {
shuffled = shuffled || false;
var quiz = qzQuizzes.find(function(q) { return q.id === qzCurrentQuizId; });
if (!quiz || quiz.questions.length === 0) {
alert('Add some questions first!');
return;
}

var incomplete = quiz.questions.find(function(q) { return !q.question.trim(); });
if (incomplete) {
alert('Some questions are empty - fill them in first.');
return;
}

qzIsShuffled = shuffled;
qzActiveQuestions = quiz.questions.slice();
if (shuffled) {
  for (var i = qzActiveQuestions.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = qzActiveQuestions[i];
    qzActiveQuestions[i] = qzActiveQuestions[j];
    qzActiveQuestions[j] = tmp;
  }
}

qzAnswers = {};
qzShowView('qz-take-mode');

var badgeArea = document.getElementById('qz-shuffle-badge-area');
if (badgeArea) badgeArea.innerHTML = shuffled ? '<span class="shuffle-badge">🔀 Shuffled</span>' : '';

var container = document.getElementById('qz-questions-container');
var letters = ['A', 'B', 'C', 'D'];

container.innerHTML = qzActiveQuestions.map(function(q, qi) {
var html = '<div class="quiz-question-block" id="qz-block-' + qi + '">' +
'<div class="quiz-q-number">Question ' + (qi + 1) + ' of ' + qzActiveQuestions.length + '</div>' +
'<div class="quiz-q-text">' + escHtml(q.question) + '</div>';

if (q.type === 'tf') {
  html += '<div class="quiz-tf-row">' +
    '<div class="quiz-option" onclick="qzSelectAnswer(' + qi + ', 0)" id="qz-opt-' + qi + '-0">True</div>' +
    '<div class="quiz-option" onclick="qzSelectAnswer(' + qi + ', 1)" id="qz-opt-' + qi + '-1">False</div>' +
  '</div>';
} else {
  html += '<div class="quiz-options">';
  q.options.forEach(function(opt, oi) {
    html += '<div class="quiz-option" onclick="qzSelectAnswer(' + qi + ', ' + oi + ')" id="qz-opt-' + qi + '-' + oi + '">' +
      '<span class="quiz-option-letter">' + letters[oi] + '</span>' +
      '<span>' + escHtml(opt) + '</span></div>';
  });
  html += '</div>';
}

html += '</div>';
return html;

}).join('');

document.getElementById('qz-submit-btn').style.display = 'inline-flex';
}

function qzSelectAnswer(qi, oi) {
var q = qzActiveQuestions[qi];
if (!q) return;

q.options.forEach(function(_, optIdx) {
var el = document.getElementById('qz-opt-' + qi + '-' + optIdx);
if (el) el.classList.remove('selected');
});

var el = document.getElementById('qz-opt-' + qi + '-' + oi);
if (el) el.classList.add('selected');
qzAnswers[qi] = oi;
}

function qzSubmit() {
if (!qzActiveQuestions || qzActiveQuestions.length === 0) return;

var total = qzActiveQuestions.length;
var unanswered = total - Object.keys(qzAnswers).length;
if (unanswered > 0) {
if (!confirm('You have ' + unanswered + ' unanswered question' + (unanswered > 1 ? 's' : '') + '. Submit anyway?')) return;
}

var correct = 0;
var results = qzActiveQuestions.map(function(q, qi) {
var userAnswer = qzAnswers[qi] !== undefined ? qzAnswers[qi] : -1;
var isCorrect = userAnswer === q.correct;
if (isCorrect) correct++;
return { userAnswer: userAnswer, correctAnswer: q.correct, isCorrect: isCorrect };
});

var pct = Math.round((correct / total) * 100);

qzShowView('qz-results');

var message = '';
if (pct === 100) message = 'Perfect score! Absolutely elite - George Kittle TD celebration energy.';
else if (pct >= 90) message = 'Outstanding - first-team All-Pro caliber performance.';
else if (pct >= 80) message = 'Solid - like a reliable tight end running clean routes every snap.';
else if (pct >= 70) message = 'Not bad - a few dropped passes to clean up though.';
else if (pct >= 60) message = 'Decent effort - the playbook needs more reps.';
else message = "Back to the film room - keep studying and you'll get there!";

document.getElementById('qz-score-box').innerHTML =
'<div class="quiz-score-number">' + pct + '%</div>' +
'<div class="quiz-score-label">' + correct + ' of ' + total + ' correct</div>' +
'<div class="quiz-score-message">' + message + '</div>';

var letters = ['A', 'B', 'C', 'D'];
var review = document.getElementById('qz-results-review');

review.innerHTML = qzActiveQuestions.map(function(q, qi) {
var r = results[qi];
var blockClass = r.isCorrect ? 'correct' : 'incorrect';

var html = '<div class="quiz-question-block ' + blockClass + '">' +
  '<div class="quiz-q-number">' + (r.isCorrect ? '✓ Correct' : '✗ Incorrect') + ' - Question ' + (qi + 1) + '</div>' +
  '<div class="quiz-q-text">' + escHtml(q.question) + '</div>';

if (q.type === 'tf') {
  html += '<div class="quiz-tf-row">';
  ['True', 'False'].forEach(function(label, oi) {
    var cls = '';
    if (oi === q.correct) cls = 'reveal-correct';
    else if (oi === r.userAnswer && !r.isCorrect) cls = 'reveal-wrong';
    html += '<div class="quiz-option ' + cls + '">' + label + '</div>';
  });
  html += '</div>';
} else {
  html += '<div class="quiz-options">';
  q.options.forEach(function(opt, oi) {
    var cls = '';
    if (oi === q.correct) cls = 'reveal-correct';
    else if (oi === r.userAnswer && !r.isCorrect) cls = 'reveal-wrong';
    html += '<div class="quiz-option ' + cls + '">' +
      '<span class="quiz-option-letter">' + letters[oi] + '</span>' +
      '<span>' + escHtml(opt) + '</span></div>';
  });
  html += '</div>';
}

html += '</div>';
return html;

}).join('');
}

// ============================================
// MODAL HELPER
// ============================================
function showModal(title, fields, onSubmit) {
var existing = document.getElementById('app-modal');
if (existing) existing.remove();

var overlay = document.createElement('div');
overlay.className = 'modal-overlay';
overlay.id = 'app-modal';
overlay.onclick = function(e) { if (e.target === overlay) closeModal(); };

var fieldsHtml = fields.map(function(f) {
return '<div class="form-group">' +
'<label class="form-label">' + f.label + '</label>' +
'<input type="text" class="form-input" id="' + f.id + '" placeholder="' + (f.placeholder || '') + '" value="' + (f.value || '') + '">' +
'</div>';
}).join('');

overlay.innerHTML = '<div class="modal-box">' +
'<div class="modal-title">' + title + '</div>' +
fieldsHtml +
'<div class="btn-group" style="justify-content:flex-end">' +
'<button class="btn btn-secondary" onclick="closeModal()">Cancel</button>' +
'<button class="btn btn-primary" id="modal-submit-btn">Create</button>' +
'</div></div>';

document.body.appendChild(overlay);

setTimeout(function() {
var firstInput = overlay.querySelector('input');
if (firstInput) firstInput.focus();
}, 100);

document.getElementById('modal-submit-btn').onclick = function() {
var values = {};
fields.forEach(function(f) { values[f.id] = document.getElementById(f.id).value; });
onSubmit(values);
};

fields.forEach(function(f) {
var input = document.getElementById(f.id);
if (input) {
input.addEventListener('keydown', function(e) {
if (e.key === 'Enter') document.getElementById('modal-submit-btn').click();
});
}
});
}

function closeModal() {
var modal = document.getElementById('app-modal');
if (modal) modal.remove();
}

// ============================================
// GRAMMAR CHECKER
// ============================================
var gcIssues = [];
var gcFixedText = '';

function gcCheck() {
  const input = document.getElementById('gc-input').value;
  const wordCount = input.trim().split(/\s+/).filter(w => w.length > 0).length;
  const charCount = input.length;
  document.getElementById('gc-word-count').textContent = `${wordCount} words · ${charCount} characters`;

  if (!input.trim()) {
    document.getElementById('gc-results-area').style.display = 'none';
    return;
  }

  // Simple grammar/spelling checks
  gcIssues = [];
  gcFixedText = input;

  // Check for double spaces
  const doubleSpaceMatches = input.matchAll(/  +/g);
  for (const match of doubleSpaceMatches) {
    gcIssues.push({
      type: 'punctuation',
      message: 'Extra space detected',
      suggestion: 'Remove extra spaces',
      start: match.index,
      end: match.index + match[0].length,
      replacement: ' '
    });
  }

  // --- SPELLING PATTERNS ---
  const spellingPatterns = [
    { regex: /\bteh\b/gi, fix: 'the' },
    { regex: /\brecieve\b/gi, fix: 'receive' },
    { regex: /\boccured\b/gi, fix: 'occurred' },
    { regex: /\btaht\b/gi, fix: 'that' },
    { regex: /\bdefinately\b/gi, fix: 'definitely' },
    { regex: /\bseperate\b/gi, fix: 'separate' },
    { regex: /\baccomodate\b/gi, fix: 'accommodate' },
    { regex: /\boccurence\b/gi, fix: 'occurrence' },
    { regex: /\bneccessary\b/gi, fix: 'necessary' },
    { regex: /\bneccesary\b/gi, fix: 'necessary' },
    { regex: /\bwierd\b/gi, fix: 'weird' },
    { regex: /\bbeleive\b/gi, fix: 'believe' },
    { regex: /\bbelive\b/gi, fix: 'believe' },
    { regex: /\bacheive\b/gi, fix: 'achieve' },
    { regex: /\barguement\b/gi, fix: 'argument' },
    { regex: /\bbegining\b/gi, fix: 'beginning' },
    { regex: /\bcalender\b/gi, fix: 'calendar' },
    { regex: /\bcommitee\b/gi, fix: 'committee' },
    { regex: /\bcomittee\b/gi, fix: 'committee' },
    { regex: /\bconcious\b/gi, fix: 'conscious' },
    { regex: /\benviroment\b/gi, fix: 'environment' },
    { regex: /\bexplaination\b/gi, fix: 'explanation' },
    { regex: /\bforiegn\b/gi, fix: 'foreign' },
    { regex: /\bgoverment\b/gi, fix: 'government' },
    { regex: /\bgovernement\b/gi, fix: 'government' },
    { regex: /\bgrammer\b/gi, fix: 'grammar' },
    { regex: /\bindependant\b/gi, fix: 'independent' },
    { regex: /\bknowlege\b/gi, fix: 'knowledge' },
    { regex: /\bmispell\b/gi, fix: 'misspell' },
    { regex: /\bnoticable\b/gi, fix: 'noticeable' },
    { regex: /\brestarant\b/gi, fix: 'restaurant' },
    { regex: /\bresturaunt\b/gi, fix: 'restaurant' },
    { regex: /\bsentance\b/gi, fix: 'sentence' },
    { regex: /\btommorow\b/gi, fix: 'tomorrow' },
    { regex: /\btommorrow\b/gi, fix: 'tomorrow' },
    { regex: /\buntill\b/gi, fix: 'until' },
    { regex: /\bwritting\b/gi, fix: 'writing' },
    { regex: /\bthier\b/gi, fix: 'their' },
    { regex: /\bfreind\b/gi, fix: 'friend' },
    { regex: /\bbeautifull\b/gi, fix: 'beautiful' },
    { regex: /\bsuccesful\b/gi, fix: 'successful' },
    { regex: /\bsuccessfull\b/gi, fix: 'successful' },
    { regex: /\bdissapear\b/gi, fix: 'disappear' },
    { regex: /\bdisapear\b/gi, fix: 'disappear' },
    { regex: /\bembarass\b/gi, fix: 'embarrass' },
    { regex: /\bguarantee\b/gi, fix: null },
    { regex: /\bgaurante\b/gi, fix: 'guarantee' },
    { regex: /\bgaruntee\b/gi, fix: 'guarantee' },
    { regex: /\bharrass\b/gi, fix: 'harass' },
    { regex: /\bimediately\b/gi, fix: 'immediately' },
    { regex: /\bimmediatly\b/gi, fix: 'immediately' },
    { regex: /\bliason\b/gi, fix: 'liaison' },
    { regex: /\bmillenium\b/gi, fix: 'millennium' },
    { regex: /\bneice\b/gi, fix: 'niece' },
    { regex: /\bpersue\b/gi, fix: 'pursue' },
    { regex: /\bprivelege\b/gi, fix: 'privilege' },
    { regex: /\bprivilege\b/gi, fix: null },
    { regex: /\brythm\b/gi, fix: 'rhythm' },
    { regex: /\brhythm\b/gi, fix: null },
    { regex: /\bsuprise\b/gi, fix: 'surprise' },
    { regex: /\bwether\b/gi, fix: 'whether' },
    { regex: /\bwhich\b/gi, fix: null },
    { regex: /\bpossesion\b/gi, fix: 'possession' },
    { regex: /\brefered\b/gi, fix: 'referred' },
    { regex: /\breferance\b/gi, fix: 'reference' },
    { regex: /\batempt\b/gi, fix: 'attempt' },
    { regex: /\bapparent\b/gi, fix: null },
    { regex: /\bapperance\b/gi, fix: 'appearance' },
    { regex: /\baudiance\b/gi, fix: 'audience' },
    { regex: /\bbuisness\b/gi, fix: 'business' },
    { regex: /\bcompletly\b/gi, fix: 'completely' },
    { regex: /\bdifferant\b/gi, fix: 'different' },
    { regex: /\bexperiance\b/gi, fix: 'experience' },
    { regex: /\bfinally\b/gi, fix: null },
    { regex: /\bfinaly\b/gi, fix: 'finally' },
    { regex: /\bgeneraly\b/gi, fix: 'generally' },
    { regex: /\bhappend\b/gi, fix: 'happened' },
    { regex: /\bhavent\b/gi, fix: "haven't" },
    { regex: /\bdidnt\b/gi, fix: "didn't" },
    { regex: /\bdoesnt\b/gi, fix: "doesn't" },
    { regex: /\bwasnt\b/gi, fix: "wasn't" },
    { regex: /\bwerent\b/gi, fix: "weren't" },
    { regex: /\bwouldnt\b/gi, fix: "wouldn't" },
    { regex: /\bcouldnt\b/gi, fix: "couldn't" },
    { regex: /\bshouldnt\b/gi, fix: "shouldn't" },
    { regex: /\bisnt\b/gi, fix: "isn't" },
    { regex: /\barent\b/gi, fix: "aren't" },
    { regex: /\bwont\b/gi, fix: "won't" },
    { regex: /\bdont\b/gi, fix: "don't" },
    { regex: /\bcant\b/gi, fix: "can't" },
    { regex: /\boccasionaly\b/gi, fix: 'occasionally' },
    { regex: /\bparticularly\b/gi, fix: null },
    { regex: /\bparticularly\b/gi, fix: null },
    { regex: /\bparticlarly\b/gi, fix: 'particularly' },
    { regex: /\bprobably\b/gi, fix: null },
    { regex: /\bprobaly\b/gi, fix: 'probably' },
    { regex: /\breally\b/gi, fix: null },
    { regex: /\brealy\b/gi, fix: 'really' },
    { regex: /\bsimiliar\b/gi, fix: 'similar' },
    { regex: /\bsincerly\b/gi, fix: 'sincerely' },
    { regex: /\bspecialy\b/gi, fix: 'specially' },
    { regex: /\bstrenth\b/gi, fix: 'strength' },
    { regex: /\bthough\b/gi, fix: null },
    { regex: /\bthougt\b/gi, fix: 'thought' },
    { regex: /\bthough\b/gi, fix: null },
    { regex: /\bthrought\b/gi, fix: 'through' },
    { regex: /\btrough\b/gi, fix: 'through' },
    { regex: /\btogeather\b/gi, fix: 'together' },
    { regex: /\btruly\b/gi, fix: null },
    { regex: /\btruely\b/gi, fix: 'truly' },
    { regex: /\buntil\b/gi, fix: null },
    { regex: /\bvarious\b/gi, fix: null },
    { regex: /\bvarius\b/gi, fix: 'various' },
    { regex: /\bwednesday\b/gi, fix: null },
    { regex: /\bwensday\b/gi, fix: 'Wednesday' },
    { regex: /\bfeburary\b/gi, fix: 'February' },
    { regex: /\bjanuary\b/gi, fix: null },
    { regex: /\blibary\b/gi, fix: 'library' },
    { regex: /\babelity\b/gi, fix: 'ability' },
    { regex: /\babsense\b/gi, fix: 'absence' },
    { regex: /\bacademic\b/gi, fix: null },
    { regex: /\bacidentally\b/gi, fix: 'accidentally' },
    { regex: /\bacheivement\b/gi, fix: 'achievement' },
    { regex: /\backnowlege\b/gi, fix: 'acknowledge' },
    { regex: /\bagressive\b/gi, fix: 'aggressive' },
    { regex: /\bamatuer\b/gi, fix: 'amateur' },
    { regex: /\banalize\b/gi, fix: 'analyze' },
    { regex: /\bancient\b/gi, fix: null },
    { regex: /\banounce\b/gi, fix: 'announce' },
    { regex: /\banxious\b/gi, fix: null },
    { regex: /\bapologize\b/gi, fix: null },
    { regex: /\bapologise\b/gi, fix: null },
    { regex: /\bappologize\b/gi, fix: 'apologize' },
  ];

  // Only push issues for patterns that have a fix (skip null fixes which are just anchors)
  spellingPatterns.forEach(p => {
    if (p.fix === null) return;
    let match;
    const regex = new RegExp(p.regex.source, p.regex.flags);
    while ((match = regex.exec(input)) !== null) {
      const originalWord = match[0];
      const fixedWord = originalWord[0] === originalWord[0].toUpperCase()
        ? p.fix.charAt(0).toUpperCase() + p.fix.slice(1)
        : p.fix;
      gcIssues.push({
        type: 'spelling',
        message: `"${originalWord}" is likely misspelled`,
        suggestion: fixedWord,
        start: match.index,
        end: match.index + match[0].length,
        replacement: fixedWord
      });
      regex.lastIndex = match.index + 1;
    }
  });

  // --- GRAMMAR PATTERNS ---
  const grammarPatterns = [
    // Homophone: your + verb → you're + verb
    { regex: /\byour\s+(going|doing|being|making|coming|running|getting|trying|looking|working|playing|saying|thinking|taking|leaving|having|giving|telling|asking|using|moving|living|reading|writing|learning|sitting|standing|walking|talking|eating|sleeping|welcome|right|wrong|correct|sure|ready|able|supposed|allowed|invited|not)\b/gi, type: 'grammar', message: 'Possible confusion of "your" (possessive) with "you\'re" (you are)', suggFn: function(m) { return "you're " + m.match(/\s+(\S+)$/)[1]; } },
    // Homophone: there + verb → they're + verb
    { regex: /\bthere\s+(going|doing|being|making|coming|running|getting|trying|looking|working|playing|not|always|never|also|still|already|probably|usually)\b/gi, type: 'grammar', message: 'Possible confusion of "there" (place) with "they\'re" (they are)', suggFn: function(m) { return "they're " + m.match(/\s+(\S+)$/)[1]; } },
    // Homophone: its + common follow words → it's
    { regex: /\bits\s+(a|the|an|not|very|really|also|been|going|important|clear|possible|true|hard|easy|great|good|bad|best|worst|time|necessary|obvious|likely|unlikely)\b/gi, type: 'grammar', message: 'Possible confusion of "its" (possessive) with "it\'s" (it is)', suggFn: function(m) { return "it's " + m.match(/\s+(\S+)$/)[1]; } },
    // could/should/would/must of → have
    { regex: /\bcould\s+of\b/gi, type: 'grammar', message: '"Could of" should be "could have"', fix: 'could have' },
    { regex: /\bshould\s+of\b/gi, type: 'grammar', message: '"Should of" should be "should have"', fix: 'should have' },
    { regex: /\bwould\s+of\b/gi, type: 'grammar', message: '"Would of" should be "would have"', fix: 'would have' },
    { regex: /\bmust\s+of\b/gi, type: 'grammar', message: '"Must of" should be "must have"', fix: 'must have' },
    { regex: /\bmight\s+of\b/gi, type: 'grammar', message: '"Might of" should be "might have"', fix: 'might have' },
    // Subject-verb agreement
    { regex: /\bhe\s+don't\b/gi, type: 'grammar', message: 'Subject-verb agreement: use "doesn\'t" with "he"', fix: 'he doesn\'t' },
    { regex: /\bshe\s+don't\b/gi, type: 'grammar', message: 'Subject-verb agreement: use "doesn\'t" with "she"', fix: 'she doesn\'t' },
    { regex: /\bit\s+don't\b/gi, type: 'grammar', message: 'Subject-verb agreement: use "doesn\'t" with "it"', fix: 'it doesn\'t' },
    { regex: /\bthey\s+was\b/gi, type: 'grammar', message: 'Subject-verb agreement: use "were" with "they"', fix: 'they were' },
    { regex: /\bwe\s+was\b/gi, type: 'grammar', message: 'Subject-verb agreement: use "were" with "we"', fix: 'we were' },
    { regex: /\byou\s+was\b/gi, type: 'grammar', message: 'Subject-verb agreement: use "were" with "you"', fix: 'you were' },
    { regex: /\bhe\s+have\b/gi, type: 'grammar', message: 'Subject-verb agreement: use "has" with "he"', fix: 'he has' },
    { regex: /\bshe\s+have\b/gi, type: 'grammar', message: 'Subject-verb agreement: use "has" with "she"', fix: 'she has' },
    { regex: /\bit\s+have\b/gi, type: 'grammar', message: 'Subject-verb agreement: use "has" with "it"', fix: 'it has' },
    { regex: /\bi\s+is\b/gi, type: 'grammar', message: 'Subject-verb agreement: use "am" with "I"', fix: 'I am' },
    { regex: /\bi\s+has\b/gi, type: 'grammar', message: 'Subject-verb agreement: use "have" with "I"', fix: 'I have' },
    { regex: /\bhe\s+go\b/gi, type: 'grammar', message: 'Subject-verb agreement: use "goes" with "he"', fix: 'he goes' },
    { regex: /\bshe\s+go\b/gi, type: 'grammar', message: 'Subject-verb agreement: use "goes" with "she"', fix: 'she goes' },
    { regex: /\bit\s+go\b/gi, type: 'grammar', message: 'Subject-verb agreement: use "goes" with "it"', fix: 'it goes' },
    // Common mistakes
    { regex: /\bsuppose\s+to\b/gi, type: 'grammar', message: '"Suppose to" should be "supposed to"', fix: 'supposed to' },
    { regex: /\buse\s+to\b/gi, type: 'grammar', message: '"Use to" should be "used to"', fix: 'used to' },
    { regex: /\balot\b/gi, type: 'grammar', message: '"Alot" is not a word — use "a lot"', fix: 'a lot' },
    { regex: /\byour\s+a\b/gi, type: 'grammar', message: '"Your a" should be "you\'re a"', fix: "you're a" },
    { regex: /\byour\s+an\b/gi, type: 'grammar', message: '"Your an" should be "you\'re an"', fix: "you're an" },
    // then/than confusion
    { regex: /\bbetter\s+then\b/gi, type: 'grammar', message: 'Use "than" for comparisons, not "then"', fix: 'better than' },
    { regex: /\bworse\s+then\b/gi, type: 'grammar', message: 'Use "than" for comparisons, not "then"', fix: 'worse than' },
    { regex: /\bmore\s+then\b/gi, type: 'grammar', message: 'Use "than" for comparisons, not "then"', fix: 'more than' },
    { regex: /\bless\s+then\b/gi, type: 'grammar', message: 'Use "than" for comparisons, not "then"', fix: 'less than' },
    { regex: /\brather\s+then\b/gi, type: 'grammar', message: 'Use "than" for comparisons, not "then"', fix: 'rather than' },
    { regex: /\bother\s+then\b/gi, type: 'grammar', message: 'Use "than" after "other", not "then"', fix: 'other than' },
    // affect/effect confusion
    { regex: /\bthe\s+affect\b/gi, type: 'grammar', message: '"Affect" is usually a verb; "effect" is usually a noun', fix: 'the effect' },
    { regex: /\ban\s+affect\b/gi, type: 'grammar', message: '"Affect" is usually a verb; "effect" is usually a noun', fix: 'an effect' },
    // Miscellaneous
    { regex: /\bi\s+could\s+care\s+less\b/gi, type: 'grammar', message: 'The correct phrase is "I couldn\'t care less"', fix: "I couldn't care less" },
    { regex: /\bfor\s+all\s+intensive\s+purposes\b/gi, type: 'grammar', message: 'The correct phrase is "for all intents and purposes"', fix: 'for all intents and purposes' },
    { regex: /\bshould\s+of\s+went\b/gi, type: 'grammar', message: 'Use "should have gone"', fix: 'should have gone' },
    { regex: /\birregardless\b/gi, type: 'grammar', message: '"Irregardless" is nonstandard — use "regardless"', fix: 'regardless' },
  ];

  grammarPatterns.forEach(p => {
    let match;
    const regex = new RegExp(p.regex.source, p.regex.flags);
    while ((match = regex.exec(input)) !== null) {
      const originalText = match[0];
      let fixText;
      if (p.suggFn) {
        fixText = p.suggFn(originalText);
      } else {
        fixText = p.fix;
      }
      // Preserve original capitalization for the first letter
      if (originalText[0] === originalText[0].toUpperCase() && fixText) {
        fixText = fixText.charAt(0).toUpperCase() + fixText.slice(1);
      }
      gcIssues.push({
        type: p.type,
        message: p.message,
        suggestion: fixText,
        start: match.index,
        end: match.index + match[0].length,
        replacement: fixText
      });
      regex.lastIndex = match.index + 1;
    }
  });

  // --- PUNCTUATION PATTERNS ---
  // Multiple periods
  const multiPeriodRegex = /\.{2,}/g;
  let mpMatch;
  while ((mpMatch = multiPeriodRegex.exec(input)) !== null) {
    // Skip ellipsis (exactly 3 dots)
    if (mpMatch[0].length === 3) continue;
    gcIssues.push({
      type: 'punctuation',
      message: 'Multiple periods detected',
      suggestion: '.',
      start: mpMatch.index,
      end: mpMatch.index + mpMatch[0].length,
      replacement: '.'
    });
  }

  // Missing space after punctuation
  const punctSpaceMatches = input.matchAll(/[.!?][a-zA-Z]/g);
  for (const match of punctSpaceMatches) {
    gcIssues.push({
      type: 'punctuation',
      message: 'Missing space after punctuation',
      suggestion: 'Add space after punctuation',
      start: match.index + 1,
      end: match.index + 2,
      replacement: ' ' + input[match.index + 1]
    });
  }

  // --- ARTICLE ERRORS: "a" before vowel sound ---
  const articleRegex = /\ba\s+(a[a-z]*|e[a-z]*|i[a-z]*|o[a-z]*|u[a-z]*)\b/gi;
  let artMatch;
  const articleExceptions = ['a', 'use', 'used', 'user', 'useful', 'union', 'unique', 'unit', 'united', 'universal', 'university', 'uniform', 'unicorn', 'usual', 'usually', 'utility', 'uranium', 'one', 'once', 'european'];
  while ((artMatch = articleRegex.exec(input)) !== null) {
    const followWord = artMatch[1].toLowerCase();
    if (articleExceptions.includes(followWord)) continue;
    const fixedArticle = artMatch[0][0] === 'A' ? 'An' : 'an';
    gcIssues.push({
      type: 'grammar',
      message: 'Use "an" before words starting with a vowel sound',
      suggestion: fixedArticle + ' ' + artMatch[1],
      start: artMatch.index,
      end: artMatch.index + artMatch[0].length,
      replacement: fixedArticle + ' ' + artMatch[1]
    });
  }

  // --- DOUBLE WORD DETECTION ---
  const doubleWordRegex = /\b(\w+)\s+\1\b/gi;
  let dwMatch;
  while ((dwMatch = doubleWordRegex.exec(input)) !== null) {
    gcIssues.push({
      type: 'grammar',
      message: `Repeated word: "${dwMatch[1]}"`,
      suggestion: dwMatch[1],
      start: dwMatch.index,
      end: dwMatch.index + dwMatch[0].length,
      replacement: dwMatch[1]
    });
    doubleWordRegex.lastIndex = dwMatch.index + dwMatch[1].length + 1;
  }

  // --- CAPITALIZATION: first character of text ---
  if (input.length > 0 && /[a-z]/.test(input[0])) {
    gcIssues.push({
      type: 'style',
      message: 'Sentence should start with a capital letter',
      suggestion: input[0].toUpperCase(),
      start: 0,
      end: 1,
      replacement: input[0].toUpperCase()
    });
  }

  // --- CAPITALIZATION: after sentence-ending punctuation ---
  const sentenceCapRegex = /[.!?]\s+([a-z])/g;
  let scMatch;
  while ((scMatch = sentenceCapRegex.exec(input)) !== null) {
    const lowerChar = scMatch[1];
    const charPos = scMatch.index + scMatch[0].length - 1;
    gcIssues.push({
      type: 'style',
      message: 'Capitalize the first word of a new sentence',
      suggestion: lowerChar.toUpperCase(),
      start: charPos,
      end: charPos + 1,
      replacement: lowerChar.toUpperCase()
    });
  }

  // --- STANDALONE LOWERCASE "i" ---
  const loneIRegex = /(?:^|[\s,;:!?])(i)(?=[\s,;:!?.'"]|$)/g;
  let liMatch;
  while ((liMatch = loneIRegex.exec(input)) !== null) {
    const iPos = liMatch.index + liMatch[0].indexOf('i');
    if (input[iPos] === 'i') {
      gcIssues.push({
        type: 'grammar',
        message: 'The pronoun "I" should always be capitalized',
        suggestion: 'I',
        start: iPos,
        end: iPos + 1,
        replacement: 'I'
      });
    }
    loneIRegex.lastIndex = liMatch.index + 1;
  }

  // Remove duplicates
  const uniqueIssues = [];
  const seen = new Set();
  gcIssues.forEach(issue => {
    const key = `${issue.start}-${issue.end}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueIssues.push(issue);
    }
  });
  gcIssues = uniqueIssues.sort((a, b) => a.start - b.start);

  // Display results
  gcRenderResults();
}

function gcRenderResults() {
  const resultsArea = document.getElementById('gc-results-area');
  resultsArea.style.display = 'block';

  const totalIssues = gcIssues.length;
  const score = Math.max(0, 100 - (totalIssues * 5));

  // Update score circle
  document.getElementById('gc-score-number').textContent = Math.round(score);
  const percentage = score / 100;
  const circumference = 2 * Math.PI * 52;
  const offset = circumference * (1 - percentage);
  document.getElementById('gc-ring-fill').style.strokeDashoffset = offset;

  // Update score label and detail
  let label = 'Excellent';
  if (score < 50) label = 'Poor';
  else if (score < 75) label = 'Fair';
  else if (score < 90) label = 'Good';
  document.getElementById('gc-score-label').textContent = label;
  document.getElementById('gc-score-detail').textContent = `${totalIssues} issue${totalIssues !== 1 ? 's' : ''} found`;

  // Render issue list
  const issueList = document.getElementById('gc-issue-list');
  issueList.innerHTML = '';

  if (totalIssues === 0) {
    document.getElementById('gc-no-issues').style.display = 'block';
    document.getElementById('gc-corrected-card').style.display = 'none';
  } else {
    document.getElementById('gc-no-issues').style.display = 'none';
    gcIssues.forEach((issue, i) => {
      const div = document.createElement('div');
      div.className = `gc-issue-item gc-issue-${issue.type}`;
      div.dataset.filter = issue.type;
      const text = document.getElementById('gc-input').value;
      const context = text.substring(Math.max(0, issue.start - 30), Math.min(text.length, issue.end + 30));
      div.innerHTML = `
        <div class="gc-issue-type">${issue.type.toUpperCase()}</div>
        <div class="gc-issue-body">
          <div class="gc-issue-message">${issue.message}</div>
          <div class="gc-issue-context">...${context}...</div>
          <div class="gc-issue-suggestion"><strong>Suggestion:</strong> ${issue.suggestion}</div>
        </div>
      `;
      issueList.appendChild(div);
    });
  }

  if (totalIssues > 0) {
    document.getElementById('gc-corrected-card').style.display = 'block';
    gcFixedText = gcApplyFixes(document.getElementById('gc-input').value);
    document.getElementById('gc-corrected-text').textContent = gcFixedText;
  }
}

function gcApplyFixes(text) {
  let fixed = text;
  const offsetMap = [];
  let totalOffset = 0;

  gcIssues.forEach(issue => {
    if (issue.replacement) {
      const before = fixed;
      fixed = fixed.substring(0, issue.start + totalOffset) + issue.replacement + fixed.substring(issue.end + totalOffset);
      totalOffset += issue.replacement.length - (issue.end - issue.start);
    }
  });

  return fixed;
}

function gcClear() {
  document.getElementById('gc-input').value = '';
  document.getElementById('gc-results-area').style.display = 'none';
  document.getElementById('gc-word-count').textContent = '0 words · 0 characters';
  gcIssues = [];
}

function gcFixAll() {
  if (gcFixedText) {
    document.getElementById('gc-input').value = gcFixedText;
    gcCheck();
  }
}

function gcCopyFixed() {
  if (gcFixedText) {
    navigator.clipboard.writeText(gcFixedText).then(() => {
      alert('Corrected text copied to clipboard!');
    });
  }
}

function gcFilter(type, btn) {
  const allBtns = document.querySelectorAll('.gc-filter-btn');
  allBtns.forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const items = document.querySelectorAll('.gc-issue-item');
  items.forEach(item => {
    if (type === 'all') {
      item.style.display = 'block';
    } else {
      item.style.display = item.dataset.filter === type ? 'block' : 'none';
    }
  });
}

// ============================================
// LANGUAGETOOL GRAMMAR CHECKER (studying.html)
// ============================================
var ltIssues = [];
var ltFixedText = '';
var LT_CHUNK_SIZE = 15000;
var LT_WARN_THRESHOLD = 15000;
var LT_API_URL = 'https://api.languagetool.org/v2/check';

function ltUpdateCounter() {
  var inputEl = document.getElementById('lt-input');
  if (!inputEl) return;
  var text = inputEl.value;
  var charCount = text.length;
  var wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;

  document.getElementById('lt-word-count').textContent = wordCount + ' words \u00b7 ' + charCount + ' characters';

  var fill = document.getElementById('lt-char-fill');
  var label = document.getElementById('lt-char-label');
  var warning = document.getElementById('lt-char-warning');
  var pct = Math.min(100, (charCount / 20000) * 100);
  fill.style.width = pct + '%';
  label.textContent = charCount.toLocaleString() + ' / 20,000 chars';

  if (charCount >= 20000) {
    fill.className = 'lt-char-fill lt-char-over';
    warning.style.display = 'block';
    warning.textContent = 'Text exceeds 20,000 characters and will be split into chunks for checking.';
  } else if (charCount >= LT_WARN_THRESHOLD) {
    fill.className = 'lt-char-fill lt-char-warn';
    warning.style.display = 'block';
    warning.textContent = 'Heads up: at 20,000 characters, text will automatically be split into multiple requests.';
  } else {
    fill.className = 'lt-char-fill';
    warning.style.display = 'none';
  }
}

function ltSplitIntoChunks(text, chunkSize) {
  if (text.length <= chunkSize) {
    return [{ text: text, offset: 0 }];
  }
  var chunks = [];
  var start = 0;
  while (start < text.length) {
    if (start + chunkSize >= text.length) {
      chunks.push({ text: text.slice(start), offset: start });
      break;
    }
    var slice = text.slice(start, start + chunkSize);
    // Find the last sentence boundary in the back half of the chunk
    var bestBreak = -1;
    var boundary = Math.floor(slice.length * 0.5);
    for (var i = slice.length - 2; i > boundary; i--) {
      var ch = slice[i];
      var next = slice[i + 1];
      if ((ch === '.' || ch === '!' || ch === '?') && (next === ' ' || next === '\n')) {
        bestBreak = i + 2;
        break;
      }
      if (ch === '\n' && next === '\n') {
        bestBreak = i + 2;
        break;
      }
    }
    var end = bestBreak > 0 ? start + bestBreak : start + chunkSize;
    chunks.push({ text: text.slice(start, end), offset: start });
    start = end;
  }
  return chunks;
}

function ltMapCategory(categoryId) {
  var spellingCats = ['TYPOS', 'MISSPELLING', 'TYPO'];
  var punctCats = ['PUNCTUATION', 'TYPOGRAPHY'];
  var styleCats = ['STYLE', 'REDUNDANCY', 'PLAIN_ENGLISH', 'CASING', 'COLLOCATIONS'];
  if (spellingCats.indexOf(categoryId) !== -1) return 'spelling';
  if (punctCats.indexOf(categoryId) !== -1) return 'punctuation';
  if (styleCats.indexOf(categoryId) !== -1) return 'style';
  return 'grammar';
}

function ltCheck() {
  var inputEl = document.getElementById('lt-input');
  if (!inputEl) return;
  var text = inputEl.value;

  var errEl = document.getElementById('lt-api-error');
  if (errEl) errEl.style.display = 'none';

  if (!text.trim()) {
    document.getElementById('lt-results-area').style.display = 'none';
    return;
  }

  var btn = document.querySelector('#panel-grammar .btn-primary');
  var origLabel = btn.textContent;
  btn.textContent = 'Checking\u2026';
  btn.disabled = true;

  ltIssues = [];
  ltFixedText = '';

  var chunks = ltSplitIntoChunks(text, LT_CHUNK_SIZE);

  var promises = chunks.map(function(chunk) {
    var params = new URLSearchParams();
    params.append('text', chunk.text);
    params.append('language', 'en-US');
    return fetch(LT_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    }).then(function(res) {
      if (!res.ok) throw new Error('API error ' + res.status);
      return res.json();
    }).then(function(data) {
      data.matches.forEach(function(match) {
        var type = ltMapCategory(match.rule.category.id);
        var replacement = match.replacements.length > 0 ? match.replacements[0].value : null;
        ltIssues.push({
          type: type,
          message: match.message,
          suggestion: replacement,
          context: match.context.text,
          contextOffset: match.context.offset,
          contextLength: match.context.length,
          start: chunk.offset + match.offset,
          end: chunk.offset + match.offset + match.length,
          replacement: replacement,
          ignored: false
        });
      });
    });
  });

  Promise.all(promises).then(function() {
    ltIssues.sort(function(a, b) { return a.start - b.start; });
    ltRenderResults(text);
    btn.textContent = origLabel;
    btn.disabled = false;
  }).catch(function(err) {
    btn.textContent = origLabel;
    btn.disabled = false;
    var errEl = document.getElementById('lt-api-error');
    if (errEl) {
      errEl.textContent = 'Grammar check failed: ' + err.message + '. Please try again.';
      errEl.style.display = 'block';
    }
  });
}

function ltRenderResults(text) {
  var resultsArea = document.getElementById('lt-results-area');
  resultsArea.style.display = 'block';

  var totalIssues = ltIssues.length;
  var score = Math.max(0, 100 - totalIssues * 3);

  document.getElementById('lt-score-number').textContent = Math.round(score);
  var circumference = 2 * Math.PI * 52;
  document.getElementById('lt-ring-fill').style.strokeDashoffset = circumference * (1 - score / 100);

  var label = 'Excellent';
  if (score < 50) label = 'Poor';
  else if (score < 75) label = 'Fair';
  else if (score < 90) label = 'Good';
  document.getElementById('lt-score-label').textContent = label;
  document.getElementById('lt-score-detail').textContent = totalIssues + ' issue' + (totalIssues !== 1 ? 's' : '') + ' found';

  var issueList = document.getElementById('lt-issue-list');
  issueList.innerHTML = '';

  if (totalIssues === 0) {
    document.getElementById('lt-no-issues').style.display = 'block';
    document.getElementById('lt-corrected-card').style.display = 'none';
  } else {
    document.getElementById('lt-no-issues').style.display = 'none';
    ltIssues.forEach(function(issue, i) {
      var div = document.createElement('div');
      div.className = 'gc-issue';
      div.setAttribute('data-type', issue.type);
      div.dataset.filter = issue.type;

      var ctxBefore = ltEscape(issue.context.slice(0, issue.contextOffset));
      var ctxBad = ltEscape(issue.context.slice(issue.contextOffset, issue.contextOffset + issue.contextLength));
      var ctxAfter = ltEscape(issue.context.slice(issue.contextOffset + issue.contextLength));
      var fixHtml = issue.suggestion ? ' &rarr; <span class="gc-highlight-good">' + ltEscape(issue.suggestion) + '</span>' : '';

      var actionsHtml = issue.replacement
        ? '<button class="gc-fix-btn" onclick="ltFixOne(' + i + ',this)">Apply Fix</button><button class="gc-ignore-btn" onclick="ltIgnoreOne(' + i + ',this)">Ignore</button>'
        : '<button class="gc-ignore-btn" onclick="ltIgnoreOne(' + i + ',this)">Ignore</button>';

      div.innerHTML =
        '<div class="gc-issue-header"><span class="gc-issue-badge">' + issue.type + '</span></div>' +
        '<div class="gc-issue-context">...<span class="gc-highlight-bad">' + ctxBad + '</span>' + ctxAfter + fixHtml + '...</div>' +
        '<div class="gc-issue-explain">' + ltEscape(issue.message) + '</div>' +
        '<div class="gc-issue-actions">' + actionsHtml + '</div>';

      issueList.appendChild(div);
    });
  }

  if (totalIssues > 0) {
    document.getElementById('lt-corrected-card').style.display = 'block';
    ltFixedText = ltApplyFixes(text);
    document.getElementById('lt-corrected-text').textContent = ltFixedText;
  }
}

function ltEscape(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function ltApplyFixes(text) {
  var fixed = text;
  var offset = 0;
  ltIssues.forEach(function(issue) {
    if (issue.replacement && !issue.ignored) {
      fixed = fixed.slice(0, issue.start + offset) + issue.replacement + fixed.slice(issue.end + offset);
      offset += issue.replacement.length - (issue.end - issue.start);
    }
  });
  return fixed;
}

function ltFixOne(index, btn) {
  var issue = ltIssues[index];
  if (!issue || issue.ignored || !issue.replacement) return;
  var inputEl = document.getElementById('lt-input');
  var text = inputEl.value;
  inputEl.value = text.slice(0, issue.start) + issue.replacement + text.slice(issue.end);
  ltUpdateCounter();
  var delta = issue.replacement.length - (issue.end - issue.start);
  issue.ignored = true;
  for (var i = index + 1; i < ltIssues.length; i++) {
    ltIssues[i].start += delta;
    ltIssues[i].end += delta;
  }
  var cards = document.querySelectorAll('#lt-issue-list .gc-issue');
  if (cards[index]) cards[index].classList.add('gc-issue-fixed');
  ltFixedText = ltApplyFixes(document.getElementById('lt-input').value);
  document.getElementById('lt-corrected-text').textContent = ltFixedText;
}

function ltIgnoreOne(index, btn) {
  ltIssues[index].ignored = true;
  var cards = document.querySelectorAll('#lt-issue-list .gc-issue');
  if (cards[index]) cards[index].classList.add('gc-issue-fixed');
}

function ltFixAll() {
  if (ltFixedText) {
    document.getElementById('lt-input').value = ltFixedText;
    ltUpdateCounter();
    ltCheck();
  }
}

function ltCopyFixed() {
  if (!ltFixedText) return;
  navigator.clipboard.writeText(ltFixedText).then(function() {
    ltShowToast('Corrected text copied!');
  });
}

function ltShowToast(msg) {
  var toast = document.getElementById('lt-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'lt-toast';
    toast.className = 'gc-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(function() { toast.classList.remove('show'); }, 2500);
}

function ltClear() {
  document.getElementById('lt-input').value = '';
  document.getElementById('lt-results-area').style.display = 'none';
  var errEl = document.getElementById('lt-api-error');
  if (errEl) errEl.style.display = 'none';
  ltUpdateCounter();
  ltIssues = [];
  ltFixedText = '';
}

function ltFilter(type, btn) {
  document.querySelectorAll('#lt-filter-group .gc-filter-btn').forEach(function(b) {
    b.classList.remove('active');
  });
  btn.classList.add('active');
  document.querySelectorAll('#lt-issue-list .gc-issue').forEach(function(item) {
    item.style.display = (type === 'all' || item.dataset.filter === type) ? 'block' : 'none';
  });
}

// ============================================
// GAME STUDY - "Quiz Blaster" arcade game
// ============================================
var gsQuestions = [];     // [{ question, options:[...], correct: index }]
var gsOrder = [];         // indexes into gsQuestions for current run
var gsPos = 0;            // position in gsOrder
var gsScore = 0;
var gsStreak = 0;
var gsLives = 3;
var gsMode = 'time';      // 'time' | 'lives' | 'sprint'
var gsQPerTimer = 10;     // seconds per question (for lives/sprint) or global time (time mode)
var gsGlobalTimer = null; // time mode interval
var gsQuestionTimer = null;
var gsTimeLeft = 0;
var gsCorrectCount = 0;
var gsWrongCount = 0;
var gsTotalAnswered = 0;
var gsLocked = false;     // lock input between questions
var gsActiveSource = 'quiz';

function gsInit() {
  gsPopulateQuizDropdown();
  gsRenderHighScore();
}

function gsPopulateQuizDropdown() {
  var sel = document.getElementById('gs-quiz-select');
  if (!sel) return;
  if (!qzQuizzes || qzQuizzes.length === 0) {
    sel.innerHTML = '<option value="">(no quizzes yet - create one first)</option>';
    return;
  }
  var html = '';
  qzQuizzes.forEach(function(q) {
    html += '<option value="' + q.id + '">' + escHtml(q.name) + ' (' + q.questions.length + ')</option>';
  });
  sel.innerHTML = html;
}

function gsSwitchTab(which, btn) {
  gsActiveSource = which;
  document.querySelectorAll('#panel-gamestudy .gs-tab-btn').forEach(function(b) { b.classList.remove('active'); });
  if (btn) btn.classList.add('active');
  document.querySelectorAll('#panel-gamestudy .gs-tab-panel').forEach(function(p) { p.classList.remove('active'); });
  var target = document.getElementById('gs-tab-' + which);
  if (target) target.classList.add('active');
}

function gsRenderHighScore() {
  var hs = parseInt(localStorage.getItem('mt_gs_highscore') || '0', 10);
  var el = document.getElementById('gs-hs-value');
  if (el) el.textContent = hs;
}

function gsParseTextLines(raw) {
  var out = [];
  raw.split(/\r?\n/).forEach(function(line) {
    line = line.trim();
    if (!line || line.charAt(0) === '#') return;
    var parts;
    if (line.indexOf('|') !== -1) parts = line.split('|');
    else parts = line.split(',');
    parts = parts.map(function(p) { return p.trim(); }).filter(function(p) { return p.length > 0; });
    if (parts.length < 3) return; // need question + correct + at least 1 wrong
    var question = parts[0];
    var correct = parts[1];
    var wrongs = parts.slice(2, 5);
    // Build options (up to 4). Correct goes in at random slot.
    var options = wrongs.slice();
    var correctIdx = Math.floor(Math.random() * (options.length + 1));
    options.splice(correctIdx, 0, correct);
    out.push({ question: question, options: options, correct: correctIdx });
  });
  return out;
}

function gsParseJson(raw) {
  var data;
  try { data = JSON.parse(raw); } catch(e) { return []; }
  if (!Array.isArray(data)) return [];
  var out = [];
  data.forEach(function(item) {
    if (!item || typeof item.question !== 'string') return;
    if (Array.isArray(item.options) && typeof item.correct === 'number') {
      if (item.options.length >= 2 && item.correct >= 0 && item.correct < item.options.length) {
        out.push({ question: item.question, options: item.options.slice(0, 4), correct: item.correct });
      }
    } else if (typeof item.correct === 'string' && Array.isArray(item.wrong)) {
      var options = item.wrong.slice(0, 3);
      var correctIdx = Math.floor(Math.random() * (options.length + 1));
      options.splice(correctIdx, 0, item.correct);
      out.push({ question: item.question, options: options, correct: correctIdx });
    }
  });
  return out;
}

function gsHandleFile(ev) {
  var file = ev.target.files[0];
  var statusEl = document.getElementById('gs-upload-status');
  if (!file) { if (statusEl) statusEl.textContent = ''; return; }
  var reader = new FileReader();
  reader.onload = function(e) {
    var content = e.target.result;
    var parsed = [];
    if (file.name.toLowerCase().endsWith('.json')) {
      parsed = gsParseJson(content);
    } else {
      parsed = gsParseTextLines(content);
    }
    if (parsed.length === 0) {
      statusEl.innerHTML = '<span style="color:var(--accent-red)">Could not parse any questions from this file. Check the format.</span>';
      gsQuestions = [];
    } else {
      statusEl.innerHTML = '<span style="color:var(--accent-green)">\u2713 Loaded ' + parsed.length + ' question' + (parsed.length !== 1 ? 's' : '') + ' from ' + escHtml(file.name) + '</span>';
      gsQuestions = parsed;
    }
  };
  reader.onerror = function() {
    if (statusEl) statusEl.innerHTML = '<span style="color:var(--accent-red)">Failed to read file.</span>';
  };
  reader.readAsText(file);
}

function gsLoadFromQuiz(quizId) {
  var quiz = qzQuizzes.find(function(q) { return q.id === quizId; });
  if (!quiz) return [];
  var out = [];
  quiz.questions.forEach(function(q) {
    if (!q.question || !q.question.trim()) return;
    var opts = q.options.slice();
    // For T/F ensure exactly two options
    out.push({ question: q.question, options: opts, correct: q.correct });
  });
  return out;
}

function gsGatherQuestions() {
  if (gsActiveSource === 'quiz') {
    var sel = document.getElementById('gs-quiz-select');
    if (!sel || !sel.value) return [];
    return gsLoadFromQuiz(sel.value);
  } else if (gsActiveSource === 'paste') {
    var raw = document.getElementById('gs-paste-input').value || '';
    return gsParseTextLines(raw);
  } else if (gsActiveSource === 'upload') {
    return gsQuestions.slice();
  }
  return [];
}

function gsStartGame() {
  var questions = gsGatherQuestions();
  if (!questions || questions.length === 0) {
    alert('Add some questions first! Pick a saved quiz, paste lines in the format shown, or upload a file.');
    return;
  }

  gsQuestions = questions;
  gsOrder = [];
  for (var i = 0; i < gsQuestions.length; i++) gsOrder.push(i);
  // Shuffle order
  for (var i = gsOrder.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = gsOrder[i]; gsOrder[i] = gsOrder[j]; gsOrder[j] = tmp;
  }

  gsPos = 0;
  gsScore = 0;
  gsStreak = 0;
  gsCorrectCount = 0;
  gsWrongCount = 0;
  gsTotalAnswered = 0;
  gsLives = 3;
  gsLocked = false;

  gsMode = document.getElementById('gs-mode').value;
  gsQPerTimer = parseInt(document.getElementById('gs-difficulty').value, 10) || 10;

  document.getElementById('gs-setup-view').style.display = 'none';
  document.getElementById('gs-over-view').style.display = 'none';
  document.getElementById('gs-play-view').style.display = 'block';

  // Configure HUD labels
  var centerLabel = document.getElementById('gs-center-label');
  if (gsMode === 'time') {
    centerLabel.textContent = 'Time';
    gsTimeLeft = 60;
    document.getElementById('gs-center-value').textContent = gsTimeLeft;
    gsClearGlobalTimer();
    gsGlobalTimer = setInterval(function() {
      gsTimeLeft--;
      document.getElementById('gs-center-value').textContent = gsTimeLeft;
      if (gsTimeLeft <= 0) gsEndGame('Time\'s Up!');
    }, 1000);
  } else if (gsMode === 'lives') {
    centerLabel.textContent = 'Q-Time';
    document.getElementById('gs-center-value').textContent = gsQPerTimer;
  } else {
    centerLabel.textContent = 'Remaining';
    document.getElementById('gs-center-value').textContent = gsOrder.length;
  }

  gsUpdateHUD();
  gsShowQuestion();
}

function gsUpdateHUD() {
  document.getElementById('gs-score').textContent = gsScore;
  document.getElementById('gs-streak').textContent = '×' + Math.max(1, gsStreak + 1);
  var hearts = '';
  for (var i = 0; i < gsLives; i++) hearts += '♥';
  for (var i = gsLives; i < 3; i++) hearts += '<span style="opacity:0.25">♥</span>';
  document.getElementById('gs-lives').innerHTML = hearts;
  document.getElementById('gs-qcount').textContent = gsTotalAnswered;
}

function gsShowQuestion() {
  if (gsMode !== 'time' && gsPos >= gsOrder.length) {
    // Ran out of questions in sprint/lives mode
    gsEndGame(gsMode === 'sprint' ? 'Sprint Complete!' : 'Out of Questions');
    return;
  }
  // In time mode loop over questions indefinitely
  var idx = gsOrder[gsPos % gsOrder.length];
  var q = gsQuestions[idx];
  if (!q) { gsEndGame('No more questions'); return; }

  gsLocked = false;
  document.getElementById('gs-feedback').innerHTML = '';
  document.getElementById('gs-question-text').textContent = q.question;

  var grid = document.getElementById('gs-options-grid');
  var letters = ['A', 'B', 'C', 'D'];
  var html = '';
  q.options.forEach(function(opt, oi) {
    html += '<button class="gs-option-btn" data-oi="' + oi + '" onclick="gsAnswer(' + oi + ')">' +
      '<span class="gs-option-letter">' + letters[oi] + '</span>' +
      '<span class="gs-option-text">' + escHtml(opt) + '</span>' +
      '</button>';
  });
  grid.innerHTML = html;

  // Per-question timer (not used in time mode which uses global timer)
  gsClearQuestionTimer();
  if (gsMode !== 'time') {
    gsTimeLeft = gsQPerTimer;
    document.getElementById('gs-center-value').textContent = gsTimeLeft;
    gsSetTimerBar(100);
    var startTs = Date.now();
    var durationMs = gsQPerTimer * 1000;
    gsQuestionTimer = setInterval(function() {
      var remaining = Math.max(0, durationMs - (Date.now() - startTs));
      var secs = Math.ceil(remaining / 1000);
      if (secs !== gsTimeLeft) {
        gsTimeLeft = secs;
        document.getElementById('gs-center-value').textContent = gsTimeLeft;
      }
      gsSetTimerBar((remaining / durationMs) * 100);
      if (remaining <= 0) {
        gsClearQuestionTimer();
        gsTimeOut();
      }
    }, 50);
  } else {
    // In time mode use global timer as timer bar reference
    gsSetTimerBar((gsTimeLeft / 60) * 100);
  }
}

function gsSetTimerBar(pct) {
  var bar = document.getElementById('gs-timer-bar');
  if (!bar) return;
  bar.style.width = Math.max(0, Math.min(100, pct)) + '%';
  if (pct < 25) bar.style.background = 'var(--accent-red)';
  else if (pct < 50) bar.style.background = 'var(--accent-orange)';
  else bar.style.background = 'linear-gradient(90deg, var(--accent-cyan), var(--accent-green))';
}

function gsAnswer(oi) {
  if (gsLocked) return;
  gsLocked = true;
  gsClearQuestionTimer();

  var idx = gsOrder[gsPos % gsOrder.length];
  var q = gsQuestions[idx];
  var isCorrect = (oi === q.correct);
  gsTotalAnswered++;

  // Highlight buttons
  var btns = document.querySelectorAll('#gs-options-grid .gs-option-btn');
  btns.forEach(function(b) {
    var bi = parseInt(b.getAttribute('data-oi'), 10);
    if (bi === q.correct) b.classList.add('gs-correct');
    else if (bi === oi) b.classList.add('gs-wrong');
    b.disabled = true;
  });

  var feedback = document.getElementById('gs-feedback');
  if (isCorrect) {
    gsCorrectCount++;
    gsStreak++;
    var streakMult = Math.min(5, 1 + Math.floor(gsStreak / 3));
    var timeBonus = gsMode !== 'time' ? Math.max(0, gsTimeLeft) : 0;
    var gained = 10 * streakMult + timeBonus;
    gsScore += gained;
    feedback.innerHTML = '<span class="gs-fb-correct">\u2713 Correct! +' + gained +
      (streakMult > 1 ? ' (×' + streakMult + ' streak)' : '') +
      (timeBonus ? ' +' + timeBonus + ' time bonus' : '') + '</span>';
    var card = document.getElementById('gs-question-card');
    card.classList.remove('gs-shake');
    card.classList.add('gs-pulse');
    setTimeout(function() { card.classList.remove('gs-pulse'); }, 400);
  } else {
    gsWrongCount++;
    gsStreak = 0;
    gsScore = Math.max(0, gsScore - 3);
    feedback.innerHTML = '<span class="gs-fb-wrong">\u2717 Wrong! -3</span>';
    var card = document.getElementById('gs-question-card');
    card.classList.remove('gs-pulse');
    card.classList.add('gs-shake');
    setTimeout(function() { card.classList.remove('gs-shake'); }, 400);
    if (gsMode === 'lives') {
      gsLives--;
      if (gsLives <= 0) {
        gsUpdateHUD();
        setTimeout(function() { gsEndGame('No Lives Left'); }, 900);
        return;
      }
    }
  }

  gsUpdateHUD();

  setTimeout(function() {
    gsPos++;
    gsShowQuestion();
  }, 900);
}

function gsTimeOut() {
  if (gsLocked) return;
  gsLocked = true;
  gsStreak = 0;
  gsTotalAnswered++;
  gsWrongCount++;
  var idx = gsOrder[gsPos % gsOrder.length];
  var q = gsQuestions[idx];
  var btns = document.querySelectorAll('#gs-options-grid .gs-option-btn');
  btns.forEach(function(b) {
    var bi = parseInt(b.getAttribute('data-oi'), 10);
    if (bi === q.correct) b.classList.add('gs-correct');
    b.disabled = true;
  });
  document.getElementById('gs-feedback').innerHTML = '<span class="gs-fb-wrong">\u23F1 Time\u2019s up!</span>';
  if (gsMode === 'lives') {
    gsLives--;
    gsUpdateHUD();
    if (gsLives <= 0) {
      setTimeout(function() { gsEndGame('No Lives Left'); }, 900);
      return;
    }
  }
  setTimeout(function() {
    gsPos++;
    gsShowQuestion();
  }, 1100);
}

function gsClearGlobalTimer() {
  if (gsGlobalTimer) { clearInterval(gsGlobalTimer); gsGlobalTimer = null; }
}
function gsClearQuestionTimer() {
  if (gsQuestionTimer) { clearInterval(gsQuestionTimer); gsQuestionTimer = null; }
}

function gsEndGame(title) {
  gsClearGlobalTimer();
  gsClearQuestionTimer();

  var hs = parseInt(localStorage.getItem('mt_gs_highscore') || '0', 10);
  var newHighScore = false;
  if (gsScore > hs) {
    hs = gsScore;
    localStorage.setItem('mt_gs_highscore', String(hs));
    newHighScore = true;
  }

  document.getElementById('gs-play-view').style.display = 'none';
  document.getElementById('gs-over-view').style.display = 'block';

  document.getElementById('gs-over-title').textContent = title || 'Game Over';
  document.getElementById('gs-over-score').textContent = gsScore;

  var msg = '';
  if (newHighScore) msg = '\u2B50 New High Score! Absolutely elite performance.';
  else if (gsScore === 0) msg = 'Everyone starts somewhere \u2014 review the material and try again!';
  else if (gsScore < 50) msg = 'Solid warm-up. Keep grinding those reps.';
  else if (gsScore < 150) msg = 'Nice work! You\'re locked in.';
  else msg = 'George Kittle TD celebration \u2014 you\'re cooking!';
  document.getElementById('gs-over-msg').textContent = msg;

  var acc = gsTotalAnswered ? Math.round((gsCorrectCount / gsTotalAnswered) * 100) : 0;
  document.getElementById('gs-over-stats').innerHTML =
    '<div class="gs-stat"><span>Correct</span><b>' + gsCorrectCount + '</b></div>' +
    '<div class="gs-stat"><span>Wrong</span><b>' + gsWrongCount + '</b></div>' +
    '<div class="gs-stat"><span>Accuracy</span><b>' + acc + '%</b></div>' +
    '<div class="gs-stat"><span>High Score</span><b>' + hs + '</b></div>';
}

function gsQuit() {
  if (!confirm('End the current game?')) return;
  gsEndGame('Game Ended');
}

function gsBackToSetup() {
  document.getElementById('gs-over-view').style.display = 'none';
  document.getElementById('gs-play-view').style.display = 'none';
  document.getElementById('gs-setup-view').style.display = 'block';
  gsPopulateQuizDropdown();
  gsRenderHighScore();
}

// ============================================
// INIT - Render study tools on page load
// ============================================
window.addEventListener('DOMContentLoaded', function() {
initTheme();
fcRenderDecks();
qzRenderList();
gsInit();
stRenderSessionList();
});
