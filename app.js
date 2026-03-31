/* ============================================
MATH TOOLS — Core Application Logic
============================================ */

// –– NAVIGATION ––
function showPanel(id) {
document.querySelectorAll(’.tool-panel’).forEach(p => p.classList.remove(‘active’));
document.querySelectorAll(’.nav-item’).forEach(n => n.classList.remove(‘active’));
const panel = document.getElementById(‘panel-’ + id);
if (panel) panel.classList.add(‘active’);
const nav = document.querySelector(`.nav-item[data-panel="${id}"]`);
if (nav) nav.classList.add(‘active’);
// Close mobile sidebar
document.getElementById(‘sidebar’).classList.remove(‘open’);
document.getElementById(‘mobileOverlay’).classList.remove(‘open’);
window.scrollTo(0, 0);
}

function toggleSidebar() {
document.getElementById(‘sidebar’).classList.toggle(‘open’);
document.getElementById(‘mobileOverlay’).classList.toggle(‘open’);
}

// –– UTILITY ––
function clearInputs(...ids) {
ids.forEach(id => {
const el = document.getElementById(id);
if (el) {
if (el.tagName === ‘DIV’) el.innerHTML = ‘’;
else el.value = ‘’;
}
});
}

function fmt(n, decimals = 6) {
if (typeof n !== ‘number’ || isNaN(n)) return ‘undefined’;
if (!isFinite(n)) return n > 0 ? ‘∞’ : ‘-∞’;
const rounded = parseFloat(n.toFixed(decimals));
return rounded.toString();
}

function parseExpr(expr) {
// Allow more natural notation
return expr.replace(/(\d)([a-zA-Z])/g, ‘$1*$2’);
}

// –– COOKIE BANNER ––
function acceptCookies() {
document.getElementById(‘cookieBanner’).classList.remove(‘show’);
localStorage.setItem(‘cookies_accepted’, ‘true’);
}

window.addEventListener(‘DOMContentLoaded’, () => {
if (!localStorage.getItem(‘cookies_accepted’)) {
setTimeout(() => {
document.getElementById(‘cookieBanner’).classList.add(‘show’);
}, 1500);
}
drawUnitCircle();
});

