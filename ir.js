/* 15-nov-2026 · LOS ENLACES DE LAS BIOS: tonalamatl.app/tt, /yt, /fb, /ig
   (cuentas en español) y /tt-en, /yt-en, /fb-en, /ig-en (en inglés).

   Cada red lleva su propio enlace para saber de dónde llega quien instala:
   la marca viaja a la tienda y la cuenta cada tienda. Desde el 17-nov-2026
   la visita también se cuenta en PostHog (`medida.js`, sin cookies).
     · Android · `referrer` con utm_source (la red), utm_medium=bio y
       utm_campaign (el idioma). Play Console lo muestra en Adquisición, y la
       app lo recibe con Install Referrer (ya lo lee para las invitaciones;
       sin `c=` no canjea nada).
     · iPhone · `ct` (red-idioma) en el enlace de la App Store. App Store
       Connect lo cuenta con `pt`, el identificador del proveedor (Análisis →
       Campañas). Apple muestra una campaña desde 5 instalaciones.

   18-nov-2026 · plan de crecimiento (Memo lo aprobó): antes el teléfono se
   iba directo a su tienda. Ahora la página pregunta primero «¿Qué signo te
   tocó al nacer?», lo calcula aquí mismo (`tonalDeFecha`, de `cuenta.js`, que
   `paridad.mjs` revisa contra el motor) y luego ofrece la tienda. En el
   teléfono sólo sale el botón de su tienda; en la computadora, los dos.

   La fecha no sale del navegador: a PostHog va sólo que alguien vio su signo
   (`bio_sign_seen`) y, al tocar la tienda, `bio_redirect` con `con_signo`. */
(function () {
  /* La forma que da el generador de campañas de App Store Connect (15-nov). */
  var APP_STORE = 'https://apps.apple.com/app/apple-store/id6820837889';
  var PLAY = 'https://play.google.com/store/apps/details?id=app.tonalamatl.ce';
  var PT = '129488563';
  var REDES = { tt: 'tiktok', yt: 'youtube', fb: 'facebook', ig: 'instagram' };

  var yo = document.currentScript;
  var red = yo && yo.getAttribute('data-red');
  var idioma = yo && yo.getAttribute('data-idioma') === 'en' ? 'en' : 'es';
  if (!REDES[red]) return;
  var $ = function (id) { return document.getElementById(id) };
  var mide = function (evento, props) {
    if (window.tonalamatlMide) window.tonalamatlMide(evento, props);
  };

  var apple = APP_STORE + '?' + (PT ? 'pt=' + PT + '&' : '') + 'ct=' + red + '-' + idioma + '&mt=8';
  var play = PLAY + '&referrer=' + encodeURIComponent(
    'utm_source=' + REDES[red] + '&utm_medium=bio&utm_campaign=' + idioma);
  $('ir-iphone').href = apple;
  $('ir-android').href = play;

  var ua = navigator.userAgent || '';
  var iphone = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  var android = /Android/.test(ua);
  if (iphone || android) {
    $(iphone ? 'ir-android' : 'ir-iphone').hidden = true;
    $('en-compu').hidden = true;
  }

  var conSigno = false;
  [['ir-iphone', 'app_store'], ['ir-android', 'google_play']].forEach(function (b) {
    $(b[0]).addEventListener('click', function () {
      mide('bio_redirect', { red: REDES[red], idioma: idioma, tienda: b[1], con_signo: conSigno });
    });
  });

  /* Hoy, en la hora de quien lee: no se puede nacer mañana. */
  var hoy = new Date();
  var dos = function (n) { return (n < 10 ? '0' : '') + n };
  var hoyTxt = hoy.getFullYear() + '-' + dos(hoy.getMonth() + 1) + '-' + dos(hoy.getDate());
  var campo = $('nacio');
  campo.max = hoyTxt;

  $('tu-signo').addEventListener('submit', function (e) {
    e.preventDefault();
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(campo.value || '');
    var ok = m && campo.value >= '1900-01-01' && campo.value <= hoyTxt && typeof window.tonalDeFecha === 'function';
    $('nacio-error').hidden = !!ok;
    if (!ok) return;
    var t = window.tonalDeFecha(Number(m[1]), Number(m[2]), Number(m[3]));
    $('signo-nombre').textContent = t.nombre;
    $('signo-palabras').textContent = t.palabras;
    $('signo-glifo').src = '/assets/' + t.signo + '.png';
    $('signo-glifo').alt = t.palabras;
    $('signo').hidden = false;
    var primera = !conSigno;
    conSigno = true;
    if (primera) mide('bio_sign_seen', { red: REDES[red], idioma: idioma });
    if ($('signo').scrollIntoView) $('signo').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
})();
