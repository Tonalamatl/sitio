/* ═══ EL MOTOR, EN LO MÍNIMO ═══
 *
 * El motor 5 (0061): el año del Tonal empieza en el solsticio de diciembre y
 * cambia a las 00:00 del reloj. El Xiuhpohualli de hoy es el del motor 1:
 * años de 365.25 días desde el 15-mar-2026 a las 06:45, y el Xiuhtonal cambia
 * a la hora en que abrió su año. Aquí va sólo lo que hace falta para hoy, de
 * 2000 a 2201.
 *
 * ⚠️ Esto es una COPIA REDUCIDA, y es la única del proyecto que se permite.
 * La ADR 0008 dice que hay un solo motor y vive en el servidor; aquí no hay
 * servidor, y pedirle a una página estática que llame a una API para pintar un
 * nombre de día sería montar infraestructura para un adorno.
 *
 * 5-nov-2026 · Memo: «debe mostrar Tonal y Xiuhtonal de hoy». Las dos columnas
 * de la app: el Tonal con su trecena y su año; el Xiuhtonal con su trecena, la
 * veintena y su año (0059: cada uno el suyo). Cada nombre con sus palabras debajo.
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
  /* ═══ MOTOR 2 · 8-nov-2026 · 0058 ═══
     El año del Tonal empieza el día del solsticio de diciembre, y
     todo cambia a medianoche: el Tonal y el Xiuhtonal. El año del Tonal es
     una cuenta simple con los cargadores Toxtli, Akatl, Tekpatl y Kalli; el
     del Xiuhtonal lleva los de su era (abajo).

     El día del solsticio de cada año de 2000 a 2201, como «20 de diciembre
     más el dígito». Sale de la tabla del motor (`engine/solsticios`), y
     `paridad.mjs` revisa que la página diga lo mismo que el motor. */
  var SOLSTICIOS = '1112111211111111111111111111111111111111111101110111011101110111011101110111011100110011001100110011112211221122111211121112111211121112111211121111111111111111111111111111111111110111011101110111011112';
  /* ═══ MOTOR 5 · 10-nov-2026 · 0061 ═══
     Desde el 13-mar-1782 a las 06:45 el Xiuhpohualli es el del motor 1: un
     año de 365.25 días anclado al 15-mar-2026 a las 06:45 del reloj, cinco
     Nemontemi, y el Xiuhtonal cambia a la hora en que abrió su año. */
  var ANCLA_X = Date.UTC(2026, 2, 15, 6, 45);
  var ANIO_X = 365.25 * 86400000;
  var CARGADORES = ["Toxtli","Akatl","Tekpatl","Kalli"];

  var D1 = 86400000;
  var mod = function (a, n) { return ((a % n) + n) % n };
  /* El día juliano de una fecha del reloj de quien lee (0011). */
  var jd = function (y, m, d) { return Math.floor(Date.UTC(y, m, d) / D1) + 2440588 };
  var abreAnio = function (y) { return jd(y, 11, 20 + Number(SOLSTICIOS.charAt(y - 2000))) };


  var ms = Date.now();
  var hoy = new Date(ms);
  var j = jd(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
  /* El año del Tonal abrió en el solsticio de este diciembre o del anterior.
     Contado desde el día 0: el que abrió el 21-dic-2025 es el 13,780. */
  var y0 = hoy.getFullYear();
  if (abreAnio(y0) > j) y0--;
  var i = 13780 + (y0 - 2025);
  /* El año del Xiuhpohualli que corre a esta hora del reloj (0011): k = 0 es
     el que abrió el 15-mar-2026 a las 06:45. El día n, hasta el 364: el quinto
     Nemontemi dura hasta que abre el año siguiente. */
  var reloj = Date.UTC(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), hoy.getHours(), hoy.getMinutes());
  var k = Math.floor((reloj - ANCLA_X) / ANIO_X);
  var n = Math.min(364, Math.floor((reloj - (ANCLA_X + k * ANIO_X)) / D1));
  var nemDelAnio = 5;
  /* El año del Xiuhtonal contado desde el día 0: 13,780 el de la era de Atl. */
  var kX = 13780 + k;

  /* El Tonal, de corrido, a medianoche (0050). */
  var t = mod(j + 96, 260);
  var anio = (mod(i, 13) + 1) + ' ' + CARGADORES[mod(i, 4)];

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
  /* 14-nov · el glifo de la trecena y del año, junto a su nombre (Memo).
     Sin signo (los Nemontemi), se esconde. */
  var ponGlifo = function (id, signo) {
    var e = document.getElementById(id);
    if (!e) return;
    e.hidden = !signo;
    if (signo) e.src = 'assets/' + signo + '.png';
  };

  /* ═══ EL TONAL · lo de dentro ═══ */
  pon('tonal', nombre(t));
  pon('tonal-p', palabras(t));
  pon('tonal-trecena', nombre(trecena(t)));
  pon('tonal-trecena-p', palabras(trecena(t)));
  ponGlifo('tonal-trecena-g', TONALLI[mod(trecena(t), 20)]);

  /* ═══ EL XIUHTONAL · el mundo ═══
     Cuenta sólo los días de las veintenas: 360·i + n. En los Nemontemi se
     detiene (0058): no hay Xiuhtonal, y la columna lo dice. */
  var nem = n >= 360;
  /* 0061 · el Xiuhtonal del motor 1. */
  var x = mod(360 * k + n, 260);
  var glifoX = document.getElementById('glifo-xiuh');
  if (nem) {
    pon('xiuhtonal', 'Nemontemi ' + (n - 359));
    pon('xiuhtonal-p', ingles ? 'The Xiuhtonal stops' : 'El Xiuhtonal se detiene');
    pon('xiuh-trecena', '—');
    pon('xiuh-trecena-p', '');
    ponGlifo('xiuh-trecena-g', null);
    if (glifoX) glifoX.hidden = true;
  } else {
    pon('xiuhtonal', nombre(x));
    pon('xiuhtonal-p', palabras(x));
    pon('xiuh-trecena', nombre(trecena(x)));
    pon('xiuh-trecena-p', palabras(trecena(x)));
    ponGlifo('xiuh-trecena-g', TONALLI[mod(trecena(x), 20)]);
    if (glifoX) { glifoX.hidden = false; glifoX.src = 'assets/' + TONALLI[mod(x, 20)] + '.png'; }
  }
  pon('bajo', nem
    ? 'Nemontemi · día ' + (n - 359) + ' de ' + nemDelAnio
    : VEINTENAS[Math.floor(n / 20)] + ' · día ' + (mod(n, 20) + 1) + ' de 20');
  if (ingles) {
    var bajo = document.getElementById('bajo');
    if (bajo?.textContent) bajo.textContent = bajo.textContent.replace('día', 'day').replace(' de ', ' of ');
  }
  pon('bajo-p', VEINTENAS_P[ingles ? 'en' : 'es'][nem ? 18 : Math.floor(n / 20)]);

  /* Las dos capas del año (0059, Memo 8-nov): el Tonal lleva el año civil
     (Toxtli, Akatl, Tekpatl, Kalli); el Xiuhtonal, el año de su era de 1,144
     años, contada desde el cierre del primer atado. Cuenta los años del
     Xiuhpohualli (0061): la era de Atl abrió el 15-mar-2026 a las 06:45. */
  var era = Math.floor((kX - 52) / 1144);
  var xCarg = TONALLI[mod(mod(era - 4, 20) + 5 * mod(kX, 4), 20)];
  var xAnio = (mod(kX, 13) + 1) + ' ' + xCarg;
  pon('anio', xAnio); pon('anio-p', (mod(kX, 13) + 1) + ' ' + pal[TONALLI.indexOf(xCarg)]);
  pon('tonal-anio', anio); pon('tonal-anio-p', (mod(i, 13) + 1) + ' ' + pal[TONALLI.indexOf(CARGADORES[mod(i, 4)])]);
  ponGlifo('anio-g', xCarg);
  ponGlifo('tonal-anio-g', CARGADORES[mod(i, 4)]);
  pon('fecha-gregoriana', new Date(ms).toLocaleDateString(ingles ? 'en-US' : 'es-MX', { day: 'numeric', month: 'long', year: 'numeric' }));
  var tarjeta = document.getElementById('lectura-hoy');
  if (tarjeta) {
    /* La fecha de la tarjeta es la del Tonal: la local de hoy (0050). */
    tarjeta.dataset.fecha = [hoy.getFullYear(), String(hoy.getMonth() + 1).padStart(2, '0'), String(hoy.getDate()).padStart(2, '0')].join('-');
    tarjeta.dataset.tonal = (mod(t, 13) + 1) + ' ' + TONALLI[mod(t, 20)];
    /* 9-nov-2026 · y el Xiuhtonal, para la tarjeta hacia el mundo. Vacío en los Nemontemi. */
    tarjeta.dataset.xiuhtonal = nem ? '' : nombre(x);
    document.dispatchEvent(new Event('cuenta-actualizada'));
  }
  var glifo = document.getElementById('glifo-hoy');
  if (glifo) glifo.src = 'assets/' + TONALLI[mod(t, 20)] + '.png';
}
actualizaCuenta();
