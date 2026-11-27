/* ═══ CUÁNTA GENTE VISITA EL SITIO · 17-nov-2026 ═══

   Memo: «sí, agrégalo». Hasta hoy el sitio no medía nada (era la regla del
   README) y no se sabía cuántos lo visitan ni cuántos se van sin tocar una
   tienda.

   Va directo a PostHog, al proyecto de la app, sin su librería:
     · sin cookies y sin guardar nada en el navegador. Cada visita lleva un
       identificador al azar que se pierde al cerrar la página, y no crea
       perfiles de persona ($process_person_profile: false).
     · si el navegador pide no ser rastreado (Global Privacy Control o Do Not
       Track), no se manda nada.
     · de la dirección sólo va el camino. Nunca el #: en /vinculo lleva la
       lectura compartida. Nunca la consulta, salvo las utm_. Y /i/<código>
       se manda como /i, sin el código de quien invita.

   Eventos:
     $pageview      al abrir cualquier página
     store_click    al tocar un botón de App Store o Google Play (`tienda`)
     social_click   al tocar el enlace a una red (`red`)
     bio_redirect   lo manda `ir.js` justo antes de llevar el teléfono a su
                    tienda (`red`, `idioma`, `tienda`)

   El aviso de privacidad lo dice (privacidad.html, privacy.html). */
(function () {
  'use strict';
  var TOKEN = 'phc_Cga9dm64BakPfWirBr8NSFkdLaLA2pqTBSxVdpUmYcPq';
  var DESTINO = 'https://us.i.posthog.com/i/v0/e/';

  var nav = window.navigator || {};
  if (nav.globalPrivacyControl === true || nav.doNotTrack === '1' || window.doNotTrack === '1') {
    window.tonalamatlMide = function () {};
    return;
  }

  function alAzar() {
    try {
      if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    } catch (e) {}
    return 'x' + Date.now().toString(36) + Math.random().toString(36).slice(2);
  }

  var visita = alAzar();
  var ua = nav.userAgent || '';
  var iphone = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && nav.maxTouchPoints > 1);
  var android = /Android/.test(ua);
  var tableta = /iPad/.test(ua) || (/Macintosh/.test(ua) && nav.maxTouchPoints > 1) || (android && !/Mobile/.test(ua));
  var so = iphone ? 'iOS' : android ? 'Android' : /Windows/.test(ua) ? 'Windows' : /Mac OS X/.test(ua) ? 'Mac OS X' : /Linux/.test(ua) ? 'Linux' : 'Otro';
  var navegador = /Instagram/.test(ua) ? 'Instagram' : /FBAN|FBAV/.test(ua) ? 'Facebook' : /musical_ly|TikTok|BytedanceWebview/.test(ua) ? 'TikTok'
    : /Edg\//.test(ua) ? 'Edge' : /CriOS|Chrome\//.test(ua) ? 'Chrome' : /FxiOS|Firefox\//.test(ua) ? 'Firefox' : /Safari\//.test(ua) ? 'Safari' : 'Otro';

  /* /i/AB12CD → /i · y sin la barra del final, para que /origen y /origen/ cuenten igual. */
  var camino = (location.pathname || '/').replace(/^\/i\/.*$/, '/i/').replace(/(.)\/$/, '$1');

  var utm = {};
  try {
    var q = new URLSearchParams(location.search);
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(function (k) {
      var v = q.get(k);
      if (v) utm[k] = v.slice(0, 100);
    });
  } catch (e) {}
  var conUtm = Object.keys(utm).map(function (k) { return k + '=' + encodeURIComponent(utm[k]); }).join('&');

  var deDonde = '$direct', dominioDeDonde = '$direct';
  try {
    if (document.referrer) {
      var r = new URL(document.referrer);
      deDonde = r.origin + r.pathname;
      dominioDeDonde = r.hostname;
    }
  } catch (e) {}

  function base() {
    var p = {
      $lib: 'tonalamatl-sitio',
      $process_person_profile: false,
      $session_id: visita,
      $current_url: location.origin + camino + (conUtm ? '?' + conUtm : ''),
      $host: location.host,
      $pathname: camino,
      $referrer: deDonde,
      $referring_domain: dominioDeDonde,
      $raw_user_agent: ua,
      $os: so,
      $browser: navegador,
      $device_type: tableta ? 'Tablet' : (iphone || android) ? 'Mobile' : 'Desktop',
      $browser_language: nav.language || '',
      $screen_width: window.screen ? screen.width : null,
      $screen_height: window.screen ? screen.height : null,
      $viewport_width: window.innerWidth,
      idioma: (document.documentElement.lang || '').slice(0, 2)
    };
    for (var k in utm) p[k] = utm[k];
    return p;
  }

  function mide(evento, extra) {
    var props = base();
    if (extra) for (var k in extra) props[k] = extra[k];
    var cuerpo = JSON.stringify({ api_key: TOKEN, event: evento, distinct_id: 'sitio-' + visita, properties: props });
    /* sendBeacon sale aunque la página se vaya (las bios y la invitación
       cambian de página en seguida). Texto plano: sin consulta previa del
       navegador, y PostHog lo lee igual. */
    try {
      if (nav.sendBeacon && nav.sendBeacon(DESTINO, new Blob([cuerpo], { type: 'text/plain' }))) return;
    } catch (e) {}
    try {
      fetch(DESTINO, { method: 'POST', body: cuerpo, keepalive: true, headers: { 'Content-Type': 'text/plain' } }).catch(function () {});
    } catch (e) {}
  }

  window.tonalamatlMide = mide;
  mide('$pageview');

  var REDES = { 'tiktok.com': 'tiktok', 'youtube.com': 'youtube', 'youtu.be': 'youtube', 'instagram.com': 'instagram', 'facebook.com': 'facebook' };
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!a) return;
    var h;
    try { h = new URL(a.href, location.href); } catch (err) { return; }
    var host = h.hostname.replace(/^(www|m)\./, '');
    var texto = (a.innerText || a.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 60);
    if (host === 'apps.apple.com') return mide('store_click', { tienda: 'app_store', boton: texto });
    if (host === 'play.google.com') return mide('store_click', { tienda: 'google_play', boton: texto });
    if (REDES[host]) return mide('social_click', { red: REDES[host], boton: texto });
  }, true);
})();
