/* ============================================
   MUSIC TOOLS - Core Application Logic
   ============================================ */

// -- NAVIGATION (shared with other sub-sites) --
function showPanel(id) {
  document.querySelectorAll('.tool-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const panel = document.getElementById('panel-' + id);
  if (panel) panel.classList.add('active');
  const nav = document.querySelector(`.nav-item[data-panel="${id}"]`);
  if (nav) nav.classList.add('active');
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('mobileOverlay').classList.remove('open');
  window.scrollTo(0, 0);

  // Initialize tools when their panels open
  if (id === 'sheetmusic') smInit();
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
  metRenderSegments();
  metSetBeatDots(4, -1);
  metRenderTimeline();
});


// ============================================
// ============================================
//  TOOL 1 — BAND METRONOME
// ============================================
// ============================================

let metSegments = [];
let metAudioCtx = null;
let metIsPlaying = false;
let metScheduleTimer = null;
let metNextBeatTime = 0;
let metCurrentSegIdx = 0;
let metCurrentBeatInSeg = 0;
let metCurrentMeasureInSeg = 0;
let metCurrentBeatInMeasure = 0;
let metTotalBeats = 0;
let metBeatsElapsed = 0;
let metCountInBeats = 0;
let metIsCountIn = false;
let metPrevSegIdx = -1;

const MET_LOOK_AHEAD = 0.1;
const MET_SCHEDULE_INTERVAL = 25;

const metSegColors = [
  '#00d4ff','#7c3aed','#00e68a','#ff8c00','#ff4466',
  '#e35baa','#5be3c8','#c8e35b','#e3925b','#5b8dee'
];

function metGetAudioCtx() {
  if (!metAudioCtx) metAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return metAudioCtx;
}

function metPlayClick(time, isAccent, isCountIn) {
  if (!document.getElementById('met-soundToggle').checked) return;
  var ctx = metGetAudioCtx();
  var osc = ctx.createOscillator();
  var gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  if (isCountIn) {
    osc.frequency.value = isAccent ? 1100 : 880;
    gain.gain.setValueAtTime(0.22, time);
  } else if (isAccent) {
    osc.frequency.value = 1200;
    gain.gain.setValueAtTime(0.55, time);
  } else {
    osc.frequency.value = 800;
    gain.gain.setValueAtTime(0.3, time);
  }
  gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.06);
  osc.start(time);
  osc.stop(time + 0.07);
}

function metAddSegment() {
  var bpm = parseInt(document.getElementById('met-addBpm').value);
  var measures = parseInt(document.getElementById('met-addMeasures').value);
  if (isNaN(bpm) || bpm < 20 || bpm > 300) return metShowStatus('BPM must be 20–300', 'red');
  if (isNaN(measures) || measures < 1) return metShowStatus('Measures must be ≥ 1', 'red');
  metSegments.push({ bpm: bpm, measures: measures });
  metRenderSegments();
  metRenderTimeline();
  metShowStatus('Added: ' + bpm + ' BPM × ' + measures + ' measures', 'green');
}

function metDeleteSegment(i) {
  metSegments.splice(i, 1);
  metRenderSegments();
  metRenderTimeline();
}

function metRenderSegments() {
  var list = document.getElementById('met-tempoList');
  if (!list) return;
  if (metSegments.length === 0) {
    list.innerHTML = '<div style="text-align:center;color:var(--text-muted);font-size:.83rem;padding:12px 0;">No segments yet — add one above</div>';
    return;
  }
  var timeSig = parseInt(document.getElementById('met-timeSig').value);
  var html = '';
  var runningMeasure = 1;
  metSegments.forEach(function(s, i) {
    var endMeasure = runningMeasure + s.measures - 1;
    var isActive = metIsPlaying && i === metCurrentSegIdx && !metIsCountIn;
    html += '<div class="met-tempo-row ' + (isActive ? 'active-segment' : '') + '">' +
      '<div><div class="met-seg-bpm">' + s.bpm + ' <span style="font-size:.7rem;font-weight:400;color:var(--text-muted)">BPM</span></div></div>' +
      '<div class="met-seg-info">' +
        '<span style="color:var(--text-primary)">' + s.measures + ' measure' + (s.measures !== 1 ? 's' : '') + '</span>' +
        '<span class="met-badge">m' + runningMeasure + '–' + endMeasure + '</span>' +
        '<span class="met-badge met-badge-alt">' + timeSig + '/4</span>' +
      '</div>' +
      '<button class="card-delete-btn" onclick="metDeleteSegment(' + i + ')" ' + (metIsPlaying ? 'disabled' : '') + ' title="Remove">✕</button>' +
    '</div>';
    runningMeasure += s.measures;
  });
  list.innerHTML = html;
}

