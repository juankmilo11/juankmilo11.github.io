import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

test('review pauses show a notice until returning to the live position or starting a new game', () => {
  const elements = new Map();
  function element(selector) {
    if (!elements.has(selector)) {
      const classes = new Set(selector === '.app-shell' ? ['is-playing'] : []);
      elements.set(selector, {
        textContent: selector === '#game-status' ? 'Tu turno' : '', hidden: false,
        classList: { contains: c => classes.has(c), add: c => classes.add(c), remove: c => classes.delete(c), toggle() {} },
        events: {}, addEventListener(event, handler) { this.events[event] = handler; },
        click() { this.events.click?.(); }, focus() {},
      });
    }
    return elements.get(selector);
  }
  let reviewing = false;
  let nextTimer = 0;
  const timers = new Map();
  const window = {
    addEventListener() {},
    matchMedia: () => ({ matches: false }),
    setTimeout(callback) { timers.set(++nextTimer, callback); return nextTimer; },
    clearTimeout(id) { timers.delete(id); },
    fctReview: {
    refresh: () => ({ total: 4 }), begin: () => 4,
    goTo: index => ({ index, total: 4 }), setReviewing: value => { reviewing = value; }, reset() {},
  } };
  runInNewContext(readFileSync(new URL('../public/game-status.js', import.meta.url), 'utf8'), {
    document: { querySelector: element, querySelectorAll: () => [] }, window,
    MutationObserver: class { observe() {} },
    ResizeObserver: class { observe() {} },
  });
  const notice = element('#review-pause-note');
  assert.equal(notice.hidden, true);
  element('#review-previous').click();
  assert.equal(reviewing, true);
  assert.equal(notice.hidden, false);
  assert.equal(element('.app-shell').classList.contains('is-review-transitioning'), true);
  assert.equal(timers.size, 1);
  element('#review-last').click();
  assert.equal(notice.hidden, false, 'the latest position is still paused until Volver');
  element('#review-return').click();
  assert.equal(reviewing, false);
  assert.equal(notice.hidden, true);
  assert.equal(timers.size, 1, 'a quick return replaces the entry transition timer');
  [...timers.values()][0]();
  assert.equal(element('.app-shell').classList.contains('is-review-transitioning'), false);
  element('#review-first').click();
  assert.equal(notice.hidden, false);
  element('#play-again').click();
  assert.equal(notice.hidden, true);
  assert.equal(timers.size, 0, 'starting a game cancels the pending transition');
  assert.equal(element('.app-shell').classList.contains('is-review-transitioning'), false);
  window.matchMedia = () => ({ matches: true });
  element('#review-first').click();
  assert.equal(notice.hidden, false);
  assert.equal(timers.size, 0, 'reduced motion avoids scheduling a shade transition');
  assert.equal(element('.app-shell').classList.contains('is-review-transitioning'), false);
  element('#review-return').click();
  assert.equal(notice.hidden, true);
  assert.equal(timers.size, 0);
});
