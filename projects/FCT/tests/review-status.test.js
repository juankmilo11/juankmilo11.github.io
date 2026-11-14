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
  const window = { addEventListener() {}, fctReview: {
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
  element('#review-last').click();
  assert.equal(notice.hidden, false, 'the latest position is still paused until Volver');
  element('#review-return').click();
  assert.equal(reviewing, false);
  assert.equal(notice.hidden, true);
  element('#review-first').click();
  assert.equal(notice.hidden, false);
  element('#play-again').click();
  assert.equal(notice.hidden, true);
});