function metRenderTimeline() {
  var bar = document.getElementById('met-tlBar');
  if (!bar) return;
  if (metSegments.length === 0) { bar.innerHTML = ''; return; }
  var total = metSegments.reduce(function(a, s) { return a + s.measures; }, 0);
  var html = '';
  metSegments.forEach(function(s, i) {
    var pct = (s.measures / total * 100).toFixed(2);
    var color = metSegColors[i % metSegColors.length];
    var played = metIsPlaying && i < metCurrentSegIdx;
    var current = metIsPlaying && i === metCurrentSegIdx && !metIsCountIn;
    html += '<div class="met-tl-seg ' + (played ? 'played' : '') + ' ' + (current ? 'current' : '') + '" ' +
      'style="width:' + pct + '%;background:' + color + ';" title="' + s.bpm + ' BPM – ' + s.measures + ' measures">' +
      '<span>' + s.bpm + '</span></div>';
  });
  bar.innerHTML = html;
}

function metStartMetronome() {
  if (metSegments.length === 0) return metShowStatus('Add at least one segment first!', 'red');
  if (metIsPlaying) return;
  metGetAudioCtx().resume();
  metIsPlaying = true;
  metCurrentSegIdx = 0;
  metCurrentBeatInSeg = 0;
  metCurrentMeasureInSeg = 0;
  metCurrentBeatInMeasure = 0;
  metPrevSegIdx = -1;

  var timeSig = parseInt(document.getElementById('met-timeSig').value);
  var countInMeasures = parseInt(document.getElementById('met-countIn').value);
  metCountInBeats = countInMeasures * timeSig;
  metIsCountIn = metCountInBeats > 0;
  metTotalBeats = metSegments.reduce(function(a, s) { return a + s.measures * timeSig; }, 0);
  metBeatsElapsed = 0;

  metNextBeatTime = metGetAudioCtx().currentTime + 0.05;
  metScheduleTimer = setInterval(metSchedulerTick, MET_SCHEDULE_INTERVAL);

  document.getElementById('met-startBtn').disabled = true;
  document.getElementById('met-stopBtn').disabled = false;
  document.getElementById('met-restartBtn').disabled = false;
  metSetBeatDots(timeSig, -1);
}

function metStopMetronome() {
  metIsPlaying = false;
  clearInterval(metScheduleTimer);
  document.getElementById('met-startBtn').disabled = false;
  document.getElementById('met-stopBtn').disabled = true;
  document.getElementById('met-restartBtn').disabled = false;
  document.getElementById('met-npBpm').textContent = '—';
  document.getElementById('met-npLabel').textContent = 'BPM';
  document.getElementById('met-npProgress').textContent = 'Stopped';
  document.getElementById('met-progressFill').style.width = '0%';
  metRenderSegments();
  metRenderTimeline();
  metSetBeatDots(parseInt(document.getElementById('met-timeSig').value), -1);
}

function metRestartMetronome() {
  metStopMetronome();
  setTimeout(function() { metStartMetronome(); }, 80);
}

function metSchedulerTick() {
  var ctx = metGetAudioCtx();
  while (metNextBeatTime < ctx.currentTime + MET_LOOK_AHEAD) {
    metScheduleNextBeat(metNextBeatTime);
    metAdvanceBeat();
  }
}