// ============================================
// LINEAR EQUATION SOLVER
// ============================================
function solveLinear() {
const a = parseFloat(document.getElementById(‘lin-a’).value);
const b = parseFloat(document.getElementById(‘lin-b’).value);
const c = parseFloat(document.getElementById(‘lin-c’).value);
const box = document.getElementById(‘linear-result’);

if (isNaN(a) || isNaN(b) || isNaN(c)) {
box.innerHTML = ‘<span class="result-error">Please enter all coefficients.</span>’;
return;
}

let html = ‘<div class="result-label">Solution Steps</div>’;
html += `<div class="result-step">Given: ${a}x + ${b} = ${c}</div>`;

if (a === 0) {
if (b === c) {
html += ‘<div class="result-step result-success">Infinite solutions — the equation is always true.</div>’;
} else {
html += ‘<div class="result-step result-error">No solution — the equation is contradictory.</div>’;
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
const a = parseFloat(document.getElementById(‘quad-a’).value);
const b = parseFloat(document.getElementById(‘quad-b’).value);
const c = parseFloat(document.getElementById(‘quad-c’).value);
const box = document.getElementById(‘quadratic-result’);

if (isNaN(a) || isNaN(b) || isNaN(c)) {
box.innerHTML = ‘<span class="result-error">Please enter all coefficients.</span>’;
return;
}
if (a === 0) {
box.innerHTML = ‘<span class="result-error">Coefficient “a” cannot be 0 for a quadratic.</span>’;
return;
}

const disc = b * b - 4 * a * c;
const vertex_x = -b / (2 * a);
const vertex_y = a * vertex_x * vertex_x + b * vertex_x + c;

let html = ‘<div class="result-label">Analysis</div>’;
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
const a1 = parseFloat(document.getElementById(‘sys-a1’).value);
const b1 = parseFloat(document.getElementById(‘sys-b1’).value);
const c1 = parseFloat(document.getElementById(‘sys-c1’).value);
const a2 = parseFloat(document.getElementById(‘sys-a2’).value);
const b2 = parseFloat(document.getElementById(‘sys-b2’).value);
const c2 = parseFloat(document.getElementById(‘sys-c2’).value);
const box = document.getElementById(‘system-result’);

if ([a1,b1,c1,a2,b2,c2].some(isNaN)) {
box.innerHTML = ‘<span class="result-error">Please enter all six values.</span>’;
return;
}

const det = a1 * b2 - a2 * b1;
let html = ‘<div class="result-label">Cramer's Rule</div>’;
html += `<div class="result-step">Eq1: ${a1}x + ${b1}y = ${c1}</div>`;
html += `<div class="result-step">Eq2: ${a2}x + ${b2}y = ${c2}</div>`;
html += `<div class="result-step">Determinant D = (${a1})(${b2}) - (${a2})(${b1}) = ${fmt(det)}</div>`;

if (det === 0) {
html += ‘<div class="result-step result-error">System has no unique solution (D = 0). Lines are parallel or identical.</div>’;
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
const expr = document.getElementById(‘poly-expr’).value.trim();
const xVal = parseFloat(document.getElementById(‘poly-x’).value);
const box = document.getElementById(‘poly-result’);

if (!expr) { box.innerHTML = ‘<span class="result-error">Enter an expression.</span>’; return; }
if (isNaN(xVal)) { box.innerHTML = ‘<span class="result-error">Enter a value for x.</span>’; return; }

try {
const parsed = parseExpr(expr);
const result = math.evaluate(parsed, { x: xVal });
box.innerHTML = `<div class="result-label">Evaluation</div> <div class="result-step">f(x) = ${expr}</div> <div class="result-step">f(${xVal}) = <span class="result-highlight" style="font-size:20px">${fmt(result)}</span></div>`;
} catch(e) {
box.innerHTML = `<span class="result-error">Error: ${e.message}. Use * for multiplication, e.g. 2*x^3</span>`;
}
}

function factorQuadratic() {
const a = parseFloat(document.getElementById(‘fac-a’).value);
const b = parseFloat(document.getElementById(‘fac-b’).value);
const c = parseFloat(document.getElementById(‘fac-c’).value);
const box = document.getElementById(‘factor-result’);

if (isNaN(a) || isNaN(b) || isNaN(c) || a === 0) {
box.innerHTML = ‘<span class="result-error">Enter valid a, b, c (a ≠ 0).</span>’;
return;
}

const disc = b * b - 4 * a * c;
let html = ‘<div class="result-label">Factoring</div>’;
html += `<div class="result-step">${a}x² + ${b}x + ${c}</div>`;

if (disc < 0) {
html += ‘<div class="result-step result-error">Cannot factor over the reals (discriminant < 0).</div>’;
} else {
const r1 = (-b + Math.sqrt(disc)) / (2 * a);
const r2 = (-b - Math.sqrt(disc)) / (2 * a);

```
if (a === 1) {
  html += `<div class="result-step"><span class="result-highlight" style="font-size:18px">(x - ${fmt(r1)})(x - ${fmt(r2)})</span></div>`;
} else {
  html += `<div class="result-step"><span class="result-highlight" style="font-size:18px">${a}(x - ${fmt(r1)})(x - ${fmt(r2)})</span></div>`;
}
html += `<div class="result-step">Roots: x = ${fmt(r1)}, x = ${fmt(r2)}</div>`;
```

}
box.innerHTML = html;
}

// ============================================
// GRAPHING CALCULATOR
// ============================================
function plotGraph() {
const canvas = document.getElementById(‘graphCanvas’);
const ctx = canvas.getContext(‘2d’);
const dpr = window.devicePixelRatio || 1;

canvas.width = canvas.clientWidth * dpr;
canvas.height = canvas.clientHeight * dpr;
ctx.scale(dpr, dpr);

const W = canvas.clientWidth;
const H = canvas.clientHeight;

const xmin = parseFloat(document.getElementById(‘graph-xmin’).value) || -10;
const xmax = parseFloat(document.getElementById(‘graph-xmax’).value) || 10;
const ymin = parseFloat(document.getElementById(‘graph-ymin’).value) || -10;
const ymax = parseFloat(document.getElementById(‘graph-ymax’).value) || 10;

ctx.fillStyle = ‘#0c0c16’;
ctx.fillRect(0, 0, W, H);

// Grid
function toScreen(x, y) {
return [(x - xmin) / (xmax - xmin) * W, H - (y - ymin) / (ymax - ymin) * H];
}

// Grid lines
ctx.strokeStyle = ‘rgba(255,255,255,0.05)’;
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
ctx.strokeStyle = ‘rgba(255,255,255,0.25)’;
ctx.lineWidth = 1.5;
const [ox, oy] = toScreen(0, 0);
ctx.beginPath(); ctx.moveTo(0, oy); ctx.lineTo(W, oy); ctx.stroke();
ctx.beginPath(); ctx.moveTo(ox, 0); ctx.lineTo(ox, H); ctx.stroke();

// Axis labels
ctx.fillStyle = ‘rgba(255,255,255,0.35)’;
ctx.font = ‘11px JetBrains Mono, monospace’;
ctx.textAlign = ‘center’;
for (let x = Math.ceil(xmin); x <= xmax; x++) {
if (x === 0) continue;
const [sx] = toScreen(x, 0);
ctx.fillText(x, sx, oy + 14);
}
ctx.textAlign = ‘right’;
for (let y = Math.ceil(ymin); y <= ymax; y++) {
if (y === 0) continue;
const [, sy] = toScreen(0, y);
ctx.fillText(y, ox - 6, sy + 4);
}

// Plot functions
const colors = [’#00d4ff’, ‘#ff4466’, ‘#00e68a’];
const fInputs = [‘graph-f1’, ‘graph-f2’, ‘graph-f3’];

fInputs.forEach((inputId, idx) => {
const expr = document.getElementById(inputId).value.trim();
if (!expr) return;

```
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
```

});
}

function clearGraph() {
const canvas = document.getElementById(‘graphCanvas’);
const ctx = canvas.getContext(‘2d’);
ctx.clearRect(0, 0, canvas.width, canvas.height);
document.getElementById(‘graph-f1’).value = ‘’;
document.getElementById(‘graph-f2’).value = ‘’;
document.getElementById(‘graph-f3’).value = ‘’;
}

// ============================================
// LOGARITHM CALCULATOR
// ============================================
function calcLog() {
const base = parseFloat(document.getElementById(‘log-base’).value);
const val = parseFloat(document.getElementById(‘log-value’).value);
const box = document.getElementById(‘log-result’);

if (isNaN(base) || isNaN(val) || base <= 0 || base === 1 || val <= 0) {
box.innerHTML = ‘<span class="result-error">Base must be > 0 and ≠ 1. Value must be > 0.</span>’;
return;
}

const result = Math.log(val) / Math.log(base);
let html = ‘<div class="result-label">Result</div>’;
html += `<div class="result-step">log<sub>${base}</sub>(${val}) = <span class="result-highlight" style="font-size:20px">${fmt(result)}</span></div>`;
html += `<div class="result-step">ln(${val}) = ${fmt(Math.log(val))}</div>`;
html += `<div class="result-step">log₁₀(${val}) = ${fmt(Math.log10(val))}</div>`;
html += `<div class="result-step" style="color:var(--text-muted);font-size:12px">Change of base formula: log_b(x) = ln(x) / ln(b)</div>`;
box.innerHTML = html;
}

function convertExpLog() {
const b = parseFloat(document.getElementById(‘conv-b’).value);
const y = parseFloat(document.getElementById(‘conv-y’).value);
const box = document.getElementById(‘conv-result’);

if (isNaN(b) || isNaN(y) || b <= 0) {
box.innerHTML = ‘<span class="result-error">Enter valid base and exponent.</span>’;
return;
}

const x = Math.pow(b, y);
let html = ‘<div class="result-label">Conversion</div>’;
html += `<div class="result-step">Exponential form: <span class="result-highlight">${b}<sup>${y}</sup> = ${fmt(x)}</span></div>`;
html += `<div class="result-step">Logarithmic form: <span class="result-highlight">log<sub>${b}</sub>(${fmt(x)}) = ${y}</span></div>`;
box.innerHTML = html;
}

// ============================================
// TRIG CALCULATOR
// ============================================
let trigMode = ‘deg’;

function setTrigMode(mode, btn) {
trigMode = mode;
btn.parentElement.querySelectorAll(’.toggle-btn’).forEach(b => b.classList.remove(‘active’));
btn.classList.add(‘active’);
}

function calcTrig() {
const angle = parseFloat(document.getElementById(‘trig-angle’).value);
const box = document.getElementById(‘trig-result’);

if (isNaN(angle)) { box.innerHTML = ‘<span class="result-error">Enter an angle.</span>’; return; }

const rad = trigMode === ‘deg’ ? angle * Math.PI / 180 : angle;
const deg = trigMode === ‘deg’ ? angle : angle * 180 / Math.PI;

const sin = Math.sin(rad);
const cos = Math.cos(rad);
const tan = Math.abs(cos) < 1e-12 ? undefined : sin / cos;
const csc = Math.abs(sin) < 1e-12 ? undefined : 1 / sin;
const sec = Math.abs(cos) < 1e-12 ? undefined : 1 / cos;
const cot = tan === undefined ? (Math.abs(sin) < 1e-12 ? undefined : 0) : 1 / tan;

const items = [
{ label: ‘sin θ’, value: fmt(sin) },
{ label: ‘cos θ’, value: fmt(cos) },
{ label: ‘tan θ’, value: tan === undefined ? ‘undefined’ : fmt(tan) },
{ label: ‘csc θ’, value: csc === undefined ? ‘undefined’ : fmt(csc) },
{ label: ‘sec θ’, value: sec === undefined ? ‘undefined’ : fmt(sec) },
{ label: ‘cot θ’, value: cot === undefined ? ‘undefined’ : fmt(cot) },
{ label: ‘Degrees’, value: fmt(deg, 4) + ‘°’ },
{ label: ‘Radians’, value: fmt(rad, 6) },
];

box.innerHTML = items.map(i =>
`<div class="stat-card"><div class="stat-label">${i.label}</div><div class="stat-value">${i.value}</div></div>`
).join(’’);
}

function degToRad() {
const d = parseFloat(document.getElementById(‘deg-input’).value);
if (!isNaN(d)) document.getElementById(‘rad-input’).value = (d * Math.PI / 180).toFixed(6);
}

function radToDeg() {
const r = parseFloat(document.getElementById(‘rad-input’).value);
if (!isNaN(r)) document.getElementById(‘deg-input’).value = (r * 180 / Math.PI).toFixed(4);
}

// ============================================
// UNIT CIRCLE
// ============================================
function drawUnitCircle() {
const canvas = document.getElementById(‘unitCircleCanvas’);
if (!canvas) return;
const ctx = canvas.getContext(‘2d’);
const W = 420, H = 420;
const cx = W / 2, cy = H / 2, R = 160;

ctx.fillStyle = ‘#0c0c16’;
ctx.fillRect(0, 0, W, H);

// Axes
ctx.strokeStyle = ‘rgba(255,255,255,0.15)’;
ctx.lineWidth = 1;
ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.stroke();
ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, H); ctx.stroke();

// Circle
ctx.strokeStyle = ‘rgba(0,212,255,0.4)’;
ctx.lineWidth = 2;
ctx.beginPath(); ctx.arc(cx, cy, R, 0, 2 * Math.PI); ctx.stroke();

// Key angles
const angles = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330];

angles.forEach(deg => {
const rad = deg * Math.PI / 180;
const px = cx + R * Math.cos(rad);
const py = cy - R * Math.sin(rad);

```
ctx.fillStyle = '#00d4ff';
ctx.beginPath(); ctx.arc(px, py, 5, 0, 2 * Math.PI); ctx.fill();

ctx.fillStyle = 'rgba(255,255,255,0.6)';
ctx.font = '10px JetBrains Mono, monospace';
ctx.textAlign = px > cx + 5 ? 'left' : px < cx - 5 ? 'right' : 'center';
ctx.textBaseline = py > cy + 5 ? 'top' : py < cy - 5 ? 'bottom' : 'middle';
const dx = (px > cx ? 10 : px < cx ? -10 : 0);
const dy = (py > cy ? 10 : py < cy ? -10 : 0);
ctx.fillText(deg + '°', px + dx, py + dy);
```

});

// Axis labels
ctx.fillStyle = ‘rgba(255,255,255,0.3)’;
ctx.font = ‘12px DM Sans, sans-serif’;
ctx.textAlign = ‘center’;
ctx.fillText(‘0, 2π’, cx + R + 25, cy + 4);
ctx.fillText(‘π’, cx - R - 20, cy + 4);
ctx.fillText(‘π/2’, cx, cy - R - 10);
ctx.fillText(‘3π/2’, cx, cy + R + 16);

// Click handler
canvas.onclick = (e) => {
const rect = canvas.getBoundingClientRect();
const mx = e.clientX - rect.left;
const my = e.clientY - rect.top;
let angle = Math.atan2(-(my - cy), mx - cx);
if (angle < 0) angle += 2 * Math.PI;
const deg = angle * 180 / Math.PI;

```
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
```

};
}

// ============================================
// LIMITS CALCULATOR (numerical)
// ============================================
function calcLimit() {
const expr = document.getElementById(‘lim-expr’).value.trim();
const a = parseFloat(document.getElementById(‘lim-val’).value);
const box = document.getElementById(‘limit-result’);

if (!expr || isNaN(a)) { box.innerHTML = ‘<span class="result-error">Enter f(x) and the approach value.</span>’; return; }

try {
const parsed = parseExpr(expr);
const compiled = math.compile(parsed);

```
const offsets = [0.1, 0.01, 0.001, 0.0001, 0.00001];
let leftVals = [], rightVals = [];

offsets.forEach(h => {
  try { leftVals.push({ h: -h, val: compiled.evaluate({ x: a - h }) }); } catch {}
  try { rightVals.push({ h: h, val: compiled.evaluate({ x: a + h }) }); } catch {}
});

let html = '<div class="result-label">Numerical Approach</div>';
html += `<div class="result-step" style="font-weight:600">lim x→${a} [${expr}]</div>`;

html += '<div class="result-step" style="margin-top:8px"><strong>From the left (x → ${a}⁻):</strong></div>';
leftVals.forEach(v => {
  html += `<div class="result-step">  x = ${(a + v.h).toFixed(6)} → f(x) = ${fmt(v.val)}</div>`;
});

html += '<div class="result-step" style="margin-top:8px"><strong>From the right (x → ${a}⁺):</strong></div>';
rightVals.forEach(v => {
  html += `<div class="result-step">  x = ${(a + v.h).toFixed(6)} → f(x) = ${fmt(v.val)}</div>`;
});

const leftLimit = leftVals.length ? leftVals[leftVals.length - 1].val : NaN;
const rightLimit = rightVals.length ? rightVals[rightVals.length - 1].val : NaN;

if (isFinite(leftLimit) && isFinite(rightLimit) && Math.abs(leftLimit - rightLimit) < 0.001) {
  const avg = (leftLimit + rightLimit) / 2;
  html += `<div class="result-step" style="margin-top:12px"><span class="result-highlight" style="font-size:20px">Limit ≈ ${fmt(avg)}</span></div>`;
} else if (isFinite(leftLimit) || isFinite(rightLimit)) {
  html += `<div class="result-step result-error" style="margin-top:12px">Left and right limits differ — limit may not exist.</div>`;
  html += `<div class="result-step">Left limit ≈ ${fmt(leftLimit)}, Right limit ≈ ${fmt(rightLimit)}</div>`;
} else {
  html += `<div class="result-step result-error" style="margin-top:12px">Could not determine limit numerically.</div>`;
}

box.innerHTML = html;
```

} catch(e) {
box.innerHTML = `<span class="result-error">Error: ${e.message}</span>`;
}
}

// ============================================
// DERIVATIVE CALCULATOR
// ============================================
function calcDerivative() {
const expr = document.getElementById(‘deriv-expr’).value.trim();
const atX = document.getElementById(‘deriv-at’).value.trim();
const box = document.getElementById(‘deriv-result’);

if (!expr) { box.innerHTML = ‘<span class="result-error">Enter f(x).</span>’; return; }

try {
const parsed = parseExpr(expr);
const derivative = math.derivative(parsed, ‘x’);

```
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
```

} catch(e) {
box.innerHTML = `<span class="result-error">Error: ${e.message}. Use * for multiplication.</span>`;
}
}

// ============================================
// INTEGRAL CALCULATOR (Simpson’s Rule)
// ============================================
function calcIntegral() {
const expr = document.getElementById(‘int-expr’).value.trim();
const a = parseFloat(document.getElementById(‘int-a’).value);
const b = parseFloat(document.getElementById(‘int-b’).value);
const box = document.getElementById(‘integral-result’);

if (!expr || isNaN(a) || isNaN(b)) {
box.innerHTML = ‘<span class="result-error">Enter f(x) and bounds.</span>’;
return;
}

try {
const parsed = parseExpr(expr);
const compiled = math.compile(parsed);

```
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
```

} catch(e) {
box.innerHTML = `<span class="result-error">Error: ${e.message}</span>`;
}
}

// ============================================
// SEQUENCES & SERIES
// ============================================
function calcArithmetic() {
const a1 = parseFloat(document.getElementById(‘arith-a1’).value);
const d = parseFloat(document.getElementById(‘arith-d’).value);
const n = parseInt(document.getElementById(‘arith-n’).value);
const box = document.getElementById(‘arith-result’);

if (isNaN(a1) || isNaN(d) || isNaN(n) || n < 1) {
box.innerHTML = ‘<span class="result-error">Enter valid a₁, d, and n.</span>’;
return;
}

const an = a1 + (n - 1) * d;
const sum = (n / 2) * (a1 + an);
const terms = [];
for (let i = 0; i < Math.min(n, 10); i++) terms.push(fmt(a1 + i * d, 4));

let html = ‘<div class="result-label">Arithmetic Sequence</div>’;
html += `<div class="result-step">a₁ = ${a1}, d = ${d}, n = ${n}</div>`;
html += `<div class="result-step">a_n = a₁ + (n-1)d = <span class="result-highlight" style="font-size:18px">${fmt(an)}</span></div>`;
html += `<div class="result-step">S_n = n/2 (a₁ + a_n) = <span class="result-highlight" style="font-size:18px">${fmt(sum)}</span></div>`;
html += `<div class="result-step" style="color:var(--text-muted)">First terms: ${terms.join(', ')}${n > 10 ? ', ...' : ''}</div>`;
box.innerHTML = html;
}

function calcGeometric() {
const a1 = parseFloat(document.getElementById(‘geo-a1’).value);
const r = parseFloat(document.getElementById(‘geo-r’).value);
const n = parseInt(document.getElementById(‘geo-n’).value);
const box = document.getElementById(‘geo-result’);

if (isNaN(a1) || isNaN(r) || isNaN(n) || n < 1) {
box.innerHTML = ‘<span class="result-error">Enter valid a₁, r, and n.</span>’;
return;
}

const an = a1 * Math.pow(r, n - 1);
const sum = r === 1 ? a1 * n : a1 * (1 - Math.pow(r, n)) / (1 - r);
const terms = [];
for (let i = 0; i < Math.min(n, 10); i++) terms.push(fmt(a1 * Math.pow(r, i), 4));

let html = ‘<div class="result-label">Geometric Sequence</div>’;
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
const raw = document.getElementById(‘stats-data’).value.trim();
const grid = document.getElementById(‘stats-result-grid’);
const extra = document.getElementById(‘stats-extra’);

if (!raw) { grid.innerHTML = ‘<span class="result-error">Enter data.</span>’; return; }

const data = raw.split(/[\s,]+/).map(Number).filter(n => !isNaN(n));
if (data.length === 0) { grid.innerHTML = ‘<span class="result-error">No valid numbers found.</span>’; return; }

data.sort((a, b) => a - b);
const n = data.length;
const sum = data.reduce((a, b) => a + b, 0);
const mean = sum / n;
const median = n % 2 === 1 ? data[Math.floor(n/2)] : (data[n/2 - 1] + data[n/2]) / 2;

// Mode
const freq = {};
data.forEach(v => freq[v] = (freq[v] || 0) + 1);
const maxFreq = Math.max(…Object.values(freq));
const modes = Object.keys(freq).filter(k => freq[k] === maxFreq);
const modeStr = maxFreq === 1 ? ‘None’ : modes.join(’, ’);

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
{ label: ‘Count’, value: n },
{ label: ‘Mean’, value: fmt(mean, 4) },
{ label: ‘Median’, value: fmt(median, 4) },
{ label: ‘Mode’, value: modeStr },
{ label: ‘Std Dev (pop)’, value: fmt(stdDev, 4) },
{ label: ‘Std Dev (sample)’, value: fmt(sampleStdDev, 4) },
{ label: ‘Variance (pop)’, value: fmt(variance, 4) },
{ label: ‘Min’, value: fmt(data[0]) },
{ label: ‘Q1’, value: fmt(q1, 4) },
{ label: ‘Q3’, value: fmt(q3, 4) },
{ label: ‘IQR’, value: fmt(iqr, 4) },
{ label: ‘Max’, value: fmt(data[n - 1]) },
{ label: ‘Range’, value: fmt(range) },
{ label: ‘Sum’, value: fmt(sum) },
];

grid.innerHTML = stats.map(s =>
`<div class="stat-card"><div class="stat-label">${s.label}</div><div class="stat-value">${s.value}</div></div>`
).join(’’);

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
const n = parseInt(document.getElementById(‘prob-n’).value);
const r = parseInt(document.getElementById(‘prob-r’).value);
const box = document.getElementById(‘combperm-result’);

if (isNaN(n) || isNaN(r) || n < 0 || r < 0) {
box.innerHTML = ‘<span class="result-error">Enter valid n and r (non-negative integers).</span>’;
return;
}

let html = ‘<div class="result-label">Results</div>’;
html += `<div class="result-step">C(${n}, ${r}) = <span class="result-highlight" style="font-size:18px">${comb(n, r).toLocaleString()}</span></div>`;
html += `<div class="result-step">P(${n}, ${r}) = <span class="result-highlight" style="font-size:18px">${perm(n, r).toLocaleString()}</span></div>`;
html += `<div class="result-step">${n}! = ${factorial(n).toLocaleString()}</div>`;
box.innerHTML = html;
}

function calcBinomial() {
const n = parseInt(document.getElementById(‘binom-n’).value);
const k = parseInt(document.getElementById(‘binom-k’).value);
const p = parseFloat(document.getElementById(‘binom-p’).value);
const box = document.getElementById(‘binom-result’);

if (isNaN(n) || isNaN(k) || isNaN(p) || n < 1 || k < 0 || k > n || p < 0 || p > 1) {
box.innerHTML = ‘<span class="result-error">Check inputs: n ≥ 1, 0 ≤ k ≤ n, 0 ≤ p ≤ 1.</span>’;
return;
}

const prob = comb(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
const expVal = n * p;
const stdDev = Math.sqrt(n * p * (1 - p));

let html = ‘<div class="result-label">Binomial Distribution</div>’;
html += `<div class="result-step">P(X = ${k}) = C(${n},${k}) · ${p}^${k} · ${fmt(1-p)}^${n-k}</div>`;
html += `<div class="result-step"><span class="result-highlight" style="font-size:20px">P(X = ${k}) = ${fmt(prob, 8)}</span></div>`;
html += `<div class="result-step">≈ ${(prob * 100).toFixed(4)}%</div>`;
html += `<div class="result-step">E[X] = np = <span class="result-highlight">${fmt(expVal)}</span></div>`;
html += `<div class="result-step">σ = √(np(1-p)) = <span class="result-highlight">${fmt(stdDev)}</span></div>`;
box.innerHTML = html;
}

function calcNormal() {
const x = parseFloat(document.getElementById(‘norm-x’).value);
const mean = parseFloat(document.getElementById(‘norm-mean’).value);
const sd = parseFloat(document.getElementById(‘norm-sd’).value);
const box = document.getElementById(‘normal-result’);

if (isNaN(x) || isNaN(mean) || isNaN(sd) || sd <= 0) {
box.innerHTML = ‘<span class="result-error">Enter valid x, μ, and σ (σ > 0).</span>’;
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

let html = ‘<div class="result-label">Normal Distribution</div>’;
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
const xRaw = document.getElementById(‘reg-x’).value.trim();
const yRaw = document.getElementById(‘reg-y’).value.trim();
const box = document.getElementById(‘reg-result’);

if (!xRaw || !yRaw) { box.innerHTML = ‘<span class="result-error">Enter x and y values.</span>’; return; }

const xs = xRaw.split(/[\s,]+/).map(Number).filter(n => !isNaN(n));
const ys = yRaw.split(/[\s,]+/).map(Number).filter(n => !isNaN(n));

if (xs.length !== ys.length || xs.length < 2) {
box.innerHTML = ‘<span class="result-error">x and y must have the same number of values (≥ 2).</span>’;
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

let html = ‘<div class="result-label">Least Squares Regression</div>’;
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
//  STUDY TOOLS — Flashcards & Quiz Maker
// ============================================
// ============================================

// –– LOCAL STORAGE HELPERS ––
function stLoad(key, fallback) {
try {
const raw = localStorage.getItem(key);
return raw ? JSON.parse(raw) : fallback;
} catch { return fallback; }
}

function stSave(key, data) {
try { localStorage.setItem(key, JSON.stringify(data)); } catch(e) { console.warn(‘Storage full:’, e); }
}

function generateId() {
return ‘_’ + Math.random().toString(36).substr(2, 9);
}

// ============================================
// FLASHCARDS
// ============================================
let fcDecks = stLoad(‘mt_fc_decks’, []);
let fcCurrentDeckId = null;
let fcStudyCards = [];
let fcStudyIndex = 0;
let fcIsShuffled = false;

function fcRenderDecks() {
const grid = document.getElementById(‘fc-deck-grid’);
if (!grid) return;

let html = `<div class="deck-card-new" onclick="fcCreateDeck()">
<div class="plus-icon">+</div>
<span>New Deck</span>

  </div>`;

fcDecks.forEach(deck => {
html += `<div class="deck-card"> <div class="deck-emoji">🃏</div> <div class="deck-name">${escHtml(deck.name)}</div> <div class="deck-count">${deck.cards.length} card${deck.cards.length !== 1 ? 's' : ''}</div> <div class="deck-actions"> <button onclick="fcOpenDeck('${deck.id}')">Edit</button> <button onclick="event.stopPropagation(); fcStudyDeckDirect('${deck.id}')">Study</button> <button onclick="event.stopPropagation(); fcRenameDeck('${deck.id}')" title="Rename">✎</button> <button class="btn-danger" onclick="event.stopPropagation(); fcDeleteDeck('${deck.id}')">✕</button> </div> </div>`;
});

if (fcDecks.length === 0) {
html += `<div class="empty-state" style="grid-column:1/-1"> <div class="empty-icon">🃏</div> <p>No decks yet — create your first one!</p> </div>`;
}

grid.innerHTML = html;
}

function escHtml(str) {
const el = document.createElement(‘span’);
el.textContent = str;
return el.innerHTML;
}

function fcCreateDeck() {
showModal(‘New Flashcard Deck’, [
{ id: ‘md-deck-name’, label: ‘Deck Name’, placeholder: ‘e.g. AP Calc Derivatives’ }
], (values) => {
const name = values[‘md-deck-name’].trim();
if (!name) return;
const deck = { id: generateId(), name, cards: [], created: Date.now() };
fcDecks.push(deck);
stSave(‘mt_fc_decks’, fcDecks);
closeModal();
fcOpenDeck(deck.id);
});
}

function fcRenameDeck(deckId) {
const deck = fcDecks.find(d => d.id === deckId);
if (!deck) return;
showModal(‘Rename Deck’, [
{ id: ‘md-deck-rename’, label: ‘New Name’, placeholder: deck.name, value: deck.name }
], (values) => {
const name = values[‘md-deck-rename’].trim();
if (!name) return;
deck.name = name;
stSave(‘mt_fc_decks’, fcDecks);
closeModal();
fcRenderDecks();
if (fcCurrentDeckId === deckId) {
document.getElementById(‘fc-editor-title’).textContent = name;
}
});
}

function fcDeleteDeck(deckId) {
const deck = fcDecks.find(d => d.id === deckId);
if (!deck) return;
if (!confirm(`Delete "${deck.name}" and all its cards? This can't be undone.`)) return;
fcDecks = fcDecks.filter(d => d.id !== deckId);
stSave(‘mt_fc_decks’, fcDecks);
fcRenderDecks();
}

function fcOpenDeck(deckId) {
fcCurrentDeckId = deckId;
const deck = fcDecks.find(d => d.id === deckId);
if (!deck) return;

document.getElementById(‘fc-deck-list’).style.display = ‘none’;
document.getElementById(‘fc-deck-editor’).style.display = ‘block’;
document.getElementById(‘fc-study-mode’).style.display = ‘none’;

document.getElementById(‘fc-editor-title’).textContent = deck.name;
fcRenderCardList();
}

function fcBackToDecks() {
document.getElementById(‘fc-deck-list’).style.display = ‘block’;
document.getElementById(‘fc-deck-editor’).style.display = ‘none’;
document.getElementById(‘fc-study-mode’).style.display = ‘none’;
fcCurrentDeckId = null;
fcRenderDecks();
}

function fcRenderCardList() {
const deck = fcDecks.find(d => d.id === fcCurrentDeckId);
if (!deck) return;

document.getElementById(‘fc-editor-count’).textContent = `${deck.cards.length} card${deck.cards.length !== 1 ? 's' : ''}`;

const list = document.getElementById(‘fc-card-list’);
if (deck.cards.length === 0) {
list.innerHTML = `<div class="empty-state"> <div class="empty-icon">📝</div> <p>No cards yet — add your first one below.</p> </div>`;
return;
}

list.innerHTML = deck.cards.map((card, i) => `<div class="card-editor-row"> <div class="card-num">Card ${i + 1}</div> <input type="text" class="form-input" value="${escHtml(card.front)}" onchange="fcUpdateCard(${i}, 'front', this.value)"> <input type="text" class="form-input" value="${escHtml(card.back)}" onchange="fcUpdateCard(${i}, 'back', this.value)"> <button class="card-delete-btn" onclick="fcDeleteCard(${i})" title="Delete">✕</button> </div>`).join(’’);
}

function fcAddCard() {
const deck = fcDecks.find(d => d.id === fcCurrentDeckId);
if (!deck) return;

const front = document.getElementById(‘fc-new-front’).value.trim();
const back = document.getElementById(‘fc-new-back’).value.trim();
if (!front || !back) return;

deck.cards.push({ front, back });
stSave(‘mt_fc_decks’, fcDecks);

document.getElementById(‘fc-new-front’).value = ‘’;
document.getElementById(‘fc-new-back’).value = ‘’;
document.getElementById(‘fc-new-front’).focus();

fcRenderCardList();
}

function fcUpdateCard(index, side, value) {
const deck = fcDecks.find(d => d.id === fcCurrentDeckId);
if (!deck || !deck.cards[index]) return;
deck.cards[index][side] = value;
stSave(‘mt_fc_decks’, fcDecks);
}

function fcDeleteCard(index) {
const deck = fcDecks.find(d => d.id === fcCurrentDeckId);
if (!deck) return;
deck.cards.splice(index, 1);
stSave(‘mt_fc_decks’, fcDecks);
fcRenderCardList();
}

// –– STUDY MODE ––
function fcStudyDeckDirect(deckId) {
fcCurrentDeckId = deckId;
fcOpenDeck(deckId);
fcStartStudy();
}

function fcStartStudy(shuffled) {
shuffled = shuffled || false;
const deck = fcDecks.find(d => d.id === fcCurrentDeckId);
if (!deck || deck.cards.length === 0) {
alert(‘Add some cards first!’);
return;
}

fcStudyCards = deck.cards.slice();
fcIsShuffled = shuffled;

if (shuffled) {
for (let i = fcStudyCards.length - 1; i > 0; i–) {
const j = Math.floor(Math.random() * (i + 1));
[fcStudyCards[i], fcStudyCards[j]] = [fcStudyCards[j], fcStudyCards[i]];
}
}

fcStudyIndex = 0;

document.getElementById(‘fc-deck-list’).style.display = ‘none’;
document.getElementById(‘fc-deck-editor’).style.display = ‘none’;
document.getElementById(‘fc-study-mode’).style.display = ‘block’;

var badgeArea = document.getElementById(‘fc-shuffle-badge-area’);
badgeArea.innerHTML = shuffled ? ‘<span class="shuffle-badge">🔀 Shuffled</span>’ : ‘’;

fcRenderStudyCard();
}

function fcShuffleStudy() { fcStartStudy(true); }

function fcRenderStudyCard() {
var card = fcStudyCards[fcStudyIndex];
if (!card) return;

document.getElementById(‘fc-front-text’).textContent = card.front;
document.getElementById(‘fc-back-text’).textContent = card.back;
document.getElementById(‘fc-inner’).classList.remove(‘flipped’);

var total = fcStudyCards.length;
var current = fcStudyIndex + 1;
document.getElementById(‘fc-study-progress’).textContent = ’Card ’ + current + ’ of ’ + total;
document.getElementById(‘fc-progress-fill’).style.width = ((current / total) * 100) + ‘%’;
}

function fcFlip() {
document.getElementById(‘fc-inner’).classList.toggle(‘flipped’);
}

function fcNext() {
if (fcStudyIndex < fcStudyCards.length - 1) {
fcStudyIndex++;
fcRenderStudyCard();
}
}

function fcPrev() {
if (fcStudyIndex > 0) {
fcStudyIndex–;
fcRenderStudyCard();
}
}

function fcBackToEditor() {
document.getElementById(‘fc-study-mode’).style.display = ‘none’;
document.getElementById(‘fc-deck-editor’).style.display = ‘block’;
}

// Keyboard shortcuts for study mode
document.addEventListener(‘keydown’, function(e) {
var studyMode = document.getElementById(‘fc-study-mode’);
if (!studyMode || studyMode.style.display === ‘none’) return;
if ([‘INPUT’, ‘TEXTAREA’, ‘SELECT’].indexOf(document.activeElement.tagName) !== -1) return;

if (e.code === ‘Space’ || e.code === ‘ArrowUp’ || e.code === ‘ArrowDown’) {
e.preventDefault();
fcFlip();
} else if (e.code === ‘ArrowRight’) {
e.preventDefault();
fcNext();
} else if (e.code === ‘ArrowLeft’) {
e.preventDefault();
fcPrev();
}
});

// ============================================
// QUIZ MAKER
// ============================================
var qzQuizzes = stLoad(‘mt_qz_quizzes’, []);
var qzCurrentQuizId = null;
var qzAnswers = {};

function qzRenderList() {
var grid = document.getElementById(‘qz-quiz-grid’);
if (!grid) return;

var html = ‘<div class="deck-card-new" onclick="qzCreateQuiz()">’ +
‘<div class="plus-icon">+</div><span>New Quiz</span></div>’;

qzQuizzes.forEach(function(quiz) {
html += ‘<div class="deck-card">’ +
‘<div class="deck-emoji">✏️</div>’ +
‘<div class="deck-name">’ + escHtml(quiz.name) + ‘</div>’ +
‘<div class="deck-count">’ + quiz.questions.length + ’ question’ + (quiz.questions.length !== 1 ? ‘s’ : ‘’) + ‘</div>’ +
‘<div class="deck-actions">’ +
‘<button onclick="qzOpenEditor(\'' + quiz.id + '\')">Edit</button>’ +
‘<button onclick="event.stopPropagation(); qzTakeQuizDirect(\'' + quiz.id + '\')">Take</button>’ +
‘<button onclick="event.stopPropagation(); qzRenameQuiz(\'' + quiz.id + '\')" title="Rename">✎</button>’ +
‘<button class="btn-danger" onclick="event.stopPropagation(); qzDeleteQuiz(\'' + quiz.id + '\')">✕</button>’ +
‘</div></div>’;
});

if (qzQuizzes.length === 0) {
html += ‘<div class="empty-state" style="grid-column:1/-1">’ +
‘<div class="empty-icon">✏️</div>’ +
‘<p>No quizzes yet — create your first one!</p></div>’;
}

grid.innerHTML = html;
}

function qzCreateQuiz() {
showModal(‘New Quiz’, [
{ id: ‘md-quiz-name’, label: ‘Quiz Name’, placeholder: ‘e.g. Chapter 5 Review’ }
], function(values) {
var name = values[‘md-quiz-name’].trim();
if (!name) return;
var quiz = { id: generateId(), name: name, questions: [], created: Date.now() };
qzQuizzes.push(quiz);
stSave(‘mt_qz_quizzes’, qzQuizzes);
closeModal();
qzOpenEditor(quiz.id);
});
}

function qzRenameQuiz(quizId) {
var quiz = qzQuizzes.find(function(q) { return q.id === quizId; });
if (!quiz) return;
showModal(‘Rename Quiz’, [
{ id: ‘md-quiz-rename’, label: ‘New Name’, placeholder: quiz.name, value: quiz.name }
], function(values) {
var name = values[‘md-quiz-rename’].trim();
if (!name) return;
quiz.name = name;
stSave(‘mt_qz_quizzes’, qzQuizzes);
closeModal();
qzRenderList();
if (qzCurrentQuizId === quizId) {
document.getElementById(‘qz-editor-title’).textContent = name;
}
});
}

function qzDeleteQuiz(quizId) {
var quiz = qzQuizzes.find(function(q) { return q.id === quizId; });
if (!quiz) return;
if (!confirm(‘Delete “’ + quiz.name + ‘”? This can't be undone.’)) return;
qzQuizzes = qzQuizzes.filter(function(q) { return q.id !== quizId; });
stSave(‘mt_qz_quizzes’, qzQuizzes);
qzRenderList();
}

function qzShowView(view) {
[‘qz-quiz-list’, ‘qz-editor’, ‘qz-take-mode’, ‘qz-results’].forEach(function(id) {
document.getElementById(id).style.display = ‘none’;
});
document.getElementById(view).style.display = ‘block’;
}

function qzBackToList() {
qzCurrentQuizId = null;
qzShowView(‘qz-quiz-list’);
qzRenderList();
}

function qzBackToEditor() {
qzShowView(‘qz-editor’);
qzRenderEditor();
}

function qzOpenEditor(quizId) {
qzCurrentQuizId = quizId;
qzShowView(‘qz-editor’);
qzRenderEditor();
}

function qzRenderEditor() {
var quiz = qzQuizzes.find(function(q) { return q.id === qzCurrentQuizId; });
if (!quiz) return;

document.getElementById(‘qz-editor-title’).textContent = quiz.name;
document.getElementById(‘qz-editor-count’).textContent = quiz.questions.length + ’ question’ + (quiz.questions.length !== 1 ? ‘s’ : ‘’);

var container = document.getElementById(‘qz-question-editor-list’);

if (quiz.questions.length === 0) {
container.innerHTML = ‘<div class="empty-state">’ +
‘<div class="empty-icon">📝</div>’ +
‘<p>No questions yet — add one below.</p></div>’;
return;
}

var letters = [‘A’, ‘B’, ‘C’, ‘D’];

container.innerHTML = quiz.questions.map(function(q, qi) {
var isMC = q.type === ‘mc’;
var html = ‘<div class="quiz-editor-question">’ +
‘<div class="qe-header">’ +
’<span class="qe-number">Question ’ + (qi + 1) + ‘</span>’ +
‘<div style="display:flex;gap:6px;align-items:center">’ +
‘<div class="qe-type-toggle">’ +
‘<button class="qe-type-btn ' + (isMC ? 'active' : '') + '" onclick="qzChangeType(' + qi + ', \'mc\')">MC</button>’ +
‘<button class="qe-type-btn ' + (!isMC ? 'active' : '') + '" onclick="qzChangeType(' + qi + ', \'tf\')">T/F</button>’ +
‘</div>’ +
‘<button class="card-delete-btn" onclick="qzDeleteQuestion(' + qi + ')" title="Delete">✕</button>’ +
‘</div>’ +
‘</div>’ +
‘<div class="form-group" style="margin-bottom:10px">’ +
‘<input type="text" class="form-input" value="' + escHtml(q.question) + '" placeholder="Enter question..." onchange="qzUpdateQuestion(' + qi + ', \'question\', this.value)">’ +
‘</div>’;

```
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
```

}).join(’’);
}

function qzAddQuestion(type) {
var quiz = qzQuizzes.find(function(q) { return q.id === qzCurrentQuizId; });
if (!quiz) return;

if (type === ‘mc’) {
quiz.questions.push({ type: ‘mc’, question: ‘’, options: [’’, ‘’, ‘’, ‘’], correct: 0 });
} else {
quiz.questions.push({ type: ‘tf’, question: ‘’, options: [‘True’, ‘False’], correct: 0 });
}

stSave(‘mt_qz_quizzes’, qzQuizzes);
qzRenderEditor();
}

function qzUpdateQuestion(qi, field, value) {
var quiz = qzQuizzes.find(function(q) { return q.id === qzCurrentQuizId; });
if (!quiz || !quiz.questions[qi]) return;
quiz.questions[qi][field] = value;
stSave(‘mt_qz_quizzes’, qzQuizzes);
}

function qzUpdateOption(qi, oi, value) {
var quiz = qzQuizzes.find(function(q) { return q.id === qzCurrentQuizId; });
if (!quiz || !quiz.questions[qi]) return;
quiz.questions[qi].options[oi] = value;
stSave(‘mt_qz_quizzes’, qzQuizzes);
}

function qzSetCorrect(qi, oi) {
var quiz = qzQuizzes.find(function(q) { return q.id === qzCurrentQuizId; });
if (!quiz || !quiz.questions[qi]) return;
quiz.questions[qi].correct = oi;
stSave(‘mt_qz_quizzes’, qzQuizzes);
}

function qzChangeType(qi, newType) {
var quiz = qzQuizzes.find(function(q) { return q.id === qzCurrentQuizId; });
if (!quiz || !quiz.questions[qi]) return;
var q = quiz.questions[qi];
if (q.type === newType) return;
q.type = newType;
if (newType === ‘mc’) {
q.options = [’’, ‘’, ‘’, ‘’];
} else {
q.options = [‘True’, ‘False’];
}
q.correct = 0;
stSave(‘mt_qz_quizzes’, qzQuizzes);
qzRenderEditor();
}

function qzDeleteQuestion(qi) {
var quiz = qzQuizzes.find(function(q) { return q.id === qzCurrentQuizId; });
if (!quiz) return;
quiz.questions.splice(qi, 1);
stSave(‘mt_qz_quizzes’, qzQuizzes);
qzRenderEditor();
}

// –– TAKE QUIZ ––
function qzTakeQuizDirect(quizId) {
qzCurrentQuizId = quizId;
qzOpenEditor(quizId);
qzStartQuiz();
}

function qzStartQuiz() {
var quiz = qzQuizzes.find(function(q) { return q.id === qzCurrentQuizId; });
if (!quiz || quiz.questions.length === 0) {
alert(‘Add some questions first!’);
return;
}

var incomplete = quiz.questions.find(function(q) { return !q.question.trim(); });
if (incomplete) {
alert(‘Some questions are empty — fill them in first.’);
return;
}

qzAnswers = {};
qzShowView(‘qz-take-mode’);

var container = document.getElementById(‘qz-questions-container’);
var letters = [‘A’, ‘B’, ‘C’, ‘D’];

container.innerHTML = quiz.questions.map(function(q, qi) {
var html = ‘<div class="quiz-question-block" id="qz-block-' + qi + '">’ +
’<div class="quiz-q-number">Question ’ + (qi + 1) + ’ of ’ + quiz.questions.length + ‘</div>’ +
‘<div class="quiz-q-text">’ + escHtml(q.question) + ‘</div>’;

```
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
```

}).join(’’);

document.getElementById(‘qz-submit-btn’).style.display = ‘inline-flex’;
}

function qzSelectAnswer(qi, oi) {
var quiz = qzQuizzes.find(function(q) { return q.id === qzCurrentQuizId; });
if (!quiz) return;

quiz.questions[qi].options.forEach(function(_, optIdx) {
var el = document.getElementById(‘qz-opt-’ + qi + ‘-’ + optIdx);
if (el) el.classList.remove(‘selected’);
});

var el = document.getElementById(‘qz-opt-’ + qi + ‘-’ + oi);
if (el) el.classList.add(‘selected’);
qzAnswers[qi] = oi;
}

function qzSubmit() {
var quiz = qzQuizzes.find(function(q) { return q.id === qzCurrentQuizId; });
if (!quiz) return;

var total = quiz.questions.length;
var unanswered = total - Object.keys(qzAnswers).length;
if (unanswered > 0) {
if (!confirm(‘You have ’ + unanswered + ’ unanswered question’ + (unanswered > 1 ? ‘s’ : ‘’) + ‘. Submit anyway?’)) return;
}

var correct = 0;
var results = quiz.questions.map(function(q, qi) {
var userAnswer = qzAnswers[qi] !== undefined ? qzAnswers[qi] : -1;
var isCorrect = userAnswer === q.correct;
if (isCorrect) correct++;
return { userAnswer: userAnswer, correctAnswer: q.correct, isCorrect: isCorrect };
});

var pct = Math.round((correct / total) * 100);

qzShowView(‘qz-results’);

var message = ‘’;
if (pct === 100) message = ‘Perfect score! Absolutely elite — George Kittle TD celebration energy.’;
else if (pct >= 90) message = ‘Outstanding — first-team All-Pro caliber performance.’;
else if (pct >= 80) message = ‘Solid — like a reliable tight end running clean routes every snap.’;
else if (pct >= 70) message = ‘Not bad — a few dropped passes to clean up though.’;
else if (pct >= 60) message = ‘Decent effort — the playbook needs more reps.’;
else message = ‘Back to the film room — keep studying and you'll get there!’;

document.getElementById(‘qz-score-box’).innerHTML =
‘<div class="quiz-score-number">’ + pct + ‘%</div>’ +
‘<div class="quiz-score-label">’ + correct + ’ of ’ + total + ’ correct</div>’ +
‘<div class="quiz-score-message">’ + message + ‘</div>’;

var letters = [‘A’, ‘B’, ‘C’, ‘D’];
var review = document.getElementById(‘qz-results-review’);

review.innerHTML = quiz.questions.map(function(q, qi) {
var r = results[qi];
var blockClass = r.isCorrect ? ‘correct’ : ‘incorrect’;

```
var html = '<div class="quiz-question-block ' + blockClass + '">' +
  '<div class="quiz-q-number">' + (r.isCorrect ? '✓ Correct' : '✗ Incorrect') + ' — Question ' + (qi + 1) + '</div>' +
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
```

}).join(’’);
}

// ============================================
// MODAL HELPER
// ============================================
function showModal(title, fields, onSubmit) {
var existing = document.getElementById(‘app-modal’);
if (existing) existing.remove();

var overlay = document.createElement(‘div’);
overlay.className = ‘modal-overlay’;
overlay.id = ‘app-modal’;
overlay.onclick = function(e) { if (e.target === overlay) closeModal(); };

var fieldsHtml = fields.map(function(f) {
return ‘<div class="form-group">’ +
‘<label class="form-label">’ + f.label + ‘</label>’ +
‘<input type="text" class="form-input" id="' + f.id + '" placeholder="' + (f.placeholder || '') + '" value="' + (f.value || '') + '">’ +
‘</div>’;
}).join(’’);

overlay.innerHTML = ‘<div class="modal-box">’ +
‘<div class="modal-title">’ + title + ‘</div>’ +
fieldsHtml +
‘<div class="btn-group" style="justify-content:flex-end">’ +
‘<button class="btn btn-secondary" onclick="closeModal()">Cancel</button>’ +
‘<button class="btn btn-primary" id="modal-submit-btn">Create</button>’ +
‘</div></div>’;

document.body.appendChild(overlay);

setTimeout(function() {
var firstInput = overlay.querySelector(‘input’);
if (firstInput) firstInput.focus();
}, 100);

document.getElementById(‘modal-submit-btn’).onclick = function() {
var values = {};
fields.forEach(function(f) { values[f.id] = document.getElementById(f.id).value; });
onSubmit(values);
};

fields.forEach(function(f) {
var input = document.getElementById(f.id);
if (input) {
input.addEventListener(‘keydown’, function(e) {
if (e.key === ‘Enter’) document.getElementById(‘modal-submit-btn’).click();
});
}
});
}

function closeModal() {
var modal = document.getElementById(‘app-modal’);
if (modal) modal.remove();
}

// ============================================
// INIT — Render study tools on page load
// ============================================
window.addEventListener(‘DOMContentLoaded’, function() {
fcRenderDecks();
qzRenderList();
});
  
