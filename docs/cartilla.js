(function () {
  const paginas = Array.from(document.querySelectorAll('.pagina'));
  const ant = document.getElementById('ant');
  const sig = document.getElementById('sig');
  const contador = document.getElementById('contador');
  const puntos = document.getElementById('puntos');
  let actual = 0;

  paginas.forEach((p, i) => {
    p.dataset.num = i + 1;
    const b = document.createElement('button');
    b.setAttribute('aria-label', 'Página ' + (i + 1) + ': ' + (p.dataset.titulo || ''));
    b.title = p.dataset.titulo || '';
    b.addEventListener('click', () => ir(i));
    puntos.appendChild(b);
  });
  const botones = Array.from(puntos.children);

  function ir(i, desdeHash) {
    actual = Math.max(0, Math.min(paginas.length - 1, i));
    paginas.forEach((p, j) => p.classList.toggle('activa', j === actual));
    botones.forEach((b, j) => b.classList.toggle('activo', j === actual));
    contador.textContent = (actual + 1) + ' / ' + paginas.length;
    ant.disabled = actual === 0;
    sig.disabled = actual === paginas.length - 1;
    document.title = (paginas[actual].dataset.titulo || '') + ' · Build seguro';
    if (!desdeHash) history.replaceState(null, '', '#' + paginas[actual].id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function desdeHash() {
    const i = paginas.findIndex(p => '#' + p.id === location.hash);
    ir(i >= 0 ? i : 0, true);
  }

  ant.addEventListener('click', () => ir(actual - 1));
  sig.addEventListener('click', () => ir(actual + 1));
  window.addEventListener('hashchange', desdeHash);
  document.addEventListener('keydown', e => {
    if (e.target.closest('input, textarea')) return;
    if (e.key === 'ArrowRight' || e.key === 'PageDown') ir(actual + 1);
    if (e.key === 'ArrowLeft' || e.key === 'PageUp') ir(actual - 1);
  });

  // deslizar en pantallas táctiles
  let x0 = null;
  document.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
  document.addEventListener('touchend', e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 70) ir(actual + (dx < 0 ? 1 : -1));
    x0 = null;
  });

  desdeHash();
})();