function metScheduleNextBeat(time) {
  var timeSig = parseInt(document.getElementById('met-timeSig').value);
  var accent = parseInt(document.getElementById('met-accentMode').value);

  if (metIsCountIn) {
    var countInMeasures = parseInt(document.getElementById('met-countIn').value);
    var totalCountBeats = countInMeasures * timeSig;
    var countBeat = totalCountBeats - metCountInBeats;
    var isAcc = (countBeat % timeSig === 0) && accent;
    metPlayClick(time, isAcc, true);
    var delay = (time - metGetAudioCtx().currentTime) * 1000;
    var beatInMeasure = countBeat % timeSig;
    setTimeout(function() {
      if (!metIsPlaying) return;
      metFlashBeat(beatInMeasure, timeSig, isAcc);
      document.getElementById('met-npBpm').textContent = metSegments[0].bpm;
      document.getElementById('met-npLabel').textContent = 'BPM (count-in)';
      document.getElementById('met-npProgress').innerHTML = 'Count-in: beat <span>' + (beatInMeasure + 1) + '</span> / ' + timeSig;
    }, Math.max(0, delay));
    return;
  }

  var seg = metSegments[metCurrentSegIdx];
  var isAccent = (metCurrentBeatInMeasure === 0) && accent;
  metPlayClick(time, isAccent, false);

  var snapSeg = metCurrentSegIdx;
  var snapBeat = metCurrentBeatInMeasure;
  var snapMeasureInSeg = metCurrentMeasureInSeg;
  var snapBeatsElapsed = metBeatsElapsed;
  var delay2 = (time - metGetAudioCtx().currentTime) * 1000;

  setTimeout(function() {
    if (!metIsPlaying) return;
    metFlashBeat(snapBeat, timeSig, isAccent);
    metUpdateNowPlaying(snapSeg, snapBeat, snapMeasureInSeg, snapBeatsElapsed, timeSig);
  }, Math.max(0, delay2));
}

function metAdvanceBeat() {
  var timeSig = parseInt(document.getElementById('met-timeSig').value);
  if (metIsCountIn) {
    var bpm = metSegments[0].bpm;
    metNextBeatTime += 60 / bpm;
    metCountInBeats--;
    if (metCountInBeats <= 0) metIsCountIn = false;
    return;
  }
  var seg = metSegments[metCurrentSegIdx];
  metNextBeatTime += 60 / seg.bpm;
  metBeatsElapsed++;
  metCurrentBeatInMeasure++;
  metCurrentBeatInSeg++;

  if (metCurrentBeatInMeasure >= timeSig) {
    metCurrentBeatInMeasure = 0;
    metCurrentMeasureInSeg++;
  }
  if (metCurrentMeasureInSeg >= seg.measures) {
    metCurrentMeasureInSeg = 0;
    metCurrentBeatInSeg = 0;
    metCurrentSegIdx++;
    if (metCurrentSegIdx >= metSegments.length) {
      setTimeout(function() {
        if (metIsPlaying) {
          metStopMetronome();
          metShowStatus('Song complete!', 'green');
          document.getElementById('met-npProgress').textContent = 'Song complete!';
        }
      }, 100);
    }
  }
}

function metSetBeatDots(timeSig, activeBeat) {
  var container = document.getElementById('met-beatDisplay');
  if (!container) return;
  var html = '';
  for (var i = 0; i < timeSig; i++) {
    var cls = activeBeat === i ? (i === 0 ? 'met-beat-dot on-beat-1' : 'met-beat-dot on-beat') : 'met-beat-dot';
    html += '<div class="' + cls + '" id="met-dot-' + i + '"></div>';
  }
  container.innerHTML = html;
}

function metFlashBeat(beatIdx, timeSig, isAccent) {
  if (!document.getElementById('met-flashToggle').checked) return;
  for (var i = 0; i < timeSig; i++) {
    var dot = document.getElementById('met-dot-' + i);
    if (!dot) continue;
    if (i === beatIdx) {
      dot.className = isAccent ? 'met-beat-dot on-beat-1' : 'met-beat-dot on-beat';
      (function(d) { setTimeout(function() { if (d) d.className = 'met-beat-dot'; }, 120); })(dot);
    } else {
      dot.className = 'met-beat-dot';
    }
  }
}

function metUpdateNowPlaying(segIdx, beatInMeasure, measureInSeg, beatsEl, timeSig) {
  if (segIdx >= metSegments.length) return;
  var seg = metSegments[segIdx];
  if (segIdx !== metPrevSegIdx) {
    var bpmEl = document.getElementById('met-npBpm');
    bpmEl.classList.add('changed');
    setTimeout(function() { bpmEl.classList.remove('changed'); }, 600);
    metPrevSegIdx = segIdx;
    metRenderSegments();
    metRenderTimeline();
  }
  document.getElementById('met-npBpm').textContent = seg.bpm;
  document.getElementById('met-npLabel').textContent = 'BPM';

  var startMeasure = 0;
  for (var i = 0; i < segIdx; i++) startMeasure += metSegments[i].measures;
  var globalMeasure = startMeasure + measureInSeg + 1;
  var totalMeasures = metSegments.reduce(function(a, s) { return a + s.measures; }, 0);

  document.getElementById('met-npProgress').innerHTML =
    'Measure <span>' + globalMeasure + '</span> / ' + totalMeasures +
    ' &nbsp;|&nbsp; Beat <span>' + (beatInMeasure + 1) + '</span> / ' + timeSig +
    ' &nbsp;|&nbsp; Segment <span>' + (segIdx + 1) + '</span> / ' + metSegments.length;

  var pct = (beatsEl / metTotalBeats * 100).toFixed(1);
  document.getElementById('met-progressFill').style.width = pct + '%';
}

