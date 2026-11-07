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
