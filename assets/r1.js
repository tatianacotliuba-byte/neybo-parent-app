/* ---------------------------------------------------------------------------
   Release-1 overlay — Neybo Educational Companion Methodology, rev. 2026-09-04.

   The methodology reshaped the product after the calls with Marina Bers,
   Natascha Crandall and Mamatha Chary: every character now opens with a Guided
   Conversation rather than an open chat, Parent Mode is Grown-Up Mode, four
   games belong to the leading adult, and a handful of activities left release 1.

   This file applies all of that ON TOP of the shipped app. It does nothing at
   all unless the page is opened with ?r1=1, so the build the testers are using
   keeps behaving exactly as it did. Turn the parameter off and the old app is
   back, byte for byte — no git needed.

   Nothing here renames an id, a screen key, a mode key or an analytics event:
   ids are what the database and PostHog already hold, so they stay. Only what
   a parent reads changes.
--------------------------------------------------------------------------- */
(function () {
  'use strict';

  var ON = /(^|[?&])r1=1(&|$)/.test(location.search);
  if (!ON) return;

  /* ---------------------------------------------------------------- catalogue
     Release 1 is 14 solo experiences, 4 games the grown-up leads, 5 Circle Play
     games and 2 Linked Cubes games. Where an activity survived the revision it
     keeps its id and only changes its wording — Story Forge is now called
     Collaborative Storytelling, Kitchen Science is the Guided Science Lab. */

  var GC = 'Guided Conversation';

  var R1_ITEMS = [
    /* --- Ember · Let's Imagine ------------------------------------------- */
    { id:'gc-ember', e:'✨', t:"Let's Imagine", c:'e', ch:'Ember', cov:'e', m:'solo', tier:'free',
      topics:['creativity','stories'], ag:[4,10], dur:'10 min', pop:0, nw:true, pub:20260904,
      gc:true,
      desc:"Ember's own conversation. He opens with one imagined situation, stays on it for the whole session, and closes it properly instead of trailing off.",
      help:'imagination, language and holding a thread.' },
    { id:'story-forge', e:'📜', t:'Collaborative Storytelling', c:'e', ch:'Ember', cov:'e', m:'solo', tier:'free',
      topics:['creativity','stories'], ag:[5,10], dur:'10–15 min', pop:82, nw:false, pub:20260410, pg:55, last:'12 min in',
      desc:'Eve and Ember build a story together — she picks the hero, the twist and the ending, and it is saved to her own Created Stories album.',
      help:'imagination, vocabulary and story structure.' },
    { id:'paint-with-words', e:'🎨', t:'Paint With Words', c:'e', ch:'Ember', cov:'e', m:'solo', tier:'free',
      topics:['creativity','art'], ag:[4,10], dur:'5–10 min', pop:64, nw:false, pub:20260215,
      desc:'Eve describes a scene out loud and Ember paints it back in words, growing a vivid picture together.',
      help:'descriptive language and creativity.' },
    { id:'dress-up', e:'🧣', t:'Dress-Up', c:'e', ch:'Ember', cov:'e', m:'solo', tier:'free',
      topics:['creativity','play'], ag:[4,8], dur:'5–10 min', pop:58, nw:false, pub:20260118,
      desc:'Mix and match outfits for playful characters and invent who they are and where they are going.',
      help:'self-expression and pretend play.' },
    { id:'book-reading', e:'📖', t:'Book Reading', c:'e', ch:'Ember', cov:'e', m:'solo', tier:'free',
      topics:['stories','reading'], ag:[4,10], dur:'10–20 min', pop:88, nw:false, pub:20260320, last:'Yesterday',
      desc:'Around twenty curated books, banded by age. Ember remembers where Eve stopped and offers to carry on from there.',
      help:'reading confidence and listening.' },

    /* --- Moss · Curiosity & Exploration ----------------------------------- */
    { id:'gc-moss', e:'🔎', t:'Curiosity & Exploration', c:'m', ch:'Moss', cov:'m', m:'solo', tier:'free',
      topics:['science','thinking'], ag:[4,10], dur:'10 min', pop:0, nw:true, pub:20260904,
      gc:true,
      desc:"Moss's own conversation. One question, followed all the way — and he says out loud when something is a fact, a guess, or a thing nobody has settled yet.",
      help:'reasoning and honest not-knowing.' },
    { id:'sound-lab', e:'🔊', t:'Sound Lab', c:'m', ch:'Moss', cov:'m', m:'solo', tier:'free',
      topics:['science','thinking'], ag:[4,10], dur:'10 min', pop:0, nw:true, pub:20260904,
      desc:'Eve names a sound and Moss plays a real one back from his library. Nothing is generated, and nothing Eve says or makes is recorded.',
      help:'noticing sounds and learning to name them.' },
    { id:'paper-lab', e:'📐', t:'Paper Experiment Lab', c:'m', ch:'Moss', cov:'m', m:'solo', tier:'free',
      topics:['science','creativity'], ag:[5,10], dur:'10–15 min', pop:0, nw:true, pub:20260904,
      desc:'Experiments that need nothing but paper and a pencil. Eve predicts, tries it, and tells Moss what actually happened.',
      help:'prediction, observation and following steps.' },
    { id:'logic-riddles', e:'🧠', t:'Logic Riddles', c:'m', ch:'Moss', cov:'m', m:'solo', tier:'free',
      topics:['thinking','math'], ag:[5,10], dur:'5–10 min', pop:80, nw:false, pub:20260225,
      desc:'Moss poses playful riddles that get a little trickier as Eve solves them, and asks her to show how she got there.',
      help:'logic and problem-solving.' },
    { id:'charging-break', e:'🔋', t:'Charging Break', c:'m', ch:'Moss', cov:'m', m:'solo', tier:'free',
      topics:['play','calm'], ag:[4,10], dur:'3–5 min', pop:52, nw:false, pub:20260108, last:'2 days ago',
      desc:'Moss already knows the dance and shows it — Eve copies. He calls the beat out loud and never waits for an answer; say stop and he pauses.',
      help:'moving, rhythm and body awareness.' },

    /* --- Luna · Emotions --------------------------------------------------- */
    { id:'gc-luna', e:'💛', t:'Emotions', c:'l', ch:'Luna', cov:'l', m:'solo', tier:'free',
      topics:['emotions','calm'], ag:[4,10], dur:'10 min', pop:0, nw:true, pub:20260904,
      gc:true,
      desc:"Luna's own conversation. She helps Eve name what she is feeling. She never asks for secrets, never gives advice, and sends anything heavy to a grown-up.",
      help:'emotional vocabulary and knowing who to tell.' },
    { id:'breathing', e:'🌬️', t:'Breathing & Calm-Down', c:'l', ch:'Luna', cov:'l', m:'solo', tier:'free',
      topics:['calm','mindfulness'], ag:[4,10], dur:'3–5 min', pop:0, nw:true, pub:20260904,
      desc:'A short guided breath Eve can start herself when she needs it. Luna sets the pace and then goes quiet.',
      help:'self-regulation.' },
    { id:'gratitude', e:'🌟', t:'Gratitude Ritual', c:'l', ch:'Luna', cov:'l', m:'solo', tier:'free',
      topics:['emotions','calm'], ag:[4,10], dur:'3–5 min', pop:0, nw:true, pub:20260904,
      desc:'Three good things from the day, said out loud. Short by design, and the same shape every time so it becomes a habit.',
      help:'noticing and putting words to good moments.' },
    { id:'karaoke', e:'🎤', t:'Songs & Karaoke', c:'l', ch:'Luna', cov:'l', m:'solo', tier:'free',
      topics:['music'], ag:[4,10], dur:'5–10 min', pop:84, nw:false, pub:20260228, last:'Today',
      desc:'Two halves of one activity: songs where Eve fills in the missing words, and echo karaoke where Luna sings a line and Eve sings it back.',
      help:'rhythm, memory and confidence.' },

    /* --- Grown-Up Mode ----------------------------------------------------- */
    { id:'craft-studio', e:'✂️', t:'Craft Studio', c:'m', ch:'Moss', cov:'m', m:'parent', tier:'free',
      topics:['creativity','art'], ag:[4,10], dur:'15–20 min', pop:0, nw:true, pub:20260904,
      desc:'Moss talks a grown-up and a child through making something real with what is already in the house.',
      help:'making things with your hands, together.' },
    { id:'kitchen-science', e:'🧪', t:'Guided Science Lab', c:'m', ch:'Moss', cov:'m', m:'parent', tier:'free',
      topics:['science'], ag:[5,10], dur:'15–20 min', pop:70, nw:false, pub:20260318,
      desc:'The experiments that need an adult nearby — water, heat, small parts. Moss will not start this one without a grown-up.',
      help:'observation and following steps safely.' },
    { id:'family-trivia', e:'❓', t:'Family Trivia', c:'e', ch:'Ember', cov:'e', m:'parent', tier:'free',
      topics:['thinking','play'], ag:[5,10], dur:'10–15 min', pop:0, nw:true, pub:20260904,
      desc:'Ember asks, everyone answers out loud. The grown-up guesses too — and is wrong often enough to be worth watching.',
      help:'general knowledge and taking turns.' },
    { id:'star-checkup', e:'⭐', t:'Daily Star Check-Up', c:'l', ch:'Luna', cov:'l', m:'parent', tier:'free',
      topics:['emotions','calm'], ag:[4,10], dur:'3–5 min', pop:0, nw:true, pub:20260904,
      desc:'A two-minute end-of-day look back with Luna, led by whoever is putting Eve to bed. The week builds into a star trail in this app.',
      help:'reflection and a shared close to the day.' },

    /* --- Circle Play v1 ----------------------------------------------------- */
    { id:'letter-word-round', e:'🔤', t:'Letter Word Round', c:'', ch:'Group', cov:'n', m:'group', tier:'free',
      topics:['thinking','social'], ag:[5,10], dur:'10 min', pop:0, nw:true, pub:20260904,
      desc:'A letter is called, and the children go round naming words that start with it. Neybo hosts blind — it does not know who is speaking.',
      help:'vocabulary and turn-taking.' },
    { id:'group-rhythm', e:'🥁', t:'Group Rhythm', c:'', ch:'Group', cov:'n', m:'group', tier:'free',
      topics:['music','social'], ag:[4,9], dur:'10 min', pop:0, nw:true, pub:20260904,
      desc:'Neybo claps a pattern, the group claps it back and adds to it. No scores, no names.',
      help:'listening and playing as one group.' },
    { id:'simon-says', e:'🙌', t:'Simon Says', c:'', ch:'Group', cov:'n', m:'group', tier:'free',
      topics:['play','social'], ag:[4,9], dur:'10 min', pop:0, nw:true, pub:20260904,
      desc:'The classic, hosted by the cube. Nobody is called out and nobody is counted.',
      help:'attention and impulse control.' },
    { id:'hot-potato', e:'🥔', t:'Hot Potato', c:'', ch:'Group', cov:'n', m:'group', tier:'free',
      topics:['play','social'], ag:[4,9], dur:'5–10 min', pop:0, nw:true, pub:20260904,
      desc:'Pass anything to hand while Neybo plays. When the music stops, the round starts again — that is all that happens.',
      help:'shared timing and letting go of winning.' },
    { id:'red-light', e:'🚦', t:'Red Light Green Light', c:'', ch:'Group', cov:'n', m:'group', tier:'free',
      topics:['play','social'], ag:[4,9], dur:'5–10 min', pop:0, nw:true, pub:20260904,
      desc:'Move on green, freeze on red. Neybo calls it out and never says who moved.',
      help:'listening and self-control.' },

    /* --- Linked Cubes v1 ---------------------------------------------------- */
    { id:'charades', e:'🎭', t:'Charades', c:'', ch:'Linked cubes', cov:'n', m:'group', tier:'neybo',
      topics:['play','social'], ag:[5,10], dur:'10–15 min', pop:0, nw:true, pub:20260904,
      desc:'Each child has their own cube. One acts, the others guess out loud on theirs.',
      help:'expression and reading other people.' },
    { id:'clue-quest', e:'🔍', t:'Clue Quest', c:'', ch:'Linked cubes', cov:'n', m:'group', tier:'neybo',
      topics:['thinking','social'], ag:[6,10], dur:'15–20 min', pop:0, nw:true, pub:20260904,
      desc:'Clues arrive on different cubes and only fit together when the children tell each other what they have.',
      help:'cooperation and putting information together.' }
  ];

  var R1_COVERS = {
    'gc-ember':          'assets/images/cover-gc-ember.png',
    'gc-moss':           'assets/images/cover-gc-moss.png',
    'gc-luna':           'assets/images/cover-gc-luna.png',
    'sound-lab':         'assets/images/cover-sound-lab.png',
    'paper-lab':         'assets/images/cover-paper-lab.png',
    'breathing':         'assets/images/cover-breathing.png',
    'gratitude':         'assets/images/cover-gratitude.png',
    'craft-studio':      'assets/images/cover-craft-studio.png',
    'family-trivia':     'assets/images/cover-family-trivia.png',
    'star-checkup':      'assets/images/cover-star-checkup.png',
    'letter-word-round': 'assets/images/cover-letter-word.png',
    'group-rhythm':      'assets/images/cover-group-rhythm.png',
    'simon-says':        'assets/images/cover-simon-says.png',
    'hot-potato':        'assets/images/cover-hot-potato.png',
    'red-light':         'assets/images/cover-red-light.png',
    'charades':          'assets/images/cover-charades.png',
    'clue-quest':        'assets/images/cover-clue-quest.png'
  };

  /* Activities that left release 1. Kept here as a list rather than deleted in
     silence, because two of them are currently sold inside Neybo+ and someone
     will ask what happened to them. */
  var RETIRED = {
    'role-play':           'removed from the roadmap — an open scene with no topic and no ending',
    'math-through-story':  'moved past release 1, returns post-launch',
    'big-question-debate': 'not part of Circle Play v1',
    'volcano-lab':         'replaced by the Guided Science Lab and the Paper Experiment Lab',
    'feelings-check-in':   "folded into Luna's Emotions conversation",
    'interactive-songs':   'merged with Karaoke into Songs & Karaoke',
    'circle-play':         'replaced by its five named games',
    'winter-tales-pack':   'seasonal pack, not in the methodology'
  };

  function patchCatalogue() {
    if (typeof window.ITEMS === 'undefined') return;
    ITEMS.length = 0;
    R1_ITEMS.forEach(function (x) { ITEMS.push(x); });
    Object.keys(R1_COVERS).forEach(function (k) { COVERS[k] = R1_COVERS[k]; });
    /* the merged and renamed ones keep the artwork they already had */
    COVERS['karaoke']         = COVERS['karaoke']         || 'assets/images/cover-karaoke.png';
    COVERS['kitchen-science'] = COVERS['kitchen-science'] || 'assets/images/cover-kitchen-science.png';
  }

  /* ------------------------------------------------------------------ wording
     Grown-Up Mode is a rename of what a parent reads, not of the mode key. The
     key stays "parent" everywhere in code, storage and analytics; if it were
     renamed, the cube, the bridge and every event already recorded would stop
     lining up. */

  var PHRASES = [
    [/Parent Mode/g,                'Grown-Up Mode'],
    [/Parent mode/g,                'Grown-Up mode'],
    [/parent mode/g,                'grown-up mode'],
    [/·\s*Parent(?![-\sA-Za-z])/g,  '· Grown-Up'],
    [/Story Forge/g,                'Collaborative Storytelling'],
    [/Kitchen Science/g,            'Guided Science Lab'],
    [/Interactive Songs/g,          'Songs & Karaoke'],
    /* release 1 has no streaks: marks reset every session, so the app should
       not celebrate runs it will not be keeping */
    [/—\s*her longest streak yet/g, '— more than in any month before'],
    [/First why-question streak/g,  'First run of why-questions'],
    [/longest streak/g,             'best week so far']
  ];

  var busy = false;
  function swapText(root) {
    if (busy) return;
    busy = true;
    try {
      var walk = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode: function (n) {
          var p = n.parentNode;
          if (!p) return NodeFilter.FILTER_REJECT;
          var tag = p.nodeName;
          if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'TEXTAREA') return NodeFilter.FILTER_REJECT;
          return n.nodeValue && n.nodeValue.length > 2 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
        }
      });
      var n, hits = [];
      while ((n = walk.nextNode())) hits.push(n);
      hits.forEach(function (node) {
        var before = node.nodeValue, after = before;
        for (var i = 0; i < PHRASES.length; i++) after = after.replace(PHRASES[i][0], PHRASES[i][1]);
        if (after !== before) node.nodeValue = after;
      });
      /* the filter chips render the bare mode name, which the phrase list
         cannot touch without also hitting "Parent app" */
      document.querySelectorAll('.fchipf, .lchip').forEach(function (el) {
        var t = el.firstChild;
        if (t && t.nodeType === 3 && t.nodeValue.trim() === 'Parent') t.nodeValue = 'Grown-Up';
      });
    } finally { busy = false; }
  }

  function patchLabels() {
    if (window.MODES && MODES.parent) {
      MODES.parent.title       = 'Grown-Up Mode';
      MODES.parent.subtitle    = 'An adult leads';
      MODES.parent.recommended = 'Recommended 4+';
      MODES.parent.desc        = 'Four activities a grown-up runs with the child: Craft Studio, the Guided Science Lab, Family Trivia and the Daily Star Check-Up. A parent authorises the mode; any trusted adult can lead the session.';
      MODES.parent.sheetSub    = 'An adult leads · co-play';
      MODES.parent.collection  = '4 activities · release 1';
    }
    if (window.FLT) {
      FLT.forEach(function (g) {
        if (g[1] !== 'mode') return;
        g[2].forEach(function (o) { if (o[0] === 'parent') o[1] = 'Grown-Up'; });
      });
    }
  }

  /* ------------------------------------------------------------------ screens */

  function el(html) {
    var d = document.createElement('div');
    d.innerHTML = html.trim();
    return d.firstChild;
  }

  function addScreen(key, tab, html) {
    var host = document.querySelector('.screen[data-s="modes"]');
    if (!host || document.querySelector('.screen[data-s="' + key + '"]')) return;
    var s = document.createElement('section');
    s.className = 'screen';
    s.setAttribute('data-s', key);
    s.setAttribute('data-r1', '1');
    s.innerHTML = html;
    host.parentNode.appendChild(s);
    if (window.TAB) TAB[key] = tab;
  }

  var BACK = function (to, label) {
    return '<div class="topback" onclick="go(\'' + to + '\')">' +
      '<svg class="tsvg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" ' +
      'stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg>' + label + '</div>';
  };

  /* Who is leading. The methodology is specific: a parent authorises the mode,
     but the person running the session can be a grandparent or a nanny — and
     never an older sibling. Whoever leads, an Emotional Bridge alert still goes
     to the parent account and nowhere else. */
  function screenWhoLeads() {
    addScreen('gu-who', 'modes',
      BACK('m-parent', 'Grown-Up Mode') +
      '<div class="h1">Who is leading today?</div>' +
      '<div class="subh">You stay the account holder either way</div>' +
      '<div class="card" id="r1WhoCard">' +
        '<div class="trow2" data-who="Parent"><div><div class="n">A parent</div>' +
          '<div class="d">You or Nick</div></div><span class="cbx on"></span></div>' +
        '<div class="divider"></div>' +
        '<div class="trow2" data-who="Grandparent"><div><div class="n">A grandparent</div>' +
          '<div class="d">Same activities, same limits</div></div><span class="cbx"></span></div>' +
        '<div class="divider"></div>' +
        '<div class="trow2" data-who="Nanny"><div><div class="n">A nanny or another trusted adult</div>' +
          '<div class="d">Access lasts for this session only</div></div><span class="cbx"></span></div>' +
      '</div>' +
      '<div class="card" style="background:var(--color-surface-raised,#faf7f1);box-shadow:none">' +
        '<div style="font-size:13.5px;line-height:1.55;color:var(--muted)">' +
        'An older brother or sister cannot lead a session. If Luna hears something that needs an adult, ' +
        'the notification goes to the parent account — never to whoever happened to be leading.</div>' +
      '</div>' +
      '<button class="btnbig y" onclick="go(\'m-parent\')">Save</button>');

    var card = document.getElementById('r1WhoCard');
    if (!card) return;
    card.addEventListener('click', function (e) {
      var row = e.target.closest ? e.target.closest('.trow2[data-who]') : null;
      if (!row) return;
      card.querySelectorAll('.cbx').forEach(function (b) { b.classList.remove('on'); });
      var box = row.querySelector('.cbx');
      if (box) box.classList.add('on');
      if (window.nbToast) nbToast(row.getAttribute('data-who') + ' is leading this session');
    });
  }

  /* Conversation limits. The Guided Conversation runs ten minutes by default,
     a parent can set five to twenty, there is a ceiling for the whole day, and
     each character can be switched off on its own. */
  function screenLimits() {
    var mins = [5, 10, 15, 20];
    addScreen('gc-limits', 'modes',
      BACK('modes', 'Play Modes') +
      '<div class="h1">Conversation limits</div>' +
      '<div class="subh">Guided Conversations only — games are not affected</div>' +
      '<div class="lbl">Length of one conversation</div>' +
      '<div class="card"><div class="frow" id="r1Mins">' +
        mins.map(function (m) {
          return '<span class="fchip' + (m === 10 ? ' on' : '') + '" data-min="' + m + '">' + m + ' min</span>';
        }).join('') +
      '</div><div style="font-size:13px;color:var(--muted);line-height:1.5;margin-top:10px">' +
      'Neybo says how long there is at the start, gives one warning before the end, and finishes the ' +
      'thought rather than cutting off.</div></div>' +
      '<div class="lbl">Most in one day</div>' +
      '<div class="card"><div class="frow" id="r1Cap">' +
        ['20 min', '30 min', '45 min', 'No cap'].map(function (m, i) {
          return '<span class="fchip' + (i === 1 ? ' on' : '') + '">' + m + '</span>';
        }).join('') +
      '</div></div>' +
      '<div class="lbl">Which conversations are on</div>' +
      '<div class="card">' +
        '<div class="trow2"><div><div class="n">Ember · Let’s Imagine</div>' +
          '<div class="d">Made-up situations, one per session</div></div>' +
          '<span class="cbx on" onclick="sw(this)"></span></div><div class="divider"></div>' +
        '<div class="trow2"><div><div class="n">Moss · Curiosity &amp; Exploration</div>' +
          '<div class="d">One question, followed properly</div></div>' +
          '<span class="cbx on" onclick="sw(this)"></span></div><div class="divider"></div>' +
        '<div class="trow2"><div><div class="n">Luna · Emotions</div>' +
          '<div class="d">Naming feelings, nothing kept secret</div></div>' +
          '<span class="cbx on" onclick="sw(this)"></span></div>' +
      '</div>' +
      '<div class="card" style="background:var(--color-surface-raised,#faf7f1);box-shadow:none">' +
        '<div style="font-size:13.5px;line-height:1.55;color:var(--muted)">' +
        'Eve always starts a conversation herself. Neybo never opens one, never suggests one in a quiet ' +
        'room, and never sends a notification asking her to come back.</div></div>' +
      '<button class="btnbig y" onclick="go(\'modes\');t(\'Limits saved\')">Save</button>');

    var row = document.getElementById('r1Mins');
    if (row) row.addEventListener('click', function (e) {
      var c = e.target.closest ? e.target.closest('.fchip') : null;
      if (!c) return;
      row.querySelectorAll('.fchip').forEach(function (x) { x.classList.remove('on'); });
      c.classList.add('on');
    });
    var cap = document.getElementById('r1Cap');
    if (cap) cap.addEventListener('click', function (e) {
      var c = e.target.closest ? e.target.closest('.fchip') : null;
      if (!c) return;
      cap.querySelectorAll('.fchip').forEach(function (x) { x.classList.remove('on'); });
      c.classList.add('on');
    });
  }

  /* ------------------------------------------------------------- in-place cards */

  /* A preset is a name, the running order, and how long it takes. Anything
     longer than that was a paragraph nobody reads on a phone. */
  var PRESETS = [
    ['Family Lab',     'Paper Lab → Logic Riddles',            '15 min'],
    ['Make Something', 'Paint With Words → Storytelling',      '20 min'],
    ['Wind-Down',      'Reading → Gratitude → Breathing',      '12 min']
  ];

  /* The permission rows on the mode screens describe the old catalogue. They
     are hand-written markup, so they are rewritten row by row rather than
     regenerated — the switches and their behaviour stay exactly as they were. */
  function rewriteRows(scr, rows, match) {
    var cards = scr.querySelectorAll('.card');
    for (var c = 0; c < cards.length; c++) {
      var list = cards[c].querySelectorAll('.trow2');
      if (list.length < rows.length) continue;
      if (!(match || /Talk with Neybo/).test(cards[c].textContent)) continue;
      for (var i = 0; i < rows.length && i < list.length; i++) {
        var n = list[i].querySelector('.n'), d = list[i].querySelector('.d');
        if (n) n.textContent = rows[i][0];
        if (d) d.textContent = rows[i][1];
      }
      return;
    }
  }

  var SOLO_ROWS = [
    ['Guided Conversations', 'Ember, Moss and Luna — one topic, ten minutes'],
    ['Games & activities',   'Riddles, Sound Lab, Paper Lab, Charging Break'],
    ['Stories & book reading', 'Storytelling, Paint With Words, Dress-Up, Book Reading'],
    ['Songs & karaoke',      'Fill-in songs and echo karaoke with Luna'],
    ['Calm & feelings',      'Breathing, Gratitude — Luna leads, nothing is kept secret']
  ];

  var PARENT_ROWS = [
    ['Craft Studio',        'Moss · make something real with what is in the house'],
    ['Guided Science Lab',  'Moss · needs an adult nearby, will not start without one'],
    ['Family Trivia',       'Ember · everyone answers out loud, grown-ups included'],
    ['Daily Star Check-Up', 'Luna · two minutes at the end of the day'],
    ['Talk with Neybo',     'Guided Conversations stay available while you are here']
  ];

  function decorateParentScreen() {
    var scr = document.querySelector('.screen[data-s="m-parent"]');
    if (!scr || scr.querySelector('[data-r1-who]')) return;
    var anchor = scr.querySelector('.subh');
    if (!anchor) return;
    anchor.textContent = 'An adult leads · four activities · Recommended 4+';
    rewriteRows(scr, PARENT_ROWS);
    scr.querySelectorAll('.lbl').forEach(function (l) {
      if (l.textContent.trim() === 'What Eve can do here') l.textContent = 'What this mode includes';
    });

    var who = el(
      '<div class="card" data-r1-who="1" style="cursor:pointer" onclick="go(\'gu-who\')">' +
        '<div class="trow2"><div><div class="n">Who is leading today?</div>' +
        '<div class="d"><span id="r1WhoNow">A parent</span> · tap to change</div></div>' +
        '<svg class="tsvg" style="color:var(--label);width:20px;height:20px" viewBox="0 0 24 24" fill="none" ' +
        'stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M9 6l6 6-6 6"/></svg></div></div>');
    anchor.parentNode.insertBefore(who, anchor.nextSibling);

    var presets = el(
      '<div data-r1-presets="1"><div class="lbl">Ready-made sessions</div><div class="card">' +
      PRESETS.map(function (p, i) {
        return (i ? '<div class="divider"></div>' : '') +
          '<div class="trow2"><div><div class="n">' + p[0] + '</div>' +
          '<div class="d">' + p[1] + ' &middot; ' + p[2] + '</div></div>' +
          '<button type="button" class="r1-pbtn">Start</button></div>';
      }).join('') + '</div></div>');

    var save = scr.querySelector('.btnbig');
    if (save) scr.insertBefore(presets, save); else scr.appendChild(presets);
  }

  function decorateSoloScreen() {
    var scr = document.querySelector('.screen[data-s="m-solo"]');
    if (!scr || scr.querySelector('[data-r1-limits]')) return;

    /* the gate copy is now about an unlock, not about a recommendation */
    scr.querySelectorAll('div').forEach(function (d) {
      if (d.children.length) return;
      var v = d.textContent;
      if (v.indexOf('Playing alone with an AI companion is off by default') === 0) {
        d.textContent = 'Solo play stays locked until you unlock it here. That is a deliberate choice, ' +
          'not a default: the cube will not enter Solo on its own, and every session has a limit and ' +
          'tells you when it ends.';
      }
      if (v === 'Guided Solo — a regulated gate') d.textContent = 'Solo needs your unlock';
    });
    rewriteRows(scr, SOLO_ROWS);

    var link = el(
      '<div data-r1-limits="1"><div class="lbl">Conversations</div>' +
      '<div class="card" style="cursor:pointer" onclick="go(\'gc-limits\')">' +
      '<div class="trow2"><div><div class="n">Conversation limits</div>' +
      '<div class="d">10 minutes each · 30 minutes a day</div></div>' +
      '<svg class="tsvg" style="color:var(--label);width:20px;height:20px" viewBox="0 0 24 24" fill="none" ' +
      'stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M9 6l6 6-6 6"/></svg></div></div></div>');
    var lbls = scr.querySelectorAll('.lbl');
    if (lbls.length) lbls[0].parentNode.insertBefore(link, lbls[0]);
    else scr.appendChild(link);
  }

  /* The five Circle Play games and the two Linked Cubes games, named on the
     screens where a parent decides what the group can do. */
  function decorateGroupScreens() {
    var pairs = [
      ['m-circle', 'Circle Play · release 1',
        ['Letter Word Round', 'Group Rhythm', 'Simon Says', 'Hot Potato', 'Red Light Green Light'],
        'Neybo hosts without knowing who is speaking. No names are collected, nobody is counted, and no visitor profile is created.'],
      ['m-linked', 'Linked cubes · release 1',
        ['Charades', 'Clue Quest'],
        'Each child plays on their own cube. The cubes share the game, not the children.']
    ];
    pairs.forEach(function (p) {
      var scr = document.querySelector('.screen[data-s="' + p[0] + '"]');
      if (!scr || scr.querySelector('[data-r1-games]')) return;
      var block = el(
        '<div data-r1-games="1"><div class="lbl">' + p[1] + '</div><div class="card">' +
        p[2].map(function (g, i) {
          return (i ? '<div class="divider"></div>' : '') +
            '<div class="trow2"><div><div class="n">' + g + '</div></div>' +
            '<span class="cbx on" onclick="sw(this)"></span></div>';
        }).join('') +
        '<div style="font-size:13px;color:var(--muted);line-height:1.5;margin-top:10px">' + p[3] + '</div>' +
        '</div></div>');
      var back = scr.querySelector('.topback');
      var sub = scr.querySelector('.subh') || scr.querySelector('.h1') || back;
      sub.parentNode.insertBefore(block, sub.nextSibling);

      /* the permission card underneath still described the old catalogue */
      rewriteRows(scr, [
        ['Group games',        'The release-1 set above'],
        ['Songs & rhythm',     'Group Rhythm with Luna'],
        ['Stories together',   'Ember reads to the whole circle'],
        ['Questions & learning', 'Ask, explore, discover as a group']
      ], /Games & activities/);
      scr.querySelectorAll('.lbl').forEach(function (l) {
        if (/What kids can do here/i.test(l.textContent)) l.textContent = 'What the cube may do here';
      });
    });
  }

  /* A week of Daily Star Check-Ups. Marks reset every session on the cube; the
     trail here is the parent's record of the ritual happening, not a score. */
  function decorateInsights() {
    var scr = document.querySelector('.screen[data-s="insights"]');
    if (!scr || scr.querySelector('[data-r1-stars]')) return;
    var days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    var got  = [1, 1, 0, 1, 1, 1, 0];
    var block = el(
      '<div data-r1-stars="1"><div class="lbl">Star trail</div><div class="card">' +
      '<div style="display:flex;gap:10px;justify-content:space-between;align-items:flex-end">' +
      days.map(function (d, i) {
        return '<div style="text-align:center;flex:1">' +
          '<div style="font-size:22px;line-height:1;opacity:' + (got[i] ? '1' : '.22') + '">⭐</div>' +
          '<div style="font-size:11px;color:var(--muted);margin-top:6px">' + d + '</div></div>';
      }).join('') + '</div>' +
      '<div style="font-size:13px;color:var(--muted);line-height:1.5;margin-top:12px">' +
      'Five check-ups this week with Luna. A star means the ritual happened, not how the day went — ' +
      'there is nothing here to keep up.</div></div></div>');
    var seg = document.getElementById('insPeriod');
    var anchor = (seg && seg.parentNode === scr) ? seg
               : (seg ? seg.closest('.screen[data-s="insights"] > *') : null);
    if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(block, anchor.nextSibling);
    else scr.insertBefore(block, scr.firstChild);
  }

  /* The Emotional Bridge alert is not shipping until the expert and legal
     review is done. The screen stays, so it has to say so. */
  function decorateSafetyAlert() {
    var scr = document.querySelector('.screen[data-s="n-safety"]');
    if (!scr || scr.querySelector('[data-r1-bridge]')) return;
    var note = el(
      '<div class="card" data-r1-bridge="1" style="background:#fdf6e6;border:1.5px solid #d8c48a;box-shadow:none">' +
      '<div style="font-size:13.5px;line-height:1.55;color:#6a5f3a">' +
      '<b style="color:#2c2a24">Not live yet.</b> Alerts like this go only to the parent account, never to a ' +
      'grandparent or nanny who led the session — and none are sent at all until the expert and legal review ' +
      'is finished.</div></div>');
    scr.appendChild(note);
  }

  /* ---------------------------------------------------------------------- css
     The overlay adds exactly one control the app did not already have — the
     preset Start button — so it carries exactly one rule set, written in the
     app's own tokens so it follows the light and dark themes. */

  function styles() {
    if (document.getElementById('r1-style')) return;
    var s = document.createElement('style');
    s.id = 'r1-style';
    s.textContent =
      '.r1-pbtn{flex:0 0 auto;margin-left:14px;padding:9px 18px;border:0;border-radius:999px;' +
      'background:var(--yellow);color:#2c2a24;font:600 13.5px/1 inherit;letter-spacing:.01em;' +
      'cursor:pointer;transition:transform .12s ease,background .15s ease,color .15s ease}' +
      '.r1-pbtn:active{transform:scale(.96)}' +
      '.r1-pbtn.on{background:transparent;box-shadow:inset 0 0 0 1.5px var(--line);' +
      'color:var(--muted);font-weight:500}';
    document.head.appendChild(s);
  }

  /* ---------------------------------------------------------------------- boot */

  function apply() {
    patchCatalogue();
    patchLabels();
    screenWhoLeads();
    screenLimits();
    decorateParentScreen();
    decorateSoloScreen();
    decorateGroupScreens();
    decorateInsights();
    decorateSafetyAlert();
    swapText(document.body);
    styles();

    if (window.renderLib) try { renderLib(); } catch (e) {}
    if (window.renderModeCard) try { renderModeCard(); } catch (e) {}
    if (window.applyTier) try { applyTier(); } catch (e) {}

    /* Most of the app renders its text from JavaScript when a screen opens, so
       one pass at boot is not enough — the wording has to be re-applied to
       whatever was just written. */
    var pending = null;
    var host = document.getElementById('phone') || document.body;
    new MutationObserver(function () {
      if (busy || pending) return;
      pending = setTimeout(function () { pending = null; swapText(host); }, 60);
    }).observe(host, { childList: true, subtree: true, characterData: true });

    window.NeyboR1 = { items: R1_ITEMS, retired: RETIRED, refresh: function () { swapText(host); } };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply);
  else apply();
})();


