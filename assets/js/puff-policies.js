/* Exact source policy HTML renderer. No fetch, storage, form or heading edits. */
(() => {
  'use strict';
  if (window.PuffPolicies) return;
  let observer = null;
  let timer = null;
  let restore = null;
  let state = { status: 'waiting' };
  function stopWatching() {
    observer?.disconnect(); observer = null;
    if (timer !== null) clearTimeout(timer);
    timer = null;
  }
  function matchingPage(config) {
    if (!config?.enabled || !config.selectorVerified || !config.bodySelector) return null;
    return config.pages.find(page => {
      if (!page.targetVerified || !page.targetUrl) return false;
      try {
        const url = new URL(page.targetUrl, location.origin);
        return /^https?:$/.test(url.protocol) && url.origin === location.origin && url.pathname === location.pathname;
      } catch { return false; }
    });
  }
  function render(config = window.PUFF_POLICY_CONFIG) {
    const page = matchingPage(config);
    if (!page) { stopWatching(); return state = { status: 'inactive' }; }
    const bodies = document.querySelectorAll(config.bodySelector);
    if (bodies.length === 0) return state = { status: 'waiting-for-body', page: page.key };
    if (bodies.length !== 1) { stopWatching(); return state = { status: 'ambiguous-body', count: bodies.length, page: page.key }; }
    const body = bodies[0];
    if (body.dataset.puffPolicy === page.key) { stopWatching(); return state = { status: 'rendered', page: page.key }; }
    const originalHtml = body.innerHTML;
    const originalMarker = body.getAttribute('data-puff-policy');
    restore = () => {
      body.innerHTML = originalHtml;
      if (originalMarker === null) body.removeAttribute('data-puff-policy');
      else body.setAttribute('data-puff-policy', originalMarker);
    };
    // HTML comes solely from the source-policy export, preserved verbatim.
    // Source export was checked for scripts, event attributes and unsafe URL schemes.
    body.innerHTML = page.html;
    body.dataset.puffPolicy = page.key;
    stopWatching();
    return state = { status: 'rendered', page: page.key };
  }
  function mount() {
    stopWatching();
    const result = render();
    if (result.status === 'waiting-for-body') {
      observer = new MutationObserver(() => render());
      observer.observe(document.documentElement, { childList: true, subtree: true });
      timer = setTimeout(() => { stopWatching(); state = { status: 'body-timeout', page: result.page }; }, 20000);
    }
    return state;
  }
  function destroy() { stopWatching(); restore?.(); restore = null; return state = { status: 'removed' }; }
  window.PuffPolicies = Object.freeze({ mount, render, destroy, getStatus: () => state });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once: true });
  else mount();
  window.addEventListener('puff:policies-ready', mount);
})();
