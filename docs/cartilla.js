(function () {
  const paginas = Array.from(document.querySelectorAll('.pagina'));
  const ant = document.getElementById('ant');
  const sig = document.getElementById('sig');
  const contador = document.getElementById('contador');
  const puntos = document.getElementById('puntos');
  const DURACION = 760;
  let actual = -1;
  let animando = false;

  paginas.forEach((p, i) => {
    p.dataset.num = i + 1;
    const b = document.createElement('button');
    b.setAttribute('aria-label', 'Página ' + (i + 1) + ': ' + (p.dataset.titulo || ''));
    b.title = p.dataset.titulo || '';
    b.addEventListener('click', () => ir(i));
    puntos.appendChild(b);
  });
  const botones = Array.from(puntos.children);
  const antInf = document.createElement('button');
  const sigInf = document.createElement('button');
  antInf.className = sigInf.className = 'nav-inf';
  antInf.innerHTML = '&larr;'; sigInf.innerHTML = '&rarr;';
  antInf.setAttribute('aria-label', 'Página anterior');
  sigInf.setAttribute('aria-label', 'Página siguiente');
  antInf.addEventListener('click', () => ir(actual - 1));
  sigInf.addEventListener('click', () => ir(actual + 1));
  puntos.prepend(antInf); puntos.append(sigInf);

  function marcar(i, desdeHash) {
    botones.forEach((b, j) => b.classList.toggle('activo', j === i));
    contador.textContent = (i + 1) + ' / ' + paginas.length;
    ant.disabled = antInf.disabled = i === 0;
    sig.disabled = sigInf.disabled = i === paginas.length - 1;
    document.title = (paginas[i].dataset.titulo || '') + ' · Build seguro';
    if (!desdeHash) history.replaceState(null, '', '#' + paginas[i].id);
  }

  function limpiar(p) {
    p.classList.remove('hoja', 'hoja-adelante', 'hoja-atras');
  }

  function ir(i, desdeHash) {
    i = Math.max(0, Math.min(paginas.length - 1, i));
    if (i === actual || animando) return;
    const anterior = actual;
    actual = i;
    marcar(i, desdeHash);

    // primera carga: sin efecto
    if (anterior < 0) {
      paginas[i].classList.add('activa');
      return;
    }

    const vieja = paginas[anterior];
    const nueva = paginas[i];
    animando = true;
    window.scrollTo(0, 0);
    requestAnimationFrame(() => requestAnimationFrame(() => voltear(vieja, nueva, i > anterior)));
  }

  function voltear(vieja, nueva, adelante) {
    if (adelante) {
      // hacia adelante: la hoja actual se levanta y deja ver la siguiente
      nueva.classList.add('activa', 'sin-entrada');
      vieja.classList.add('hoja', 'hoja-adelante');
      setTimeout(() => {
        vieja.classList.remove('activa');
        limpiar(vieja);
        nueva.classList.remove('sin-entrada');
        animando = false;
      }, DURACION);
    } else {
      // hacia atrás: la hoja anterior vuelve a caer sobre la actual
      vieja.classList.add('sin-entrada');
      nueva.classList.add('activa', 'hoja', 'hoja-atras');
      setTimeout(() => {
        vieja.classList.remove('activa', 'sin-entrada');
        limpiar(nueva);
        animando = false;
      }, DURACION);
    }
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
