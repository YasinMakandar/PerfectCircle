(function () {
  'use strict';

  /* ── Prevent double-injection ─────────────────────────────── */
  if (window.__perfectCircleLoaded) return;
  window.__perfectCircleLoaded = true;

  /* ── Utility: find the game's drawing target ──────────────── */
  function getTarget() {
    // 1) Grab the canvas the game renders into
    const canvas = document.querySelector('canvas');
    if (canvas) return canvas;

    // 2) Fallback — element right in the centre of the viewport
    return document.elementFromPoint(
      window.innerWidth / 2,
      window.innerHeight / 2
    );
  }

  /* ── Utility: dispatch paired Pointer + Mouse events ──────── */
  function fireEvent(target, mouseType, x, y) {
    const isUp       = mouseType.includes('up');
    const buttons    = isUp ? 0 : 1;
    const pressure   = isUp ? 0 : 0.5;
    const pointerType = mouseType.replace('mouse', 'pointer');

    const shared = {
      clientX:    x,
      clientY:    y,
      screenX:    x,
      screenY:    y,
      pageX:      x + window.scrollX,
      pageY:      y + window.scrollY,
      bubbles:    true,
      cancelable: true,
      view:       window,
      button:     0,
      buttons:    buttons,
    };

    target.dispatchEvent(new PointerEvent(pointerType, {
      ...shared,
      pointerId:   1,
      pointerType: 'mouse',
      pressure:    pressure,
      isPrimary:   true,
      width:       1,
      height:      1,
    }));

    target.dispatchEvent(new MouseEvent(mouseType, shared));
  }

  /* ── Core: draw a perfect circle ──────────────────────────── */
  function drawPerfectCircle(config = {}) {
    const {
      points        = 500,
      delay         = 3,
      radiusPercent = 40,
    } = config;

    const target = getTarget();
    if (!target) {
      console.error('[PerfectCircle] No drawing target found.');
      return;
    }

    const rect   = target.getBoundingClientRect();
    const cx     = rect.left + rect.width  / 2;
    const cy     = rect.top  + rect.height / 2;
    const radius = Math.min(rect.width, rect.height) * (radiusPercent / 100);

    console.log(
      `[PerfectCircle] target=${target.tagName}  centre=(${cx.toFixed(1)}, ${cy.toFixed(1)})  r=${radius.toFixed(1)}  pts=${points}`
    );

    // Generate points along the circumference (clockwise in screen coords)
    const path = [];
    for (let i = 0; i <= points; i++) {
      const angle = (i / points) * Math.PI * 2;
      path.push({
        x: cx + radius * Math.cos(angle),
        y: cy + radius * Math.sin(angle),
      });
    }

    // ── Dispatch the drawing sequence ──
    fireEvent(target, 'mousedown', path[0].x, path[0].y);

    let idx = 1;
    const timer = setInterval(() => {
      if (idx < path.length) {
        fireEvent(target, 'mousemove', path[idx].x, path[idx].y);
        idx++;
      } else {
        clearInterval(timer);
        const last = path[path.length - 1];
        fireEvent(target, 'mouseup', last.x, last.y);
        console.log('[PerfectCircle] ✓ Drawing complete!');
        flashButton('✓  Done!', '#00e676');
      }
    }, delay);
  }

  /* ── Floating page button ─────────────────────────────────── */
  function flashButton(text, color) {
    if (!pageBtn) return;
    const orig = pageBtn.textContent;
    pageBtn.textContent       = text;
    pageBtn.style.background  = color;
    setTimeout(() => {
      pageBtn.textContent      = orig;
      pageBtn.style.background = '#4fc3f7';
    }, 1500);
  }

  const pageBtn = document.createElement('button');
  pageBtn.textContent = '⭕ Draw Circle';
  Object.assign(pageBtn.style, {
    position:     'fixed',
    top:          '12px',
    right:        '12px',
    zIndex:       '2147483647',
    padding:      '8px 18px',
    background:   '#4fc3f7',
    color:        '#0f0f1a',
    border:       'none',
    borderRadius: '8px',
    cursor:       'pointer',
    fontSize:     '13px',
    fontWeight:   'bold',
    fontFamily:   'system-ui, sans-serif',
    boxShadow:    '0 2px 12px rgba(0,0,0,0.4)',
    transition:   'all 0.2s',
  });
  pageBtn.addEventListener('mouseenter', () => { pageBtn.style.opacity = '0.85'; });
  pageBtn.addEventListener('mouseleave', () => { pageBtn.style.opacity = '1'; });
  pageBtn.addEventListener('click',      () => { drawPerfectCircle(); });
  document.body.appendChild(pageBtn);

  /* ── Keyboard shortcut: Shift + D ─────────────────────────── */
  document.addEventListener('keydown', (e) => {
    if (e.shiftKey && e.key === 'D') {
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      e.preventDefault();
      drawPerfectCircle();
    }
  });

  /* ── Listen for messages from the popup ───────────────────── */
  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg.action === 'draw') {
      drawPerfectCircle(msg.config);
      sendResponse({ ok: true });
    }
  });

  console.log('[PerfectCircle] Extension loaded — press Shift+D or click the page button.');
})();