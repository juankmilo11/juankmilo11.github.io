(() => {
  'use strict';
  const dialog = document.querySelector('#booking-dialog');
  let opener = null;

  document.addEventListener('paca:book', () => {
    if (dialog.open) return;
    opener = document.activeElement;
    dialog.showModal();
    dialog.scrollTop = 0;
    document.body.classList.add('dialog-open');
  });
  document.querySelectorAll('[data-booking-open], a[href="#agendar"]').forEach(link => {
    link.setAttribute('aria-haspopup', 'dialog');
    link.setAttribute('aria-controls', 'booking-dialog');
    link.addEventListener('click', event => {
      event.preventDefault();
      document.dispatchEvent(new CustomEvent('paca:book', { detail: {} }));
    });
  });
  document.querySelector('#booking-window-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    document.body.classList.remove('dialog-open');
    if (opener?.isConnected) opener.focus({ preventScroll: true });
  });
  // Preserve existing bookmarked appointment links without scrolling the page.
  function openFromHash() {
    if (location.hash === '#agendar') document.dispatchEvent(new CustomEvent('paca:book', { detail: {} }));
  }
  addEventListener('hashchange', openFromHash);
  addEventListener('DOMContentLoaded', openFromHash, { once: true });
})();
