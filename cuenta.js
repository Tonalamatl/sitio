/* ═══ EL MOTOR, EN LO MÍNIMO ═══
 *
 * Dos parámetros y cero excepciones, igual que el motor de verdad:
 *
 *   ANCLA    15 de marzo de 2026, 06:45 — la hora del reloj
 *   AÑO      365.25 días
 *
 * La apertura recorre seis horas cada año y vuelve cada cuatro. El último día
 * del año dura treinta horas: ahí se absorbe el cuarto de día.
 *
 * ⚠️ Esto es una COPIA REDUCIDA, y es la única del proyecto que se permite.
 * La ADR 0008 dice que hay un solo motor y vive en el servidor; aquí no hay
 * servidor, y pedirle a una página estática que llame a una API para pintar un
 * nombre de día sería montar infraestructura para un adorno.
 *
 * Lo que sí respeta: **sólo el nombre del día**. Ni esencias, ni regentes, ni
 * interpretación. El nombre de un día no es la enseñanza (0008), la lectura sí.
 */
function actualizaCuenta() {
  var TONALLI = ["Tzipahtli","Ehekatl","Kalli","Kuehtzpallin","Kowatl","Mikiztli",
    "Matzatl","Toxtli","Atl","Itzkuintli","Otzohmatli","Malinalli","Akatl",
    "Yowalmitzi","Kwauhtli","Kotzkakwauhtli","Ollin","Tekpatl","Kiawitl","Xoxitl"];
  var VEINTENAS = ["Atlakawalo","Tlakaxipewaliztli","Tozoztontli","Weytozoztli",
    "Toxkatl","Etzakualiztli","Tekuilwitontli","Weytekuilwitl","Tlaxoximako",
    "Xokowetzin","Oxpanixtli","Teotleko","Tepeilwitl","Kexolli","Pankezaliztli",
    "Atemoxtli","Tititl","Itzkalli"];
  var CARG_ACT = ["Atl","Yowalmitzi","Kiawitl","Kuehtzpallin"];
  var CARG_ANT = ["Toxtli","Akatl","Tekpatl","Kalli"];

  var D1 = 86400000;
  var ANIO = 365.25 * D1;
  var T0 = new Date(2026, 2, 15, 6, 45, 0).getTime();
  var mod = function (a, n) { return ((a % n) + n) % n };

  var ms = Date.now();
  var k = Math.floor((ms - T0) / ANIO);
  var ap = function (j) { return T0 + j * ANIO };
  while (ap(k) > ms) k--;
  while (ap(k + 1) <= ms) k++;

  /* Clamp a 364: el último día del año dura treinta horas. */
  var n = Math.max(0, Math.min(364, Math.floor((ms - ap(k)) / D1)));

  /* ⚠️ `abs` se cuenta en APERTURAS de día, no en milisegundos entre dos
     instantes: 365 × k + n.
   *
   * Aquí tenía `Math.floor((ms - T0) / D1)`, que parece lo mismo y no lo es.
   * El año dura 365.25 días pero tiene 365 aperturas —el cuarto de día se lo
   * come el último, que dura treinta horas—, así que la división cruda se
   * corre un día por cada año que pasa. Lo habría publicado: el 15 de marzo de
   * 2027 la página decía 2 Mikiztli donde el motor dice 1 Kowatl. */
  var abs = 365 * k + n;
  var t = mod(abs, 260);
  var kk = mod(k, 52);
  var anio = (mod(kk, 13) + 1) + ' ' + (k >= 0 ? CARG_ACT : CARG_ANT)[mod(kk, 4)];

  var pon = function (id, txt) {
    var e = document.getElementById(id);
    if (e) e.textContent = txt;
  };

  pon('tonal', (mod(t, 13) + 1) + ' ' + TONALLI[mod(t, 20)]);
  pon('bajo', n >= 360
    ? 'Nemontemi · día ' + (n - 359) + ' de 5'
    : VEINTENAS[Math.floor(n / 20)] + ' · día ' + (mod(n, 20) + 1) + ' de 20');
  var ingles = document.documentElement?.lang === 'en';
  if (ingles) {
    var bajo = document.getElementById('bajo');
    if (bajo?.textContent) bajo.textContent = bajo.textContent.replace('día', 'day').replace(' de ', ' of ');
  }
  pon('anio', (ingles ? 'Year ' : 'Año ') + anio);
  pon('fecha-gregoriana', new Date(ms).toLocaleDateString(ingles ? 'en-US' : 'es-MX', { day: 'numeric', month: 'long', year: 'numeric' }));
  var tarjeta = document.getElementById('lectura-hoy');
  if (tarjeta) {
    var abre = new Date(ap(k) + n * D1);
    tarjeta.dataset.fecha = [abre.getFullYear(), String(abre.getMonth() + 1).padStart(2, '0'), String(abre.getDate()).padStart(2, '0')].join('-');
    tarjeta.dataset.tonal = (mod(t, 13) + 1) + ' ' + TONALLI[mod(t, 20)];
    document.dispatchEvent(new Event('cuenta-actualizada'));
  }
  var glifo = document.getElementById('glifo-hoy');
  if (glifo) glifo.src = 'assets/' + TONALLI[mod(t, 20)] + '.png';
}
actualizaCuenta();