/* ---------------------------------------------------------------------------
   Second pass — the solo game scripts, August 2026.

   The methodology said what release 1 contains. The scripts say how each
   activity actually behaves: the age bands children are really split into,
   how long a session runs in each, and — the part no screen showed until now
   — what Neybo keeps afterwards and what it throws away.

   Where the two documents disagree the methodology wins, so Sound Lab keeps
   its honest-confidence rounds and Charging Break keeps the routine the child
   assembles. Everything here is the part they agree on.

   Same rule as the first pass: nothing renames anything, and it is all inert
   without ?r1=1.
--------------------------------------------------------------------------- */
(function () {
  'use strict';

  if (!/(^|[?&])r1=1(&|$)/.test(location.search)) return;

  /* ------------------------------------------------------------- age bands
     The scripts use 4–6 / 6–8 / 8–10 throughout, with a different wait time,
     choice shape and session length in each. The app was filtering by
     4-5 / 6-8 / 9+, and the middle chip was mislabelled "Ages 4–6". */

  var BANDS = {
    '4-6':  { range: [4, 6],  label: 'Ages 4–6',  wait: '8s + 4s', session: '4–7 min',
              choice: 'Two named options — one word is enough' },
    '6-8':  { range: [6, 8],  label: 'Ages 6–8',  wait: '6s + 4s', session: '7–11 min',
              choice: 'Open question first, two options if stuck' },
    '8-10': { range: [8, 10], label: 'Ages 8–10', wait: '5s + 3s', session: '10–15 min',
              choice: 'Open, and one harder follow-up is allowed' }
  };

  function bandOf(age) {
    if (age <= 6) return '4-6';
    if (age <= 8) return '6-8';
    return '8-10';
  }

  /* The shipped filter reads its band table from a literal inside the
     function, so the whole predicate is replaced rather than patched. Same
     logic, new bands. */
  window.matchesFilterSet = function (x, f) {
    if (f.char !== 'all' && x.c !== f.char) return false;
    if (f.mode !== 'all' && x.m !== f.mode) return false;
    if (f.access !== 'all' && x.tier !== f.access) return false;
    if (f.age !== 'all') {
      var b = BANDS[f.age];
      if (!b) return true;
      if (!window.ageOverlap(x, b.range[0], b.range[1])) return false;
    }
    return true;
  };

  /* chips() also carried its own label table, and would have printed
     "undefined" for a band it had never heard of. */
  window.chips = function () {
    var LB = {
      char:   { e: 'Ember', m: 'Moss', l: 'Luna' },
      mode:   { solo: 'Solo', parent: 'Grown-Up', group: 'Group' },
      access: { free: 'Free', neybo: 'Neybo+', family: 'Family+' }
    };
    var out = '';
    ['char', 'mode', 'access', 'age'].forEach(function (k) {
      if (window.APP[k] === 'all') return;
      var label = (k === 'age') ? (BANDS[APP.age] ? BANDS[APP.age].label : APP.age) : LB[k][APP[k]];
      out += '<span class="lchip" onclick="removeChip(\'' + k + '\')">' + label +
             '<span class="x">✕</span></span>';
    });
    return out ? '<div class="lchips">' + out + '</div>' : '';
  };

  if (window.FLT) {
    FLT.forEach(function (g) {
      if (g[1] !== 'age') return;
      g[2] = [['all', 'All'], ['4-6', '4–6'], ['6-8', '6–8'], ['8-10', '8–10']];
    });
  }

  /* --------------------------------------------------------------- memory
     Every script section ends with a memory rule, and they are not the same
     rule. A parent screen that says "we keep some things" where the spec says
     "book id, pause point, finished flag, date — discard the audio" is the
     screen doing less than the product. */

  var KEEPS = {
    'gc-ember':   'Topic tags for this sitting and the date. No audio, no transcript.',
    'gc-moss':    'Topic tags for this sitting and the date. No audio, no transcript.',
    'gc-luna':    'A topic tag such as "sad about school", and the date. Never the words, never anything kept as a confidence.',
    'story-forge':'The story itself, and only if Eve says yes when Ember asks to keep it.',
    'book-reading':'Which book, where she stopped, whether it was finished, and the date. The audio is discarded.',
    'paint-with-words':'The picture’s name, if she keeps it. Nothing else.',
    'dress-up':   'How many sessions, and when.',
    'sound-lab':  'Session count and date. No audio Eve makes is ever recorded, and no sound is generated.',
    'paper-lab':  'Session count. The drawing stays with Eve.',
    'logic-riddles':'Session count and date — no score. A riddle she engaged with is a riddle won.',
    'charging-break':'How many dances, and when. No form notes, no score, no video.',
    'breathing':  'Session count and date.',
    'gratitude':  'One good thing a day, stored as a date and a tag. Never the sentence.',
    'karaoke':    'Session count and date. Her singing is not recorded.',
    'craft-studio':'Which activity, and how long.',
    'kitchen-science':'Which experiment, and how long.',
    'family-trivia':'Which activity, and how long.',
    'star-checkup':'One mark a day for the week’s trail. A mark says the ritual happened, not how the day went.',
    '_group':     'Nothing about any individual child. No names, no headcount, no visitor profiles.'
  };

  var LISTEN = 'While the book is playing Eve can say <b>pause</b>, <b>go</b>, <b>slower</b> or ' +
               '<b>I’m done</b>. Ember asks nothing mid-book and never checks whether she is ' +
               'still there — if she goes quiet, he keeps reading to the end.';

  var _detailHTML = window.detailHTML;
  if (typeof _detailHTML === 'function') {
    window.detailHTML = function (x) {
      var html = _detailHTML(x);
      var keep = KEEPS[x.id] || (x.m === 'group' ? KEEPS._group : null);
      if (!keep) return html;
      var band = BANDS[bandOf(window.EVE_AGE || 7)];
      var extra =
        '<div class="lbl" style="margin-top:14px">What Neybo keeps</div>' +
        '<div class="card" style="box-shadow:none">' +
          '<div style="font-size:13.5px;line-height:1.55;color:var(--muted)">' + keep + '</div>' +
          (x.id === 'book-reading'
            ? '<div class="divider"></div><div style="font-size:13.5px;line-height:1.55;color:var(--muted)">' + LISTEN + '</div>'
            : '') +
          '<div class="divider"></div>' +
          '<div style="font-size:13px;line-height:1.5;color:var(--muted)">' +
          'At ' + band.label.toLowerCase() + ' Neybo waits ' + band.wait + ' before offering help, ' +
          'and a session runs ' + band.session + '. ' + band.choice + '.</div>' +
        '</div>';
      return html + extra;
    };
  }

  /* ------------------------------------------------------- limits, by band
     The conversation clock is a parent setting, but the scripts recommend a
     different length per band, so the screen should say which one it is
     recommending rather than offering four equal-looking chips. */

  function bandCard() {
    var scr = document.querySelector('.screen[data-s="gc-limits"]');
    if (!scr || scr.querySelector('[data-r1-band]')) return;
    var d = document.createElement('div');
    d.setAttribute('data-r1-band', '1');
    var rows = Object.keys(BANDS).map(function (k) {
      var b = BANDS[k], now = (k === bandOf(window.EVE_AGE || 7));
      return '<div class="trow2"' + (now ? ' style="background:rgba(193,138,0,.07);border-radius:10px;padding:8px 10px;margin:0 -10px"' : '') + '>' +
        '<div><div class="n">' + b.label + (now ? ' · Eve' : '') + '</div>' +
        '<div class="d">Waits ' + b.wait + ' before offering help</div></div>' +
        '<div style="font-size:14px;font-weight:600;color:var(--ink);white-space:nowrap">' + b.session + '</div></div>';
    }).join('<div class="divider"></div>');
    d.innerHTML = '<div class="lbl">Recommended by age</div><div class="card">' + rows +
      '<div style="font-size:13px;color:var(--muted);line-height:1.5;margin-top:10px">' +
      'Younger children need a longer pause and a shorter session. Neybo never fills the silence ' +
      'with chatter — it waits, offers one breath cue, then two choices, and only then takes a turn ' +
      'itself.</div></div>';
    var save = scr.querySelector('.btnbig');
    if (save) scr.insertBefore(d, save); else scr.appendChild(d);
  }

  /* ------------------------------------------------------------- albums
     Two things a child makes that belong to her rather than to a session:
     the stories she kept, and the good thing from each day. The scripts keep
     them apart from the book library on purpose. */

  var STORIES = [
    ['Jam-Door Country', 'Made with Ember · 4 Sep', 'The bell tasted of strawberry when it rang.'],
    ['The Sock That Went North', 'Made with Ember · 1 Sep', 'It left a note. The note was also a sock.'],
    ['Pancake Rocket', 'Made with Ember · 28 Aug', 'Fuel: syrup. Crew: two fireflies.']
  ];
  var GRATITUDE = [
    ['8 Sep', 'something she made'], ['7 Sep', 'someone kind'], ['5 Sep', 'something she ate'],
    ['4 Sep', 'a place she went'], ['3 Sep', 'something she made']
  ];

  function albumScreens() {
    var host = document.querySelector('.screen[data-s="library"]');
    if (!host || document.querySelector('.screen[data-s="lib-created"]')) return;

    function add(key, html) {
      var s = document.createElement('section');
      s.className = 'screen';
      s.setAttribute('data-s', key);
      s.setAttribute('data-r1', '1');
      s.innerHTML = html;
      host.parentNode.appendChild(s);
      if (window.TAB) TAB[key] = 'library';
    }
    var back = '<div class="topback" onclick="go(\'library\')">' +
      '<svg class="tsvg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" ' +
      'stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg>Library</div>';

    add('lib-created', back +
      '<div class="h1">Created Stories</div>' +
      '<div class="subh">Hers, not Neybo’s · kept only when she says yes</div>' +
      '<div class="card">' + STORIES.map(function (s, i) {
        return (i ? '<div class="divider"></div>' : '') +
          '<div class="trow2"><div><div class="n">' + s[0] + '</div>' +
          '<div class="d">' + s[1] + '</div>' +
          '<div class="d" style="margin-top:3px">' + s[2] + '</div></div></div>';
      }).join('') + '</div>' +
      '<div class="card" style="box-shadow:none"><div style="font-size:13.5px;line-height:1.55;color:var(--muted)">' +
      'Ember asks at the end: shall I keep this? Nothing lands here without that yes. This album is ' +
      'separate from the twenty books he reads — those are his, these are hers.</div></div>');

    add('lib-gratitude', back +
      '<div class="h1">Good things</div>' +
      '<div class="subh">One a day, from the check-up with Luna</div>' +
      '<div class="card">' + GRATITUDE.map(function (g, i) {
        return (i ? '<div class="divider"></div>' : '') +
          '<div class="trow2"><div><div class="n">' + g[0] + '</div>' +
          '<div class="d">' + g[1] + '</div></div><span style="font-size:18px">⭐</span></div>';
      }).join('') + '</div>' +
      '<div class="card" style="box-shadow:none"><div style="font-size:13.5px;line-height:1.55;color:var(--muted)">' +
      'Only the date and a tag are stored — never what Eve actually said. If you want to know what ' +
      'the good thing was, the answer is to ask her.</div></div>');
  }

  function albumStrip() {
    var scr = document.querySelector('.screen[data-s="library"]');
    if (!scr || scr.querySelector('[data-r1-albums]')) return;
    var d = document.createElement('div');
    d.setAttribute('data-r1-albums', '1');
    d.innerHTML =
      '<div class="lbl">Eve’s own</div><div class="card" style="padding:0;overflow:hidden">' +
      '<div class="trow2" style="cursor:pointer;padding:13px 15px" onclick="go(\'lib-created\')">' +
        '<div style="display:flex;gap:11px;align-items:center"><span style="font-size:21px">📜</span>' +
        '<div><div class="n">Created Stories</div><div class="d">' + STORIES.length + ' kept</div></div></div>' +
        '<svg class="tsvg" style="color:var(--label);width:20px;height:20px" viewBox="0 0 24 24" fill="none" ' +
        'stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M9 6l6 6-6 6"/></svg></div>' +
      '<div class="divider"></div>' +
      '<div class="trow2" style="cursor:pointer;padding:13px 15px" onclick="go(\'lib-gratitude\')">' +
        '<div style="display:flex;gap:11px;align-items:center"><span style="font-size:21px">⭐</span>' +
        '<div><div class="n">Good things</div><div class="d">' + GRATITUDE.length + ' this week</div></div></div>' +
        '<svg class="tsvg" style="color:var(--label);width:20px;height:20px" viewBox="0 0 24 24" fill="none" ' +
        'stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M9 6l6 6-6 6"/></svg></div></div>';
    var body = document.getElementById('libBody');
    if (body) scr.insertBefore(d, body); else scr.appendChild(d);
  }

  /* ------------------------------------------------- the grown-up lab signal
     When a child asks to do the experiment for real, Moss does not refuse and
     does not comply: he offers to tell a grown-up. That offer has to arrive
     somewhere, and this is where. */

  function labSignal() {
    var scr = document.querySelector('.screen[data-s="notifications"]');
    if (!scr || scr.querySelector('[data-r1-lab]')) return;
    var d = document.createElement('div');
    d.setAttribute('data-r1-lab', '1');
    d.innerHTML =
      '<div class="lbl">From Neybo today</div>' +
      '<div class="card" style="border:1.5px solid #d8c48a;background:#fdf6e6;box-shadow:none">' +
      '<div style="font-weight:600;color:#2c2a24">Eve asked to do the melting-ice lab for real</div>' +
      '<div style="font-size:13.5px;color:#6a5f3a;line-height:1.55;margin-top:5px">' +
      'Moss kept it on paper and offered to pass it on. The version with real ice and salt lives in ' +
      'Grown-Up Mode as the Guided Science Lab — it needs an adult in the room.</div>' +
      '<button class="medit" style="margin-top:11px" onclick="go(\'m-parent\')">Open Grown-Up Mode</button>' +
      '</div>';
    var anchor = scr.querySelector('.lbl') || scr.querySelector('.h1');
    if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(d, anchor);
    else scr.appendChild(d);
  }

  /* ------------------------------------------------------------ real counts
     The scripts specify the size of every library. A card that says "around
     twenty books" when the spec says twenty, or "experiments" when there are
     ten named ones, is throwing away the only detail a parent can check. */

  var COUNTS = {
    'story-forge':     ['Ten story shapes Ember can open with — a moon door, a sock that wants wind, a dragon who forgot how to roar. Eve picks the hero, the twist and the ending, and it is saved to Created Stories only if she says yes.', 'imagination, vocabulary and story structure.'],
    'paint-with-words':['Twenty Hollowbrook pictures — ten simple ones for the younger band and ten full scenes. Eve names a colour, Ember paints it back and adds exactly one piece of magic, then asks about the next part.', 'descriptive language and creativity.'],
    'dress-up':        ['Ten items in the closet, and each one changes Ember’s voice: the scarf makes him an explorer, the tiny crown a kind ruler with one royal decree. Ends with a fashion show.', 'self-expression and pretend play.'],
    'book-reading':    ['Twenty books — fourteen Hollowbrook originals and six retold from the public domain. Ember offers three at a time with their length, reads the whole thing without interrupting, and remembers the ribbon.', 'reading confidence and listening.'],
    'sound-lab':       ['Eve names a sound, Moss plays a matching one from his library. No generation, no child audio — and if she asks whether it is real, he gives one short honest answer and plays the next clip.', 'noticing sounds and learning to name them.'],
    'paper-lab':       ['Ten labs that need nothing but paper — melting ice, sink or float, shadow length, seed growth, colour mixing and five more. Eve predicts, Moss runs it in words, then she says what happened.', 'prediction, observation and following steps.'],
    'logic-riddles':   ['Twenty riddles, each with exactly three hints in order. A wrong guess gets "not quite, want the next hint?" and nothing is scored. If the third hint is not enough, Moss gives the answer warmly.', 'logic and problem-solving.'],
    'karaoke':         ['Hollowbrook songs only — no radio, no Disney. Luna sings and Eve joins in, or Eve leads and Luna follows. Nothing is scored; afterwards Luna names one word she caught.', 'rhythm, memory and confidence.'],
    'breathing':       ['Three tools: the slow belly breath, the box of four counts, and wind-out. Luna counts one whole round without asking anything in the middle, then asks how the body feels.', 'self-regulation.'],
    'gratitude':       ['One good thing from the day — big, small or silly. Luna asks for one detail, then stops. Only the date and a tag are kept, never the sentence.', 'noticing and putting words to good moments.'],
    'charging-break':  ['Dances Moss already knows and shows — eight moves over four rounds while the energy meter fills. He counts in real time rather than waiting for a reply, and pauses to ask whether to keep dancing or rest.', 'moving, rhythm and body awareness.']
  };

  function realCounts() {
    if (!window.ITEMS) return;
    ITEMS.forEach(function (x) {
      var c = COUNTS[x.id];
      if (!c) return;
      x.desc = c[0];
      x.help = c[1];
    });
  }

  /* ----------------------------------------------------------- theme lock
     Each conversation has a house, and one off-theme beat gets handed to
     whoever owns the subject. A parent reading the card should know that
     before it happens on the cube. */

  var HOUSES = {
    'gc-ember': 'Ember’s house is stories, books, imagination and making things. A question about why the sky is blue goes to Moss; a hard feeling goes to Luna.',
    'gc-moss':  'Moss’s house is why things work, places, counting, riddles and moving. A story goes to Ember; a hard feeling goes to Luna. Real homework goes to you.',
    'gc-luna':  'Luna’s house is feelings, the day and gratitude. She does not take Moss’s questions or Ember’s stories, and anything heavy goes to a trusted grown-up rather than to another character.'
  };

  var _detail2 = window.detailHTML;
  if (typeof _detail2 === 'function') {
    window.detailHTML = function (x) {
      var html = _detail2(x);
      if (!HOUSES[x.id]) return html;
      return html +
        '<div class="lbl" style="margin-top:14px">Where it stops</div>' +
        '<div class="card" style="box-shadow:none"><div style="font-size:13.5px;line-height:1.55;color:var(--muted)">' +
        HOUSES[x.id] + '</div></div>';
    };
  }

  /* ---------------------------------------------------------------- boot */

  function apply2() {
    realCounts();
    bandCard();
    albumScreens();
    albumStrip();
    labSignal();
    if (window.renderLib) try { renderLib(); } catch (e) {}
    if (window.renderFilterSheet) try { renderFilterSheet(); } catch (e) {}
    if (window.NeyboR1) NeyboR1.bands = BANDS;
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply2);
  else setTimeout(apply2, 0);
})();


