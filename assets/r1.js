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
      desc:'Eve teaches Neybo a sound, then tests it. Moss answers with his real confidence and says "I am not sure yet" when he is not — nothing is staged.',
      help:'listening, categories and how learning actually works.' },
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
      desc:'Moss names a few moves, Eve picks the ones she likes, gives the routine a name and performs it. The dance she built is the reward.',
      help:'movement, sequencing and inventing something of her own.' },

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

  var PRESETS = [
    ['Family Lab', 'Paper Experiment Lab, then Logic Riddles', 'Both of you guess out loud — the grown-up is allowed to be wrong.'],
    ['Make Something', 'Paint With Words, then Collaborative Storytelling', 'One session that ends with something you can keep.'],
    ['Wind-Down', 'Book Reading, Gratitude, Breathing', 'Twelve quiet minutes in the same order every night.']
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
          '<div class="d">' + p[1] + '</div>' +
          '<div class="d" style="margin-top:2px">' + p[2] + '</div></div>' +
          '<button class="medit" onclick="t(\'' + p[0] + ' queued on Neybo\')">Start</button></div>';
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

  /* --------------------------------------------------------------------- badge */

  function badge() {
    var b = el('<div id="r1Badge" title="Release-1 methodology overlay. Remove ?r1=1 for the current build.">' +
      'Release&nbsp;1 preview</div>');
    b.style.cssText = 'position:fixed;left:12px;bottom:12px;z-index:99999;font:600 11px/1 ' +
      '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;letter-spacing:.06em;text-transform:uppercase;' +
      'padding:7px 11px;border-radius:999px;background:#1f1a12;color:#ffd75e;opacity:.86;pointer-events:none';
    document.body.appendChild(b);
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
    badge();

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
