/* Small enhancements only: content and navigation remain usable without JS. */
(() => {
  const lectura = document.getElementById('lectura-hoy');
  if (lectura) {
    const ingles = document.documentElement.lang === 'en';
    const estado = document.getElementById('lectura-estado');
    let datos, ultimaPeticion, cargando = false;
    function pintaLectura() {
      const fecha = lectura.dataset.fecha;
      const d = datos?.dias?.[fecha];
      const g = d?.[ingles ? 'en' : 'es'];
      const coincide = d?.tonal === lectura.dataset.tonal &&
        typeof g?.facilita === 'string' && typeof g?.reto === 'string' &&
        g.facilita.trim() && g.reto.trim();
      lectura.hidden = !coincide;
      estado.hidden = !!coincide;
      document.getElementById('facilita-hoy').textContent = coincide ? g.facilita : '';
      document.getElementById('reto-hoy').textContent = coincide ? g.reto : '';
      /* 9-nov-2026 · hacia el mundo, del Xiuhtonal (Memo). Sólo si el archivo
         trae el Xiuhtonal de hoy y es otro que el Tonal; juntos, una sola
         tarjeta para los dos. En los Nemontemi el Xiuhtonal se detiene. */
      const x = lectura.dataset.xiuhtonal || '';
      const juntos = !!x && x === lectura.dataset.tonal;
      /* 10-nov-2026 · motor 5 (0061): el Xiuhtonal cambia a la hora en que
         abrió su año, no a medianoche, y el archivo trae el de cada fecha al
         mediodía. Antes de esa hora corre el de la fecha de ayer; después, en
         los años que abren por la tarde, el de mañana. Se usa la tarjeta de la
         fecha cuyo Xiuhtonal es el que corre. */
      const vecina = (f, k) => new Date(Date.parse(`${f}T12:00:00Z`) + k * 86400000).toISOString().slice(0, 10);
      const dx = fecha ? [0, -1, 1].map((k) => datos?.dias?.[vecina(fecha, k)]).find((e) => !!x && e?.xiuhtonal === x) : undefined;
      const m = dx?.[ingles ? 'en' : 'es']?.mundo;
      const mundo = coincide && !juntos && !!x && !!dx &&
        typeof m?.facilita === 'string' && typeof m?.reto === 'string' && m.facilita.trim() && m.reto.trim();
      const ladoMundo = document.getElementById('lado-mundo');
      if (ladoMundo) ladoMundo.hidden = !mundo;
      document.getElementById('facilita-mundo').textContent = mundo ? m.facilita : '';
      document.getElementById('reto-mundo').textContent = mundo ? m.reto : '';
      document.getElementById('lado-dentro-titulo').textContent = juntos
        ? (ingles ? 'Tonal and Xiuhtonal · the same day' : 'Tonal y Xiuhtonal · el mismo día')
        : (ingles ? 'Tonal · Within you' : 'Tonal · Dentro de ti');
      if (coincide) return;
      estado.textContent = cargando
        ? (ingles ? 'Loading today’s reading…' : 'Cargando la lectura del día…')
        : (ingles ? 'Today’s reading could not be loaded. You can find it in the app.' : 'No se pudo cargar la lectura de hoy. Puedes consultarla en la app.');
      if (!cargando && fecha && ultimaPeticion !== fecha) cargaLectura(fecha);
    }
    async function cargaLectura(fecha) {
      ultimaPeticion = fecha;
      cargando = true;
      pintaLectura();
      try {
        const r = await fetch('lectura-hoy.json', { cache: 'no-cache', signal: AbortSignal.timeout(12000) });
        if (!r.ok) throw Error('Lectura no disponible');
        datos = await r.json();
      } catch { datos = undefined; }
      finally { cargando = false; pintaLectura(); }
    }
    document.addEventListener('cuenta-actualizada', pintaLectura);
    pintaLectura();
  }
  for (const player of document.querySelectorAll('.film-player')) {
    const video = player.querySelector('video');
    const button = player.querySelector('.film-play');
    if (!video || !button) continue;
    button.hidden = false;
    button.addEventListener('click', () => {
      video.play().catch(() => { button.hidden = false; });
    });
    video.addEventListener('play', () => { button.hidden = true; });
    video.addEventListener('pause', () => { button.hidden = false; });
    video.addEventListener('ended', () => { button.hidden = false; });
  }
  /* 11-nov-2026 · Descarga la app (Memo): aparece al dejar la primera sección
     y se esconde donde ya están los botones de las tiendas y en el pie. */
  const baja = document.getElementById('baja-app');
  const portada = document.querySelector?.('main > section');
  if (baja && portada && 'IntersectionObserver' in window) {
    baja.hidden = false;
    const tapan = [...document.querySelectorAll('#app, .site-footer')];
    const vistos = new Set();
    let pasada = false;
    const pinta = () => baja.classList.toggle('visible', pasada && vistos.size === 0);
    new IntersectionObserver(([e]) => { pasada = !e.isIntersecting && e.boundingClientRect.top < 0; pinta(); }).observe(portada);
    const o = new IntersectionObserver((es) => { for (const e of es) e.isIntersecting ? vistos.add(e.target) : vistos.delete(e.target); pinta(); });
    for (const t of tapan) o.observe(t);
  }
  /* El año del pie (Memo, 21-oct): el del día; sin JS se queda el escrito. */
  for (const anio of document.querySelectorAll('[data-anio]')) {
    anio.textContent = String(new Date().getFullYear());
  }
  const code = new URLSearchParams(location.search).get('invita');
  if (code && /^[A-Za-z0-9_-]{1,80}$/.test(code)) {
    for (const a of document.querySelectorAll('a[data-invita]')) {
      const url = new URL(a.href, location.href);
      if (url.origin === location.origin) url.searchParams.set('invita', code);
      a.href = url.href;
    }
  }
  if (typeof actualizaCuenta === 'function') {
    setInterval(actualizaCuenta, 60000);
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) actualizaCuenta();
    });
  }
})();