/* ---------------------------------------------------------------------------
   Third pass — the script index, 8 September 2026.

   The beat scripts were re-aligned to the methodology and now carry a status
   label on every activity: whether it is cached, bounded, open, local, or a
   speaking mode. Those labels are the difference between what can ship in
   release 1 and what is still being written, so a parent-facing catalogue
   that hides them is hiding the only checkable thing about each activity.

   This pass also corrected two activities the earlier build had backwards.
   Sound Lab is a library match, not a game where the child teaches Moss and
   he answers with a confidence figure; Charging Break is a dance Moss already
   knows and shows, which the child copies and never assembles.
--------------------------------------------------------------------------- */
(function () {
  'use strict';

  if (!/(^|[?&])r1=1(&|$)/.test(location.search)) return;

  var HOW = {
    'gc-ember':         'Speaking mode · stories, books, imagine, make',
    'story-forge':      'Open AI · hybrid voice',
    'paint-with-words': 'Bounded AI · modular TTS',
    'dress-up':         'Local assets · cached lines',
    'book-reading':     'Bedtime · whole book',
    'gc-moss':          'Speaking mode · travel, why, math, riddles, move',
    'sound-lab':        'Release 1 · library match, no child audio',
    'paper-lab':        'Bounded AI · pencil only',
    'logic-riddles':    'Library · three hints',
    'charging-break':   'Cached · Moss-led dances',
    'gc-luna':          'Speaking mode · feeling words',
    'breathing':        'Child chooses the tool',
    'gratitude':        'One good thing',
    'karaoke':          'Interactive Songs and Karaoke Mode, merged',
    'craft-studio':     'Moss · the adult hands over the scissors',
    'kitchen-science':  'Release 1 · Moss',
    'family-trivia':    'Ember · the grown-up plays with a declared handicap',
    'star-checkup':     'Release 1 · Luna',
    'letter-word-round':'Circle · group word bank',
    'group-rhythm':     'Circle · one shared beat',
    'simon-says':       'Circle · caller only',
    'hot-potato':       'Circle · music and stop',
    'red-light':        'Circle · refereed by the kids',
    'charades':         'Linked · a private picture on each cube',
    'clue-quest':       'Linked · a private clue on each cube'
  };

  /* Two activities have a label but no beat script yet. Saying so is more
     useful to a tester than a screen that pretends the flow is settled. */
  var PENDING = {
    'sound-lab': 'The beat script for this one is still being written — the label is fixed, the turns are not.'
  };

  var _detail = window.detailHTML;
  if (typeof _detail !== 'function') return;

  window.detailHTML = function (x) {
    var html = _detail(x);
    var how = HOW[x.id];
    if (!how) return html;
    return html +
      '<div class="lbl" style="margin-top:14px">How it runs</div>' +
      '<div class="card" style="box-shadow:none">' +
        '<div style="font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12.5px;' +
        'letter-spacing:.02em;color:var(--ink)">' + how + '</div>' +
        (PENDING[x.id]
          ? '<div class="divider"></div><div style="font-size:13px;line-height:1.5;color:var(--muted)">' +
            PENDING[x.id] + '</div>'
          : '') +
      '</div>';
  };
})();


