/**
 * Contenido editorial de /calcula-tus-impuestos.
 *
 * Vive fuera del componente porque se usa dos veces: como texto visible en la
 * página y como FAQPage en JSON-LD. Una sola fuente evita que ambas versiones
 * se desalineen.
 */

export interface PreguntaFrecuente {
  pregunta: string;
  respuesta: string;
}

export const preguntasFrecuentes: ReadonlyArray<PreguntaFrecuente> = [
  {
    pregunta: "¿Cuánto es la UIT 2026 en el Perú?",
    respuesta:
      "La Unidad Impositiva Tributaria de 2026 es S/\u00A05,500 (Decreto Supremo 301-2025-EF). De ella salen todos los umbrales del impuesto: las 7 UIT libres son S/\u00A038,500, el tope de gastos deducibles de 3 UIT es S/\u00A016,500 y el primer tramo del 8\u00A0% llega hasta 5 UIT, es decir S/\u00A027,500 de renta neta.",
  },
  {
    pregunta: "¿Qué son las 7 UIT que no pagan impuesto?",
    respuesta:
      "Es el mínimo no imponible del Art. 46 de la Ley del Impuesto a la Renta: los primeros S/\u00A038,500 de renta neta de trabajo del año no tributan. En planilla, el empleador ya lo descuenta al proyectar tu retención mensual. Con recibo por honorarios se aplica recién en la declaración anual, por eso el 8\u00A0% que adelantas cada mes suele ser mayor que el impuesto real.",
  },
  {
    pregunta: "¿Cuál es la diferencia entre renta de cuarta y de quinta categoría?",
    respuesta:
      "Quinta categoría es el trabajo dependiente, en planilla: el empleador calcula y retiene el impuesto cada mes y tú no presentas declaraciones. Cuarta categoría es el trabajo independiente, con recibo por honorarios: tienes una deducción del 20\u00A0% de tus ingresos brutos (con tope de 24 UIT), adelantas el 8\u00A0% de cada pago y liquidas el impuesto real en la declaración anual.",
  },
  {
    pregunta: "¿Cuándo tengo que declarar el Formulario Virtual 616?",
    respuesta:
      "Cada mes en que tus ingresos por honorarios superen S/\u00A04,010 (RS 000390-2025/SUNAT) y no te hayan retenido el 8\u00A0% completo, dentro del cronograma de vencimientos que SUNAT fija según el último dígito de tu RUC. Se presenta en SUNAT Operaciones en Línea con Clave SOL y se paga ahí mismo o en un banco con el código de tributo 3041. Si proyectas ganar hasta S/\u00A048,125 en el año puedes pedir la suspensión y dejar de adelantar.",
  },
  {
    pregunta: "¿Qué gastos puedo deducir hasta 3 UIT?",
    respuesta:
      "Alquiler de vivienda (30\u00A0% del monto), honorarios de médicos y odontólogos (30\u00A0%), servicios de otros profesionales independientes (30\u00A0%), consumo en restaurantes, bares y hoteles (15\u00A0%) y los aportes a EsSalud de trabajadores del hogar (100\u00A0%). Cuentan solo con comprobante electrónico a tu nombre y pagados con tarjeta, transferencia u otro medio bancarizado. El total deducible tiene tope de 3 UIT, S/\u00A016,500 en 2026.",
  },
  {
    pregunta: "Me paga una empresa del exterior, ¿igual tributo en el Perú?",
    respuesta:
      "Sí. Si el trabajo se realiza en el Perú, el ingreso es renta de fuente peruana (Art. 9 de la Ley del Impuesto a la Renta) aunque el pagador esté afuera. Como un pagador no domiciliado no es agente de retención, nadie te descuenta nada: emites el recibo por honorarios, conviertes el monto con el tipo de cambio compra de la SBS del día en que lo recibiste y presentas el Formulario 616 tú mismo.",
  },
  {
    pregunta: "¿Me devuelven lo que adelanté de más?",
    respuesta:
      "Sí, pero solo si presentas la declaración anual, entre marzo y abril del año siguiente. Es el único momento en que se aplican las 7 UIT y los gastos de 3 UIT sobre lo que ya pagaste. A los trabajadores en planilla SUNAT les devuelve de oficio lo que tenga registrado; con recibo por honorarios la devolución se pide en la misma declaración.",
  },
];

export interface FuenteOficial {
  titulo: string;
  url: string;
  dominio: string;
  detalle: string;
}

export const fuentesOficiales: ReadonlyArray<FuenteOficial> = [
  {
    titulo: "Tipo de cambio SBS",
    url: "https://www.sbs.gob.pe/app/pp/SISTIP_PORTAL/Paginas/Publicacion/TipoCambioPromedio.aspx",
    dominio: "sbs.gob.pe",
    detalle: "Consulta por fecha. Para declarar se usa la columna Compra del día en que recibiste el pago.",
  },
  {
    titulo: "SUNAT Operaciones en Línea",
    url: "https://www.sunat.gob.pe/sol.html",
    dominio: "sunat.gob.pe",
    detalle: "Donde se presenta el Formulario Virtual 616 y se paga. Requiere Clave SOL.",
  },
  {
    titulo: "Cronograma de vencimientos 2026",
    url: "https://www.sunat.gob.pe/orientacion/cronogramas/2026/cObligacionMensual2026.html",
    dominio: "sunat.gob.pe",
    detalle: "Fecha límite de cada mes según el último dígito de tu RUC.",
  },
  {
    titulo: "Gastos deducibles 2026",
    url: "https://personas.sunat.gob.pe/devoluciones/gastos-deducibles-para-ano-2026",
    dominio: "personas.sunat.gob.pe",
    detalle: "La lista oficial de las 3 UIT adicionales y sus condiciones.",
  },
  {
    titulo: "Suspensión de retenciones",
    url: "https://personas.sunat.gob.pe/trabajador-independiente/suspension-retenciones",
    dominio: "personas.sunat.gob.pe",
    detalle: "Para dejar de adelantar el 8\u00A0% si proyectas ganar poco en el año.",
  },
  {
    titulo: "Cálculo de rentas de cuarta",
    url: "https://orientacion.sunat.gob.pe/3064-02-calculo-del-impuesto-por-rentas-de-cuarta-categoria",
    dominio: "orientacion.sunat.gob.pe",
    detalle: "La explicación de SUNAT del pago a cuenta y las deducciones.",
  },
];