function metShowStatus(msg, type) {
  var el = document.getElementById('met-statusBanner');
  if (!el) return;
  el.textContent = msg;
  el.style.display = 'block';
  el.style.background = type === 'red' ? 'rgba(255,68,102,.12)' : 'rgba(0,230,138,.12)';
  el.style.borderColor = type === 'red' ? 'rgba(255,68,102,.3)' : 'rgba(0,230,138,.3)';
  el.style.color = type === 'red' ? 'var(--accent-red)' : 'var(--accent-green)';
  clearTimeout(el._t);
  el._t = setTimeout(function() { el.style.display = 'none'; }, 3000);
}

function metClearAll() {
  if (metIsPlaying) return;
  metSegments = [];
  metRenderSegments();
  metRenderTimeline();
}

function metLoadExample() {
  if (metIsPlaying) return;
  metSegments = [
    { bpm: 80, measures: 8 },
    { bpm: 88, measures: 8 },
    { bpm: 116, measures: 16 },
    { bpm: 126, measures: 8 },
  ];
  metRenderSegments();
  metRenderTimeline();
  metShowStatus('Example loaded — 80 → 88 → 116 → 126 BPM', 'green');
}


// ============================================
// ============================================
//  TOOL 2 — SHEET MUSIC CREATOR
// ============================================
// ============================================

let smNotes = [];
let smClef = 'treble';
let smKeySig = 'C';
let smTimeSig = '4/4';
let smSelectedDuration = 'q'; // q = quarter

const SM_NOTE_NAMES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const SM_OCTAVES = [3, 4, 5, 6];
const SM_DURATIONS = [
  { key: 'w', label: 'Whole', beats: 4 },
  { key: 'h', label: 'Half', beats: 2 },
  { key: 'q', label: 'Quarter', beats: 1 },
  { key: '8', label: 'Eighth', beats: 0.5 },
  { key: '16', label: '16th', beats: 0.25 },
];

const SM_ACCIDENTALS = [
  { key: '', label: 'Natural', symbol: '♮' },
  { key: '#', label: 'Sharp', symbol: '♯' },
  { key: 'b', label: 'Flat', symbol: '♭' },
];

let smSelectedAccidental = '';
let smSelectedOctave = 4;

function smInit() {
  smRenderNoteButtons();
  smRenderScore();
  smUpdateNoteList();
}

function smSetDuration(dur, btn) {
  smSelectedDuration = dur;
  document.querySelectorAll('.sm-dur-btn').forEach(function(b) { b.classList.remove('active'); });
  if (btn) btn.classList.add('active');
}

function smSetAccidental(acc, btn) {
  smSelectedAccidental = acc;
  document.querySelectorAll('.sm-acc-btn').forEach(function(b) { b.classList.remove('active'); });
  if (btn) btn.classList.add('active');
}

function smSetOctave(oct) {
  smSelectedOctave = oct;
}

function smSetClef(clef) {
  smClef = clef;
  smRenderScore();
}

function smSetKeySig(key) {
  smKeySig = key;
  smRenderScore();
}

function smSetTimeSig(ts) {
  smTimeSig = ts;
  smRenderScore();
}

function smAddNote(noteName) {
  var fullNote = noteName + smSelectedAccidental;
  smNotes.push({
    note: fullNote,
    octave: smSelectedOctave,
    duration: smSelectedDuration,
  });
  smRenderScore();
  smUpdateNoteList();
}

function smAddRest() {
  smNotes.push({
    note: 'REST',
    octave: 0,
    duration: smSelectedDuration,
  });
  smRenderScore();
  smUpdateNoteList();
}

function smDeleteNote(index) {
  smNotes.splice(index, 1);
  smRenderScore();
  smUpdateNoteList();
}

function smClearAll() {
  smNotes = [];
  smRenderScore();
  smUpdateNoteList();
}

function smRenderNoteButtons() {
  var container = document.getElementById('sm-note-buttons');
  if (!container) return;
  var html = '';
  SM_NOTE_NAMES.forEach(function(n) {
    html += '<button class="btn btn-secondary sm-note-btn" onclick="smAddNote(\'' + n + '\')">' + n + '</button>';
  });
  container.innerHTML = html;
}