/* ---------------------------------------------------------------------------
   Fourth pass — making three things real rather than described.

   The age band was a filter and a label; now it is a control that changes
   what the library recommends, what each activity allows, and which
   conversation length the app suggests. The book library was a number in a
   sentence; now it is twenty titles with their length and their band. The
   three Grown-Up presets had a Start button that only toasted; now they queue
   a session and say what the cube will do first.
--------------------------------------------------------------------------- */
(function () {
  'use strict';

  if (!/(^|[?&])r1=1(&|$)/.test(location.search)) return;

  var BAND_MID = { '4-6': 5, '6-8': 7, '8-10': 9 };
  var BAND_META = {
    '4-6':  { label: 'Ages 4–6',  wait: '8s + 4s', session: '4–7 min',
              allow: 'Three labs, two riddles, two sounds in one sitting.',
              choice: 'Two named options — one word is enough' },
    '6-8':  { label: 'Ages 6–8',  wait: '6s + 4s', session: '7–11 min',
              allow: 'Five labs, three riddles, the full sound list.',
              choice: 'Open question first, two options if stuck' },
    '8-10': { label: 'Ages 8–10', wait: '5s + 3s', session: '10–15 min',
              allow: 'Every lab, three riddles at least, and one harder follow-up.',
              choice: 'Open, and one harder follow-up is allowed' }
  };
  var GC_SUGGEST = { '4-6': 5, '6-8': 10, '8-10': 15 };

  function bandNow() {
    var a = window.EVE_AGE || 7;
    return a <= 6 ? '4-6' : a <= 8 ? '6-8' : '8-10';
  }

  /* ---------------------------------------------------------- band switcher
     Changing the band moves Eve's age, which is what the library's own
     recommendation scoring already reads — so the picks, the allowances and
     the suggested conversation length all move together instead of the band
     being a caption. */

  /* How much the band is offered at once. The scripts cap a sitting rather
     than the whole catalogue — three labs for the youngest, five in the
     middle, all of them at the top — so the picks list is trimmed to match
     instead of the band only reordering it. */
  var BAND_PICKS = { '4-6': 12, '6-8': 18, '8-10': 99 };

  function cards_total() {
    try { return ITEMS.filter(matchesApplied).length; } catch (e) { return 0; }
  }

  function trimPicks() {
    var b = bandNow(), cap = BAND_PICKS[b] || 99;
    var heads = document.querySelectorAll('#libBody .libhead');
    var head = null;
    heads.forEach(function (h) {
      var t = h.querySelector('.lh-t');
      if (t && /Picked for/.test(t.textContent)) head = h;
    });
    if (!head) return;
    var grid = head.parentNode.querySelectorAll('.libgrid');
    grid = grid[grid.length - 1];
    if (!grid) return;
    /* the total is taken from the catalogue, not from the grid, so a second
       pass over an already-trimmed list still reports honestly */
    var total = cards_total();
    var cards = grid.querySelectorAll('.libcard');
    for (var i = cap; i < cards.length; i++) cards[i].remove();
    var shown = Math.min(cap, total);
    var count = head.querySelector('.libcount');
    if (count) count.textContent = (cap < total) ? shown + ' of ' + total : shown + ' results';
    var sub = head.querySelector('.lh-s');
    if (sub) {
      sub.textContent = (cap < total)
        ? 'Narrowed to what ' + BAND_META[b].label.toLowerCase() + ' is offered at once'
        : 'Based on her age, interests, and play mode';
    }
  }

  function setBand(b) {
    window.EVE_AGE = BAND_MID[b] || 7;
    /* the strip and the filter sheet are one control, so they must agree */
    try { if (window.APP && APP.age !== 'all') APP.age = b; } catch (e) {}
    var sub = document.getElementById('headSub');
    if (sub) sub.textContent = BAND_META[b].label;
    if (window.renderLib) try { renderLib(); } catch (e) {}
    trimPicks();
    paintBandStrip();
    paintLimits();
    if (window.nbToast) nbToast(BAND_META[b].label + ' · ' + BAND_META[b].session + ' a session');
  }

  function bandStripHTML() {
    var now = bandNow();
    return '<div class="lbl">Eve’s band</div>' +
      '<div class="card" style="box-shadow:none">' +
      '<div class="frow" id="r1BandRow">' +
        Object.keys(BAND_META).map(function (b) {
          return '<span class="fchip' + (b === now ? ' on' : '') + '" data-band="' + b + '">' +
                 BAND_META[b].label.replace('Ages ', '') + '</span>';
        }).join('') +
      '</div>' +
      '<div style="font-size:13px;color:var(--muted);line-height:1.5;margin-top:9px">' +
        BAND_META[now].allow + ' Neybo waits ' + BAND_META[now].wait +
        ' before offering help, and a session runs ' + BAND_META[now].session + '.' +
      '</div></div>';
  }

  function paintBandStrip() {
    var host = document.querySelector('[data-r1-band-strip]');
    if (!host) return;
    host.innerHTML = bandStripHTML();
    var row = document.getElementById('r1BandRow');
    if (row) row.addEventListener('click', function (e) {
      var c = e.target.closest ? e.target.closest('.fchip[data-band]') : null;
      if (c) setBand(c.getAttribute('data-band'));
    });
  }

  function mountBandStrip() {
    var scr = document.querySelector('.screen[data-s="library"]');
    if (!scr || scr.querySelector('[data-r1-band-strip]')) return;
    var d = document.createElement('div');
    d.setAttribute('data-r1-band-strip', '1');
    var albums = scr.querySelector('[data-r1-albums]');
    if (albums) albums.parentNode.insertBefore(d, albums);
    else {
      var body = document.getElementById('libBody');
      if (body) scr.insertBefore(d, body); else scr.appendChild(d);
    }
    paintBandStrip();
  }

  /* the limits screen recommends the band's length rather than four equal chips */
  function paintLimits() {
    var b = bandNow();
    var row = document.getElementById('r1Mins');
    if (row) {
      row.querySelectorAll('.fchip').forEach(function (c) {
        var m = parseInt(c.getAttribute('data-min'), 10);
        c.classList.toggle('on', m === GC_SUGGEST[b]);
      });
    }
    document.querySelectorAll('[data-r1-band] .trow2').forEach(function (r) {
      var mine = r.textContent.indexOf(BAND_META[b].label) === 0;
      r.style.background = mine ? 'rgba(193,138,0,.07)' : '';
      r.style.borderRadius = mine ? '10px' : '';
      r.style.padding = mine ? '8px 10px' : '';
      r.style.margin = mine ? '0 -10px' : '';
      var n = r.querySelector('.n');
      if (n) n.textContent = n.textContent.replace(' · Eve', '') + (mine ? ' · Eve' : '');
    });
  }

  /* ------------------------------------------------------------ book library
     Twenty titles, fourteen of them Hollowbrook originals and six retold from
     the public domain. Ember offers three at a time with their length — the
     screen exists so a parent can see the whole shelf, not so the child can
     scroll it. */

  var BOOKS = [
    ['Ember and the Moon Door',      'original', 10, '4–6', 'finished'],
    ['The Sock That Wanted Wind',    'original',  8, '4–6', 'finished'],
    ['A Lantern for Luna',           'original',  7, '4–6', ''],
    ['Moss and the Too-Small Map',   'original',  9, '6–8', 'page 12'],
    ['Pancakes at Midnight',         'original',  6, '4–6', 'finished'],
    ['The Cloud Boat',               'original',  9, '6–8', ''],
    ['Pip’s First Winter',           'original', 10, '6–8', ''],
    ['The Colour Bell',              'original',  8, '6–8', ''],
    ['A Star in the Puddle',         'original',  7, '4–6', 'finished'],
    ['The Umbrella Who Wanted Sea',  'original',  8, '6–8', ''],
    ['Hollowbrook Market Day',       'original', 11, '6–8', ''],
    ['The Quiet Cricket',            'original',  5, '4–6', ''],
    ['Commander Ember',              'original', 12, '8–10', ''],
    ['The Kind Crown',               'original', 10, '8–10', ''],
    ['The Three Little Pigs',        'retold',    6, '4–6', 'finished'],
    ['The Little Red Hen',           'retold',    5, '4–6', ''],
    ['Stone Soup',                   'retold',    8, '6–8', ''],
    ['The Gingerbread Runner',       'retold',    6, '4–6', ''],
    ['The Town Musicians',           'retold',    9, '6–8', ''],
    ['Goldilocks, Repaired',         'retold',    7, '6–8', '']
  ];

  function bookScreen() {
    var host = document.querySelector('.screen[data-s="library"]');
    if (!host || document.querySelector('.screen[data-s="lib-books"]')) return;
    var s = document.createElement('section');
    s.className = 'screen';
    s.setAttribute('data-s', 'lib-books');
    s.setAttribute('data-r1', '1');
    var rows = BOOKS.map(function (bk, i) {
      var badge = bk[4] === 'finished'
        ? '<span class="lbadge b-free">read</span>'
        : bk[4] ? '<span class="lbadge b-neybo">' + bk[4] + '</span>' : '';
      return (i ? '<div class="divider"></div>' : '') +
        '<div class="trow2"><div><div class="n">' + bk[0] + '</div>' +
        '<div class="d">' + bk[2] + ' min · ages ' + bk[3] + ' · ' +
        (bk[1] === 'original' ? 'Hollowbrook original' : 'retold in Neybo English') + '</div></div>' +
        (badge || '') + '</div>';
    }).join('');
    s.innerHTML =
      '<div class="topback" onclick="go(\'library\')">' +
      '<svg class="tsvg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" ' +
      'stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg>Library</div>' +
      '<div class="h1">Book Library</div>' +
      '<div class="subh">Twenty titles · fourteen ours, six retold</div>' +
      '<div class="card" style="box-shadow:none"><div style="font-size:13.5px;line-height:1.55;color:var(--muted)">' +
      'Ember offers three at a time and says how long each one is. He reads the whole book without ' +
      'stopping to ask questions, and if Eve goes quiet he keeps reading to the end rather than ' +
      'checking whether she is still there. The ribbon stays where she stopped.' +
      '</div></div>' +
      '<div class="lbl">The shelf</div><div class="card">' + rows + '</div>' +
      '<div class="card" style="box-shadow:none"><div style="font-size:12.5px;line-height:1.5;color:var(--muted)">' +
      'Titles as listed in the beat scripts. Worth checking against the current draft before any ' +
      'artwork is commissioned.</div></div>';
    host.parentNode.appendChild(s);
    if (window.TAB) TAB['lib-books'] = 'library';
  }

  /* a way in from the Book Reading card, where a parent is already looking */
  var _detail = window.detailHTML;
  if (typeof _detail === 'function') {
    window.detailHTML = function (x) {
      var html = _detail(x);
      if (x.id !== 'book-reading') return html;
      return html +
        '<div class="lbl" style="margin-top:14px">The shelf</div>' +
        '<div class="card" style="cursor:pointer" onclick="libCloseDetail();go(\'lib-books\')">' +
        '<div class="trow2"><div><div class="n">All twenty books</div>' +
        '<div class="d">Length, band and where the ribbon is</div></div>' +
        '<svg class="tsvg" style="color:var(--label);width:20px;height:20px" viewBox="0 0 24 24" fill="none" ' +
        'stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M9 6l6 6-6 6"/></svg></div></div>';
    };
  }

  /* -------------------------------------------------------------- presets
     A preset is two or three activities in a fixed order, so the Start
     button should say what the cube will do first and leave it queued —
     not fire a toast and forget. */

  var PRESET_PLAN = {
    'Family Lab':      ['Paper Lab', 'Logic Riddles'],
    'Make Something':  ['Paint With Words', 'Storytelling'],
    'Wind-Down':       ['Reading', 'Gratitude', 'Breathing']
  };
  var queued = null;

  function wirePresets() {
    var host = document.querySelector('[data-r1-presets]');
    if (!host || host.getAttribute('data-wired')) return;
    host.setAttribute('data-wired', '1');

    var status = document.createElement('div');
    status.id = 'r1PresetQueue';
    status.style.cssText = 'font-size:13px;line-height:1.5;color:var(--muted);margin-top:10px';
    var card = host.querySelector('.card');
    if (card) card.appendChild(status);

    host.querySelectorAll('.trow2').forEach(function (row) {
      var name = (row.querySelector('.n') || {}).textContent;
      var btn = row.querySelector('.r1-pbtn');
      if (!btn || !PRESET_PLAN[name]) return;
      btn.addEventListener('click', function () {
        queued = name;
        host.querySelectorAll('.r1-pbtn').forEach(function (b) {
          b.textContent = 'Start'; b.classList.remove('on');
        });
        btn.textContent = 'Queued';
        btn.classList.add('on');
        /* one line, because the point is only what happens next */
        status.innerHTML = '<b style="color:var(--ink)">' + name + ' is queued.</b> Neybo starts with ' +
          PRESET_PLAN[name][0] + ' when Eve says your name.';
        if (window.nbToast) nbToast(name + ' queued · starts with ' + PRESET_PLAN[name][0]);
        try { if (window.nbSend) nbSend('game.start', { game: name }); } catch (e) {}
      });
    });
  }

  /* --------------------------------------------------------- the star trail
     One mark a day, and only ever a mark. Today is deliberately empty until
     the check-up happens, because a filled-in today would be the app
     promising something the cube has not done. */

  function fixStarTrail() {
    var box = document.querySelector('[data-r1-stars]');
    if (!box || box.getAttribute('data-fixed')) return;
    box.setAttribute('data-fixed', '1');
    var days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    var got  = [1, 1, 0, 1, 1, 1, 0];      /* today is the last one, not yet done */
    var card = box.querySelector('.card');
    if (!card) return;
    card.innerHTML =
      '<div style="display:flex;gap:10px;justify-content:space-between;align-items:flex-end">' +
      days.map(function (d, i) {
        var today = (i === days.length - 1);
        return '<div style="text-align:center;flex:1">' +
          '<div style="font-size:22px;line-height:1;opacity:' + (got[i] ? '1' : '.22') + '">⭐</div>' +
          '<div style="font-size:11px;color:var(--muted);margin-top:6px' +
          (today ? ';font-weight:700;color:var(--ink)' : '') + '">' + d + '</div></div>';
      }).join('') + '</div>' +
      '<div style="font-size:13px;color:var(--muted);line-height:1.5;margin-top:12px">' +
      'Four check-ups this week. Tonight’s is still open — a star appears once it has happened, ' +
      'and it only ever says that it happened. Nothing here is a score and there is no streak to keep.' +
      '</div>';
  }

  /* ---------------------------------------------------------------- boot */

  /* The age chips in the filter sheet looked like a control and were not one:
     every release-1 activity spans roughly 4-10, so overlapping a band never
     excluded anything and the list came back 25 of 25 whichever chip you
     pressed. There is only one real notion of a band in this product, so
     picking an age in the sheet now sets it — and the offer, the allowance
     line and the recommended length move with it. */
  function syncBandFromFilter() {
    var a = window.APP && APP.age;
    if (!a || a === 'all' || !BAND_MID[a]) return false;
    if (bandNow() === a) return false;
    window.EVE_AGE = BAND_MID[a];
    var sub = document.getElementById('headSub');
    if (sub) sub.textContent = BAND_META[a].label;
    paintBandStrip();
    paintLimits();
    return true;
  }

  /* The band strip and the child's own albums belong to the main view. In
     Popular, New, Saved and in search results the reader is scanning a list
     of titles, and a band control plus two album rows on top of that list is
     furniture in the way. */
  function syncOwnBlocks() {
    var main = (window.LV === 'for-eve') && !(window.LQ && LQ.trim());
    ['[data-r1-band-strip]', '[data-r1-albums]'].forEach(function (sel) {
      var el = document.querySelector(sel);
      if (el) el.hidden = !main;
    });
  }

  function apply4() {
    mountBandStrip();
    bookScreen();
    ['libApplyFilters', 'removeChip', 'libClearAll'].forEach(function (fn) {
      if (typeof window[fn] !== 'function') return;
      var orig = window[fn];
      window[fn] = function () {
        var r = orig.apply(this, arguments);
        /* the filter renders before the band has moved, and a trim only ever
           removes cards — so once the band changes the list has to be built
           again rather than trimmed twice */
        if (syncBandFromFilter() && window.renderLib) { try { renderLib(); } catch (e) {} }
        else trimPicks();
        return r;
      };
    });
    if (window.renderLib) {
      var _renderLib = window.renderLib;
      window.renderLib = function () {
        var r = _renderLib.apply(this, arguments);
        trimPicks();
        syncOwnBlocks();
        return r;
      };
    }
    wirePresets();
    fixStarTrail();
    paintLimits();
    syncOwnBlocks();
    if (window.renderLib) try { renderLib(); } catch (e) {}

    /* the presets and the trail live on screens built by the earlier pass,
       so they are wired again whenever one of those screens is opened */
    var _go = window.go;
    window.go = function (id) {
      var r = _go.apply(this, arguments);
      if (id === 'm-parent') wirePresets();
      if (id === 'insights') fixStarTrail();
      if (id === 'gc-limits') paintLimits();
      if (id === 'library') { mountBandStrip(); trimPicks(); syncOwnBlocks(); }
      return r;
    };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply4);
  else setTimeout(apply4, 0);
})();
