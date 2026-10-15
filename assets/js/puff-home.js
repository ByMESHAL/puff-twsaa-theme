/* Source home search/filter only. Native TWSAA commerce is unchanged. */
(() => {
  'use strict';
  const root = document.getElementById('puff-home');
  if (!root || root.dataset.ready) return;
  const input = root.querySelector('[data-puff-search]');
  const select = root.querySelector('[data-puff-filter]');
  if (!input || !select) return;
  root.dataset.ready = 'true';
  const cards = [...root.querySelectorAll('[data-puff-products] .puff-card')];
  const normalize = s => s.toLowerCase().normalize('NFKC').replace(/[ً-ٰٟ]/g, '').replace(/[أإآ]/g, 'ا');
  const filter = () => {
    let count = 0;
    const query = normalize(input.value.trim());
    for (const card of cards) {
      const show = normalize(card.dataset.title).includes(query) && (!select.value || card.dataset.categories.includes('|' + select.value + '|'));
      card.hidden = !show;
      if (show) count++;
    }
    root.querySelector('[data-puff-count]').textContent = count;
    root.querySelector('[data-puff-empty]').hidden = count > 0;
  };
  input.addEventListener('input', filter);
  select.addEventListener('change', filter);
})();