function smUpdateNoteList() {
  var list = document.getElementById('sm-note-list');
  if (!list) return;

  if (smNotes.length === 0) {
    list.innerHTML = '<div style="text-align:center;color:var(--text-muted);font-size:.83rem;padding:12px 0;">No notes yet — use the buttons above to add notes</div>';
    return;
  }

  var durLabels = { w: 'Whole', h: 'Half', q: 'Quarter', '8': '8th', '16': '16th' };
  var html = '';
  smNotes.forEach(function(n, i) {
    var label = n.note === 'REST' ? 'Rest' : n.note + n.octave;
    var durLabel = durLabels[n.duration] || n.duration;
    html += '<div class="sm-note-row">' +
      '<span class="sm-note-idx">' + (i + 1) + '</span>' +
      '<span class="sm-note-name">' + label + '</span>' +
      '<span class="sm-note-dur">' + durLabel + '</span>' +
      '<button class="card-delete-btn" onclick="smDeleteNote(' + i + ')" title="Remove">✕</button>' +
    '</div>';
  });
  list.innerHTML = html;
}

function smRenderScore() {
  var container = document.getElementById('sm-vexflow-output');
  if (!container) return;
  container.innerHTML = '';

  if (typeof Vex === 'undefined') {
    container.innerHTML = '<div style="text-align:center;color:var(--text-muted);padding:40px 20px;">Loading VexFlow library...</div>';
    return;
  }

  if (smNotes.length === 0) {
    container.innerHTML = '<div style="text-align:center;color:var(--text-muted);padding:40px 20px;">Add notes to see your sheet music here</div>';
    return;
  }

  try {
    var VF = Vex.Flow;

    // Calculate how many measures we need
    var tsParts = smTimeSig.split('/');
    var beatsPerMeasure = parseInt(tsParts[0]);
    var beatValue = parseInt(tsParts[1]);

    // Map duration to beat counts (relative to beat value)
    var durBeats = { w: 4, h: 2, q: 1, '8': 0.5, '16': 0.25 };

    // Group notes into measures
    var measures = [];
    var currentMeasure = [];
    var currentBeats = 0;

    smNotes.forEach(function(n) {
      var nBeats = durBeats[n.duration] || 1;
      if (currentBeats + nBeats > beatsPerMeasure && currentMeasure.length > 0) {
        measures.push(currentMeasure);
        currentMeasure = [];
        currentBeats = 0;
      }
      currentMeasure.push(n);
      currentBeats += nBeats;
    });
    if (currentMeasure.length > 0) measures.push(currentMeasure);

    var measuresPerLine = 4;
    var lines = [];
    for (var i = 0; i < measures.length; i += measuresPerLine) {
      lines.push(measures.slice(i, i + measuresPerLine));
    }

    var staveWidth = 250;
    var staveHeight = 140;
    var lineHeight = staveHeight + 20;
    var totalWidth = Math.min((measuresPerLine * staveWidth) + 60, container.clientWidth || 800);
    var totalHeight = lines.length * lineHeight + 40;
    var actualStaveWidth = (totalWidth - 60) / measuresPerLine;

    var renderer = new VF.Renderer(container, VF.Renderer.Backends.SVG);
    renderer.resize(totalWidth, totalHeight);
    var context = renderer.getContext();
    context.setFont('Arial', 10);

    // Style SVG for dark theme
    var svgEl = container.querySelector('svg');
    if (svgEl) {
      svgEl.style.background = 'transparent';
      // Set all VexFlow elements to white
      var allPaths = svgEl.querySelectorAll('path, line, rect');
      allPaths.forEach(function(p) {
        if (p.getAttribute('fill') && p.getAttribute('fill') !== 'none') {
          p.setAttribute('fill', '#e8e8f0');
        }
        if (p.getAttribute('stroke') && p.getAttribute('stroke') !== 'none') {
          p.setAttribute('stroke', '#e8e8f0');
        }
      });
    }

    lines.forEach(function(lineMeasures, lineIdx) {
      var y = lineIdx * lineHeight + 20;

      lineMeasures.forEach(function(measureNotes, mIdx) {
        var x = mIdx * actualStaveWidth + 10;
        var isFirst = (lineIdx === 0 && mIdx === 0);
        var w = actualStaveWidth;

        var stave = new VF.Stave(x, y, w);
        if (isFirst) {
          stave.addClef(smClef);
          stave.addKeySignature(smKeySig);
          stave.addTimeSignature(smTimeSig);
        }
        stave.setContext(context).draw();

        // Build VexFlow notes
        var vfNotes = measureNotes.map(function(n) {
          if (n.note === 'REST') {
            var restDur = n.duration + 'r';
            return new VF.StaveNote({ clef: smClef, keys: ['b/4'], duration: restDur });
          }
          var noteLetter = n.note.replace(/[#b]/g, '');
          var key = noteLetter.toLowerCase() + '/' + n.octave;
          var vfNote = new VF.StaveNote({ clef: smClef, keys: [key], duration: n.duration });

          // Add accidentals
          if (n.note.includes('#')) {
            vfNote.addAccidental(0, new VF.Accidental('#'));
          } else if (n.note.includes('b') && n.note.length > 1) {
            vfNote.addAccidental(0, new VF.Accidental('b'));
          }

          return vfNote;
        });

        if (vfNotes.length > 0) {
          // Add beams for 8th and 16th notes
          var beamGroups = [];
          var currentBeam = [];
          measureNotes.forEach(function(noteData, nIdx) {
            var dur = noteData.duration;
            var isRest = noteData.note === 'REST';
            if ((dur === '8' || dur === '16') && !isRest) {
              currentBeam.push(vfNotes[nIdx]);
            } else {
              if (currentBeam.length >= 2) beamGroups.push(currentBeam);
              currentBeam = [];
            }
          });
          if (currentBeam.length >= 2) beamGroups.push(currentBeam);

          var voice = new VF.Voice({ num_beats: beatsPerMeasure, beat_value: beatValue }).setMode(VF.Voice.Mode.SOFT);
          voice.addTickables(vfNotes);
          new VF.Formatter().joinVoices([voice]).format([voice], w - (isFirst ? 100 : 30));
          voice.draw(context, stave);

          beamGroups.forEach(function(group) {
            try { var beam = new VF.Beam(group); beam.setContext(context).draw(); } catch(e) {}
          });
        }
      });
    });

    // Re-apply dark theme colors after draw
    if (svgEl) {
      setTimeout(function() {
        svgEl.querySelectorAll('text').forEach(function(t) { t.setAttribute('fill', '#e8e8f0'); });
        svgEl.querySelectorAll('path').forEach(function(p) {
          var fill = p.getAttribute('fill');
          var stroke = p.getAttribute('stroke');
          if (fill && fill !== 'none' && fill !== 'transparent') p.setAttribute('fill', '#e8e8f0');
          if (stroke && stroke !== 'none' && stroke !== 'transparent') p.setAttribute('stroke', '#e8e8f0');
        });
        svgEl.querySelectorAll('line').forEach(function(l) {
          l.setAttribute('stroke', '#e8e8f0');
        });
        svgEl.querySelectorAll('rect').forEach(function(r) {
          var fill = r.getAttribute('fill');
          if (fill && fill !== 'none' && fill !== 'transparent' && fill !== '#ffffff00') r.setAttribute('fill', '#e8e8f0');
        });
      }, 50);
    }

  } catch(e) {
    container.innerHTML = '<div style="color:var(--accent-red);padding:20px;">Error rendering: ' + e.message + '</div>';
  }
}

function smDownloadPNG() {
  var svgEl = document.querySelector('#sm-vexflow-output svg');
  if (!svgEl) return alert('No sheet music to download. Add some notes first!');

  var svgData = new XMLSerializer().serializeToString(svgEl);
  // Add white background for download
  svgData = svgData.replace('<svg', '<svg style="background:#1a1d27"');
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');
  var img = new Image();

  var svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  var url = URL.createObjectURL(svgBlob);

  img.onload = function() {
    canvas.width = img.width * 2;
    canvas.height = img.height * 2;
    ctx.scale(2, 2);
    ctx.fillStyle = '#12121e';
    ctx.fillRect(0, 0, img.width, img.height);
    ctx.drawImage(img, 0, 0);
    URL.revokeObjectURL(url);

    var link = document.createElement('a');
    link.download = 'sheet-music.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };
  img.src = url;
}

function smDownloadSVG() {
  var svgEl = document.querySelector('#sm-vexflow-output svg');
  if (!svgEl) return alert('No sheet music to download. Add some notes first!');

  var svgData = new XMLSerializer().serializeToString(svgEl);
  var blob = new Blob([svgData], { type: 'image/svg+xml' });
  var link = document.createElement('a');
  link.download = 'sheet-music.svg';
  link.href = URL.createObjectURL(blob);
  link.click();
}
