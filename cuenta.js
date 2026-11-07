/* ═══ EL MOTOR, EN LO MÍNIMO ═══
 *
 * Dos parámetros y cero excepciones, igual que el motor de verdad:
 *
 *   ANCLA    15 de marzo de 2026, 06:45 — la hora del reloj
 *   AÑO      365.25 días
 *
 * Y el Tonal, de corrido, cambiando a las 00:00 del reloj (0050).
 *
 * La apertura recorre seis horas cada año y vuelve cada cuatro. El último día
 * del año dura treinta horas: ahí se absorbe el cuarto de día.
 *
 * ⚠️ Esto es una COPIA REDUCIDA, y es la única del proyecto que se permite.
 * La ADR 0008 dice que hay un solo motor y vive en el servidor; aquí no hay
 * servidor, y pedirle a una página estática que llame a una API para pintar un
 * nombre de día sería montar infraestructura para un adorno.
 *
 * 5-nov-2026 · Memo: «debe mostrar Tonal y Xiuhtonal de hoy». Las dos columnas
 * de la app: el Tonal con su trecena y el año; el Xiuhtonal con su trecena, la
 * veintena y el año. Cada nombre con sus palabras debajo.
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
  /* Los nombres en palabras, los mismos de la app (mobile/lib/widgets/glifo.dart,
     de la hoja del maestro; el inglés lo aprobó Memo el 21-oct). */
  var PALABRAS = {
    es: ["Lagarto / cocodrilo","Viento","Casa","Lagartija","Serpiente","Muerte","Venado",
      "Conejo","Agua","Perro","Mono","Hierba","Caña","Jaguar","Águila","Zopilote / cóndor",
      "Movimiento","Pedernal","Lluvia","Flor"],
    en: ["Crocodile","Wind","House","Lizard","Serpent","Death","Deer","Rabbit","Water","Dog",
      "Monkey","Grass","Reed","Jaguar","Eagle","Vulture / condor","Movement","Flint","Rain","Flower"]
  };
  var VEINTENAS_P = {
    es: ["Lo que generó el agua","Renovar el tejido de la tierra","Pequeña vigilia","Gran vigilia",
      "Lo seco","Buen frijol","Pequeña festividad de los señores","Gran festividad de los señores",
      "Atado de flor en mano","Frutos maduros","Barrimiento de caminos","Donde desciende la energía",
      "Festividad de los cerros","Migración","Levantamiento de banderas","Libro de las aguas",
      "Encogimiento","Blancor (la sal)","Días fuera de cuenta"],
    en: ["What the Water Brought Forth","Renewing the Earth’s Fabric","The Small Vigil","The Great Vigil",
      "Dryness","The Good Bean","The Small Feast of the Lords","The Great Feast of the Lords",
      "Flowers Bound in Hand","Ripe Fruit","Sweeping the Paths","Where the Energy Descends",
      "The Feast of the Hills","Migration","Raising the Banners","The Book of the Waters",
      "Drawing Inward","Whiteness (of salt)","Days Outside the Count"]
  };
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
  /* ═══ EL TONAL, DE CORRIDO · 0050, 1-nov-2026 ═══
     Ya no sale de `365·k + n`. Corre sin pausa —la rueda de 260 nunca se
     detiene— y cambia a las 00:00 del reloj de quien lee: es la fecha local,
     no la apertura del año. La veintena, el año y los Nemontemi siguen
     abriendo a la hora del año (arriba): eso no cambió. */
  var hoy = new Date(ms);
  var diaLocal = Math.floor(Date.UTC(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()) / D1);
  var t = mod(diaLocal + 2440588 + 96, 260);
  var kk = mod(k, 52);
  var anio = (mod(kk, 13) + 1) + ' ' + (k >= 0 ? CARG_ACT : CARG_ANT)[mod(kk, 4)];

  var pon = function (id, txt) {
    var e = document.getElementById(id);
    if (e) e.textContent = txt;
  };
  var ingles = document.documentElement?.lang === 'en';
  var pal = PALABRAS[ingles ? 'en' : 'es'];
  /* «1 Ollin» y debajo «1 Movimiento»: con su numeral, como la app (21-oct). */
  var nombre = function (i) { return (mod(i, 13) + 1) + ' ' + TONALLI[mod(i, 20)] };
  var palabras = function (i) { return (mod(i, 13) + 1) + ' ' + pal[mod(i, 20)] };
  var trecena = function (i) { return i - mod(i, 13) };

  /* ═══ EL TONAL · lo de dentro ═══ */
  pon('tonal', nombre(t));
  pon('tonal-p', palabras(t));
  pon('tonal-trecena', nombre(trecena(t)));
  pon('tonal-trecena-p', palabras(trecena(t)));

  /* ═══ EL XIUHTONAL · el mundo ═══
     Sale de la apertura del año, no de la medianoche: 360·k + n. Entre las
     00:00 y la hora en que abre, sigue el de ayer (Memo, 4-nov: «el vigente en
     todo»). En los Nemontemi lleva su propia cuenta, que avanza 5 por año
     (0013): 5·kk + n − 360. */
  var nem = n >= 360;
  var x = nem ? mod(5 * kk + n - 360, 260) : mod(360 * k + n, 260);
  pon('xiuhtonal', nombre(x));
  pon('xiuhtonal-p', palabras(x));
  pon('xiuh-trecena', nombre(trecena(x)));
  pon('xiuh-trecena-p', palabras(trecena(x)));
  pon('bajo', nem
    ? 'Nemontemi · día ' + (n - 359) + ' de 5'
    : VEINTENAS[Math.floor(n / 20)] + ' · día ' + (mod(n, 20) + 1) + ' de 20');
  if (ingles) {
    var bajo = document.getElementById('bajo');
    if (bajo?.textContent) bajo.textContent = bajo.textContent.replace('día', 'day').replace(' de ', ' of ');
  }
  pon('bajo-p', VEINTENAS_P[ingles ? 'en' : 'es'][nem ? 18 : Math.floor(n / 20)]);

  /* El año: el mismo en las dos columnas, como en la app. */
  var anioP = (mod(kk, 13) + 1) + ' ' + pal[TONALLI.indexOf((k >= 0 ? CARG_ACT : CARG_ANT)[mod(kk, 4)])];
  pon('anio', anio); pon('anio-p', anioP);
  pon('tonal-anio', anio); pon('tonal-anio-p', anioP);
  pon('fecha-gregoriana', new Date(ms).toLocaleDateString(ingles ? 'en-US' : 'es-MX', { day: 'numeric', month: 'long', year: 'numeric' }));
  var tarjeta = document.getElementById('lectura-hoy');
  if (tarjeta) {
    /* La fecha de la tarjeta es la del Tonal: la local de hoy (0050). */
    tarjeta.dataset.fecha = [hoy.getFullYear(), String(hoy.getMonth() + 1).padStart(2, '0'), String(hoy.getDate()).padStart(2, '0')].join('-');
    tarjeta.dataset.tonal = (mod(t, 13) + 1) + ' ' + TONALLI[mod(t, 20)];
    document.dispatchEvent(new Event('cuenta-actualizada'));
  }
  var glifo = document.getElementById('glifo-hoy');
  if (glifo) glifo.src = 'assets/' + TONALLI[mod(t, 20)] + '.png';
  var glifoX = document.getElementById('glifo-xiuh');
  if (glifoX) glifoX.src = 'assets/' + TONALLI[mod(x, 20)] + '.png';
}
actualizaCuenta();
