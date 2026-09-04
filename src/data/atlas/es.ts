/**
 * El atlas en español.
 *
 * No es la versión por defecto de la página: llega por `import()` recién
 * cuando alguien encuentra el easter egg, así que este archivo entero es un
 * chunk aparte que la mayoría de las visitas nunca descarga.
 *
 * El orden de las familias es deliberado: es el orden en que se toman las
 * decisiones al diseñar, de la más cara de revertir a la más operativa.
 */

import type {
  Atlas,
  Escalon,
  Estacion,
  Familia,
  Interfaz,
  Pregunta,
  Principio,
  Trampa,
} from "./tipos";

const ui: Interfaz = {
  idioma: "es",
  insignia: "Referencia de trabajo · en español",
  tituloPlano: "Atlas de",
  tituloAcento: "arquitectura",
  intro: {
    antes:
      "El mapa de decisiones que se toman antes de escribir la primera línea: qué patrones existen, dónde vive cada uno, qué cuesta y cuándo ",
    enfasis: "no",
    despues:
      " usarlo. No es una lista de cosas para agregar — es el vocabulario para discutir un diseño antes de implementarlo.",
  },
  cifras: [
    "Patrones y principios",
    "Familias",
    "Estaciones del camino",
    "Preguntas antes de codear",
  ],
  paraQue: [
    {
      titulo: "Qué es",
      texto:
        "Un catálogo de los patrones que existen, qué resuelve cada uno, qué cuesta y cuándo no usarlo.",
    },
    {
      titulo: "Para qué",
      texto:
        "Para que la decisión de diseño sea explícita antes del código, en vez de tomarse por omisión.",
    },
    {
      titulo: "Cómo se lee",
      texto:
        "Buscá la estación donde duele, entrá a la familia, leé la ficha. Después contestá las diez preguntas.",
    },
    {
      titulo: "Qué no es",
      texto:
        "Una lista de cosas para agregar. La mitad del atlas existe para justificar no usar la otra mitad.",
    },
  ],
  indice: {
    etiqueta: "Secciones del atlas",
    mapa: "Mapa",
    escalera: "Escalera",
    principios: "07 · Principios",
    trampas: "Trampas",
    preguntas: "Las 10 preguntas",
  },
  mapa: {
    etiqueta: "El mapa",
    titulo: "Dónde vive cada patrón",
    bajada:
      "Casi todo lo que entra a un sistema recorre las mismas seis estaciones. Cada patrón pertenece a una: si sabés en qué estación duele, sabés en qué familia buscar.",
    pie: "Las estaciones no son opcionales: un evento las atraviesa todas, aunque una esté vacía. Una estación vacía no es una estación que no existe — es una decisión que nadie tomó, y se nota recién con carga.",
    svg: {
      alt: "El camino de un evento externo por seis estaciones: origen, borde, amortiguador y trabajo en fila, y desde el trabajo dos ramas, una hacia el estado y otra hacia la salida a terceros. Cada estación lista los patrones que viven en ella.",
      titulo: "El camino de un evento externo",
      subtitulo: "de un webhook de un tercero hasta el dato ya indexado",
      verbos: ["empuja", "acepta", "entrega", "escribe", "llama a terceros"],
      transversal1: "atraviesan las seis: observabilidad (traza, métrica, log)",
      transversal2: "feature flags · idempotencia · contratos versionados",
    },
  },
  escalera: {
    etiqueta: "La escalera",
    titulo: "Acoplamiento: cada escalón compra durabilidad y cobra operación",
    bajada:
      "La discusión «¿lo hacemos asíncrono?» casi nunca es binaria. Son seis escalones, y el trabajo del diseño es elegir cuál, no subir hasta arriba porque suena moderno.",
    pie: {
      antes: "La línea punteada es la única frontera que importa de verdad: ",
      enfasis: "a su izquierda el trabajo vive en la memoria de un proceso",
      despues:
        " y desaparece con un reinicio, un OOM o un redeploy. Subir un escalón de más cuesta operación real; quedarse abajo cuando el negocio no tolera perder el evento cuesta un incidente.",
    },
    svg: {
      alt: "Escalera de seis escalones que sube de izquierda a derecha: llamada síncrona directa, más timeout y reintento, más circuit breaker, cola de trabajo durable, evento publicado y workflow durable. Una línea vertical punteada entre el tercer y el cuarto escalón marca la frontera de durabilidad: a la izquierda el trabajo muere con el proceso.",
      ejeY: "↑ lo que sobrevive a una caída",
      ejeX: "lo que cuesta operarlo →",
      frontera: "FRONTERA DE DURABILIDAD",
      fronteraPie:
        "a la izquierda, el trabajo vive en memoria y muere con el proceso",
    },
    tabla: [
      "Escalón",
      "Qué sobrevive",
      "Qué pagás",
      "Cuándo es la respuesta correcta",
    ],
  },
  familiaPrefijo: "Familia",
  principios: {
    etiqueta: "Familia 07",
    titulo: "Principios",
    complemento: "— lo que aplica aunque no elijas ningún patrón",
    bajada:
      "Los patrones se eligen; los principios se respetan. Son los que aparecen una y otra vez en las revisiones de código.",
  },
  trampas: {
    etiqueta: "Antipatrones",
    titulo: "Trampas: patrones que se eligen sin darse cuenta",
    bajada:
      "Un antipatrón casi nunca se elige a propósito. Aparece por omisión, cuando nadie hizo la pregunta. Estos son los que más caro salen.",
  },
  preguntas: {
    etiqueta: "El checklist",
    titulo: "Las diez preguntas, antes de abrir el editor",
    bajada:
      "Diez respuestas escritas, de una o dos líneas cada una. Si una respuesta es «no sé», medirla es lo primero que hay que hacer.",
    cierre:
      "El objetivo no es ceremonia. Es que la conversación de arquitectura ocurra antes del código y quede escrita, para que dentro de seis meses se pueda leer por qué el sistema es como es.",
    remate:
      "Ninguna de estas diez preguntas es cara de contestar. Todas son carísimas de contestar tarde.",
  },
  egg: {
    tecla: "e",
    invitacion: "para leerlo en inglés",
    instruccion:
      "Leer este atlas en inglés: pulsá la tecla E cinco veces, o tocá estas cinco teclas.",
    anuncio: "El atlas está ahora en español.",
  },
};

const familias: ReadonlyArray<Familia> = [
  {
    id: "forma",
    numero: "01",
    titulo: "Forma del sistema",
    abrev: "Forma",
    pregunta: "¿por dónde corto?",
    intro:
      "Decide qué se despliega junto y qué por separado. Es la decisión más cara de revertir de todo el atlas: cortar mal cuesta años, no sprints.",
    patrones: [
      {
        nombre: "Monolito",
        que: "Todo en un despliegue. Una transacción, un log, un deploy: la opción correcta hasta que el dominio o el equipo no entran en una cabeza.",
        trampa: "Se abandona demasiado pronto, casi siempre por moda.",
      },
      {
        nombre: "Monolito modular",
        que: "Un despliegue, pero con fronteras internas duras entre módulos: nadie importa el interior del vecino.",
        trampa:
          "Si las fronteras no se hacen cumplir con tooling, se disuelven en seis meses.",
      },
      {
        nombre: "Microservicios",
        que: "Un servicio por capacidad de negocio, con su base y su ciclo de despliegue propio.",
        trampa:
          "Paga red, observabilidad distribuida y consistencia eventual. Sin equipos que los operen, es coste sin beneficio.",
      },
      {
        nombre: "Bounded context (DDD)",
        que: "El límite del modelo es el límite del servicio: «pedido» en ventas y «pedido» en logística son dos cosas distintas y está bien.",
      },
      {
        nombre: "Puertos y adaptadores",
        que: "El dominio define interfaces; la infraestructura las implementa. Cambiar Postgres por otra cosa no toca la lógica.",
        trampa: "En un CRUD chico agrega tres capas para nada.",
      },
      {
        nombre: "Clean / Onion",
        que: "Las dependencias apuntan siempre hacia adentro. El núcleo no sabe que existe un framework.",
      },
      {
        nombre: "Capas (n-tier)",
        que: "Presentación, aplicación, datos. Simple y conocido por todos.",
        trampa:
          "Un cambio de negocio toca las tres capas: la cohesión queda repartida.",
      },
      {
        nombre: "Vertical slice",
        que: "Organizar por caso de uso completo en vez de por capa técnica. Un feature vive en una carpeta.",
      },
      {
        nombre: "Microkernel / plugin",
        que: "Un núcleo mínimo más extensiones cargables. Sirve cuando la variabilidad es por cliente o por canal.",
      },
      {
        nombre: "Pipes and filters",
        que: "Etapas encadenadas que transforman un flujo, cada una ignorante de las demás. Un pipeline de transcodificación o de indexación es esto.",
      },
      {
        nombre: "Serverless / FaaS",
        que: "La unidad de despliegue es la función y escala a cero.",
        trampa:
          "Arranque en frío, límites de tiempo y una factura que sorprende con tráfico sostenido.",
      },
      {
        nombre: "Arquitectura por celdas",
        que: "Copias completas del stack por grupo de clientes. El radio de explosión de una falla es la celda, no el sistema entero.",
        trampa:
          "Lo más caro de la lista: cada celda es infraestructura, despliegue y monitoreo aparte.",
      },
      {
        nombre: "Micro-frontends",
        que: "El front partido por dominio, cada parte con su equipo y su despliegue.",
        trampa:
          "Duplica bundle y rompe la consistencia visual si no hay design system.",
      },
      {
        nombre: "SOA con bus",
        que: "Servicios grandes hablando por un bus central que además transforma y rutea.",
        trampa:
          "El bus se vuelve el monolito nuevo, y ahí vive toda la lógica que nadie quiso ubicar.",
      },
      {
        nombre: "Space-based",
        que: "Grid de memoria compartida replicada, sin base en el camino crítico. Para picos extremos y previsibles.",
      },
    ],
  },
  {
    id: "hablan",
    numero: "02",
    titulo: "Cómo se hablan",
    abrev: "Conversación",
    pregunta: "¿quién espera a quién?",
    intro:
      "Una vez cortado el sistema, hay que decidir la forma de cada conversación. Casi todos los incidentes distribuidos nacen acá: alguien esperaba una respuesta que nunca llegó.",
    patrones: [
      {
        nombre: "Request / response",
        que: "REST o gRPC: el llamador bloquea hasta la respuesta. Directo de razonar y de depurar.",
        trampa:
          "Encadenar seis saltos síncronos multiplica las probabilidades de fallo, no las promedia.",
      },
      {
        nombre: "Cola de trabajo",
        que: "Punto a punto: un productor deja la tarea, un consumidor de un grupo la toma. Absorbe picos por diseño.",
      },
      {
        nombre: "Publicar / suscribir",
        que: "El emisor anuncia un hecho y no sabe quién escucha. Sumar consumidores no toca al productor.",
        trampa: "Nadie sabe quién depende de qué hasta que rompés el contrato.",
      },
      {
        nombre: "Log de eventos",
        que: "El evento persiste y se relee: consumidores nuevos pueden empezar desde el principio, y uno lento no bloquea al resto.",
      },
      {
        nombre: "Orquestación",
        que: "Un componente dicta el orden de los pasos. Fácil de ver, fácil de auditar, fácil de arreglar.",
        trampa: "El orquestador acumula lógica de negocio de todos.",
      },
      {
        nombre: "Coreografía",
        que: "Cada servicio reacciona a eventos, sin cerebro central. Máximo desacople.",
        trampa: "Nadie puede dibujar el flujo completo, y depurar es arqueología.",
      },
      {
        nombre: "Saga",
        que: "Una transacción de negocio larga partida en pasos locales, cada uno con su compensación para deshacer.",
        trampa:
          "Compensar no es hacer rollback: el mundo ya vio el estado intermedio.",
      },
      {
        nombre: "API gateway",
        que: "Una sola puerta de entrada que concentra auth, rate limit, ruteo y observabilidad del borde.",
      },
      {
        nombre: "Backend for frontend",
        que: "Un backend por tipo de cliente, que arma exactamente la respuesta que esa pantalla necesita.",
      },
      {
        nombre: "Sidecar",
        que: "Un proceso acompañante que aporta capacidades transversales (TLS, métricas, proxy) sin tocar el código del servicio.",
      },
      {
        nombre: "Ambassador",
        que: "El sidecar que habla por vos hacia afuera: concentra reintentos, timeouts y breakers de las llamadas salientes.",
      },
      {
        nombre: "Service mesh",
        que: "Sidecars más un plano de control: mTLS, políticas de tráfico y reintentos declarados fuera del código.",
        trampa:
          "Una pieza de infraestructura entera. No se adopta para tres servicios.",
      },
      {
        nombre: "Capa anticorrupción",
        que: "Un traductor en el borde que convierte el modelo ajeno al tuyo, para que el vocabulario del proveedor o del ERP no se filtre al dominio.",
      },
      {
        nombre: "Strangler fig",
        que: "Lo nuevo va comiendo rutas del viejo detrás del mismo borde, hasta que el viejo queda sin tráfico y se apaga.",
      },
      {
        nombre: "Webhooks",
        que: "El tercero te empuja el hecho apenas ocurre. Barato y en tiempo real.",
        trampa:
          "Vos no controlás el caudal. Sin límite y sin dedupe, el tercero decide tu capacidad.",
      },
      {
        nombre: "Change data capture",
        que: "Los cambios del log de la base se publican como eventos, sin tocar el código que escribe.",
        trampa: "Acopla a los consumidores al esquema físico de la tabla.",
      },
      {
        nombre: "Claim check",
        que: "Por el mensaje viaja una referencia, no el payload pesado: el contenido queda en un almacén y el consumidor lo busca si lo necesita.",
      },
      {
        nombre: "Contract testing",
        que: "El contrato entre dos servicios se verifica en CI en vez de confiarse. Rompe el PR, no producción.",
      },
      {
        nombre: "Agregación en el gateway",
        que: "El borde junta varias llamadas internas en una respuesta, para que el cliente no haga seis viajes.",
      },
      {
        nombre: "Polling y long polling",
        que: "Cuando no hay webhook: vos decidís el ritmo, y eso ya es control de caudal gratis.",
        trampa:
          "Latencia contra costo, y hay que llevar un cursor que no se pierda.",
      },
    ],
  },
  {
    id: "datos",
    numero: "03",
    titulo: "Datos",
    abrev: "Datos",
    pregunta: "¿quién es el dueño y qué se puede perder?",
    intro:
      "Acá se decide qué verdad es única y qué verdad puede ir con retraso. La mayoría de los bugs raros de producción son una respuesta implícita a esta pregunta.",
    patrones: [
      {
        nombre: "Base por servicio",
        que: "Un solo servicio escribe una tabla; el resto pide por API. El esquema deja de ser un contrato público.",
      },
      {
        nombre: "Base compartida",
        que: "Varios servicios leyendo y escribiendo el mismo esquema. Rapidísimo hoy.",
        trampa:
          "Cualquier migración pasa a ser un despliegue coordinado de todos. Es el monolito distribuido por la puerta de atrás.",
      },
      {
        nombre: "CQRS",
        que: "El modelo con el que escribís y el modelo con el que leés son distintos y evolucionan por separado.",
      },
      {
        nombre: "Event sourcing",
        que: "El estado no se guarda: se deriva de la secuencia de hechos. Te queda la historia completa y auditable, gratis.",
        trampa:
          "Versionar eventos viejos es para siempre. No se adopta «por si acaso».",
      },
      {
        nombre: "Vista materializada",
        que: "Una lectura precalculada y desnormalizada para responder barato la consulta cara.",
        trampa:
          "Toda vista necesita una respuesta escrita a «¿quién la reconstruye y cuándo?».",
      },
      {
        nombre: "Cache-aside",
        que: "Leo la caché; si no está, voy a la fuente y la lleno. El patrón de caché por defecto.",
        trampa: "La invalidación es el problema, no el llenado.",
      },
      {
        nombre: "Write-through / write-behind",
        que: "La escritura pasa por la caché: sincrónica (consistente y lenta) o diferida (rápida y con riesgo de pérdida).",
      },
      {
        nombre: "Sharding",
        que: "Partir por clave — cliente, región — para que ninguna instancia cargue con todo.",
        trampa:
          "Elegir mal la clave se paga con una migración de datos, no con un refactor.",
      },
      {
        nombre: "Réplicas de lectura",
        que: "Escalar lecturas separándolas de la escritura.",
        trampa:
          "El lag de replicación hace que un usuario no vea lo que acaba de guardar.",
      },
      {
        nombre: "Persistencia políglota",
        que: "Cada dato en el motor que le sirve: relacional para transacciones, documento para flexible, índice para búsqueda.",
        trampa:
          "Cada motor extra es un backup, un monitoreo y una expertise más.",
      },
      {
        nombre: "Outbox transaccional",
        que: "El evento se escribe en la misma transacción que el estado, y un relay lo publica después. Resuelve el «guardé pero no avisé».",
      },
      {
        nombre: "Consumidor idempotente",
        que: "El receptor lleva registro de los ids ya procesados, así que recibir dos veces el mismo mensaje no hace nada la segunda.",
      },
      {
        nombre: "Clave de idempotencia",
        que: "El llamador nombra la operación, así que reintentarla es seguro. Sin esto, el escalón 02 de la escalera duplica cobros.",
      },
      {
        nombre: "Bloqueo optimista (etag / versión)",
        que: "Escribo diciendo qué versión leí; si cambió, me rechaza. Dos ediciones concurrentes no se pisan en silencio.",
      },
      {
        nombre: "Lock distribuido",
        que: "Un solo proceso a la vez sobre un recurso.",
        trampa:
          "Necesita TTL y dueño: un lock sin vencimiento es una caída esperando su turno.",
      },
      {
        nombre: "Snapshot",
        que: "Un corte periódico del estado para no releer diez años de eventos en cada arranque.",
      },
      {
        nombre: "Commit en dos fases",
        que: "Transacción atómica entre dos sistemas.",
        trampa:
          "Casi siempre la respuesta incorrecta entre servicios: bloquea, no escala y falla feo. La alternativa es saga.",
      },
      {
        nombre: "Consistencia eventual",
        que: "Los datos convergen, no coinciden al instante. Es la respuesta correcta cada vez que el negocio la tolera — y la tolera más seguido de lo que creemos.",
      },
      {
        nombre: "Append-only y auditoría",
        que: "No se pisa: se agrega. Investigar un incidente deja de depender de que alguien haya loggeado lo correcto.",
      },
      {
        nombre: "Plano analítico separado",
        que: "Los reportes no se calculan sobre la base operativa. Un query pesado deja de poder tumbar el producto.",
      },
    ],
  },
  {
    id: "resiliencia",
    numero: "04",
    titulo: "Resiliencia y control de caudal",
    abrev: "Resiliencia",
    pregunta: "¿qué pasa cuando entra 100×?",
    intro:
      "Todos estos patrones contestan la misma pregunta desde ángulos distintos: ¿qué hago con el trabajo que no puedo atender ahora? Las respuestas honestas son cuatro: encolarlo, rechazarlo, degradarlo o caerse. No decidir es elegir la cuarta.",
    patrones: [
      {
        nombre: "Timeout",
        que: "Nada espera para siempre. Es el patrón más barato del atlas y el que más veces falta.",
        trampa:
          "El timeout del cliente debe ser menor que el del que lo llama, o la cadena entera se cuelga igual.",
      },
      {
        nombre: "Reintento con backoff y jitter",
        que: "Esperar cada vez más, con ruido aleatorio, para no volver todos juntos.",
        trampa:
          "Sin jitter mil clientes reintentan en el mismo milisegundo y vos mismo reconstruís la caída.",
      },
      {
        nombre: "Presupuesto de reintentos",
        que: "Un tope global: si más del N % del tráfico son reintentos, se cortan. Impide que la capa de resiliencia sea el ataque.",
      },
      {
        nombre: "Circuit breaker",
        que: "Tras N fallos abre el circuito y falla rápido sin ir a la red; después deja pasar una prueba para ver si volvió.",
      },
      {
        nombre: "Bulkhead",
        que: "Compartimentos estancos: pools, colas o pods separados por tipo de trabajo, para que un vecino ruidoso no hunda el barco.",
      },
      {
        nombre: "Rate limiting",
        que: "Cuánto dejo entrar por unidad de tiempo. Token bucket tolera ráfagas, leaky bucket alisa, ventana deslizante es la más justa y la más cara.",
      },
      {
        nombre: "Cuota por inquilino",
        que: "El límite se aplica por cliente, no global. Uno solo deja de poder consumir la capacidad de todos.",
        trampa:
          "Un límite global protege al servicio y no protege a los clientes entre sí.",
      },
      {
        nombre: "Load shedding",
        que: "Cuando no doy abasto, tiro por la borda a propósito lo menos valioso y protejo lo crítico. Rechazar rápido es mejor servicio que aceptar y morir.",
      },
      {
        nombre: "Backpressure",
        que: "Decirle al que empuja que afloje, en vez de aceptar y acumular en memoria hasta el OOM.",
      },
      {
        nombre: "Nivelación por cola",
        que: "La cola absorbe el pico y el consumidor trabaja a ritmo constante. Convierte un problema de capacidad en uno de latencia.",
      },
      {
        nombre: "Cola de mensajes muertos",
        que: "Lo que falló N veces sale de la fila: no se pierde ni bloquea al resto, y queda a la vista para arreglarlo.",
      },
      {
        nombre: "Deduplicación",
        que: "El mismo hecho dos veces no cuenta dos veces. Sin esto, cualquier reintento del proveedor multiplica tu trabajo.",
      },
      {
        nombre: "Coalescing de peticiones",
        que: "Mil pedidos iguales llegando juntos se resuelven con una sola llamada al origen. Mata la estampida de caché fría.",
      },
      {
        nombre: "Degradación elegante",
        que: "Responder algo útil cuando lo ideal no está: el dato de caché viejo, la lista sin ordenar, la respuesta genérica.",
      },
      {
        nombre: "Fail closed / fail open",
        que: "Cuando el chequeo no puede correr: ¿dejo pasar o bloqueo? Las dos son válidas; lo inaceptable es que sea un accidente.",
        trampa:
          "Un bloqueo de credenciales que falla abierto no está bloqueando nada.",
      },
      {
        nombre: "Health checks",
        que: "Liveness dice si hay que reiniciarme; readiness si puedo recibir tráfico. Confundirlas provoca reinicios en cascada.",
      },
      {
        nombre: "Apagado elegante",
        que: "Dejar de aceptar, terminar lo que hay en vuelo, cerrar. Sin esto, cada deploy pierde el trabajo en curso.",
      },
      {
        nombre: "Failover",
        que: "Una réplica lista para tomar el lugar. Vale exactamente lo que valga el último simulacro que se hizo.",
      },
      {
        nombre: "Chaos engineering",
        que: "Romperlo a propósito en horario laboral, para no descubrirlo un domingo.",
      },
    ],
  },
  {
    id: "tiempo",
    numero: "05",
    titulo: "Trabajo en el tiempo",
    abrev: "Tiempo",
    pregunta: "¿quién lo hace y qué pasa si muere a mitad?",
    intro:
      "Todo lo que no se resuelve dentro del request vive acá. La pregunta que ordena la familia es una sola: si el proceso se reinicia justo ahora, ¿alguien se entera y alguien lo termina?",
    patrones: [
      {
        nombre: "Pool de consumidores",
        que: "Varios workers compiten por la misma cola; escalar es sumar workers. El caballito de batalla del procesamiento asíncrono.",
      },
      {
        nombre: "Ejecución durable",
        que: "El estado del workflow se persiste paso a paso: sobrevive al reinicio del worker y continúa donde iba, con reintentos por actividad. Temporal es la implementación conocida.",
      },
      {
        nombre: "Trabajo en segundo plano en memoria",
        que: "Lanzar la tarea en el mismo proceso web y contestar 200. Parece una cola y no lo es.",
        trampa:
          "Muere con el pod, no tiene reintento ni visibilidad. Es el origen de la mayoría de las pérdidas silenciosas de trabajo.",
      },
      {
        nombre: "Scheduler / agent / supervisor",
        que: "Alguien vigila lo que quedó a medias y lo reencola o lo compensa. La red de seguridad de todo lo demás.",
      },
      {
        nombre: "Fan-out / fan-in",
        que: "Partir un trabajo en N paralelos y esperar a que vuelvan todos. Ojo con multiplicar la carga sobre el que está abajo.",
      },
      {
        nombre: "Bucle de reconciliación",
        que: "Comparar periódicamente el estado deseado contra el real y corregir la diferencia. Es lo único que te salva cuando todos los eventos se perdieron.",
      },
      {
        nombre: "Debounce por entidad",
        que: "Veinte cambios del mismo producto en un minuto se colapsan en una sola reindexación.",
        trampa:
          "Medilo antes de descartarlo: es habitual que la mayoría de las reindexaciones no cambien nada, y eso es trabajo puro para tirar.",
      },
      {
        nombre: "Lote y micro-lote",
        que: "Agrupar N operaciones en una llamada. Mejora muchísimo el throughput y empeora la latencia individual.",
      },
      {
        nombre: "Cola con prioridad",
        que: "Lo urgente no espera detrás de la carga masiva de anoche.",
        trampa: "Sin un piso de servicio, lo de baja prioridad no se procesa nunca.",
      },
      {
        nombre: "Elección de líder",
        que: "Un único responsable entre varias réplicas para las tareas que no se pueden duplicar.",
      },
      {
        nombre: "Cron idempotente",
        que: "Un job programado que se puede correr dos veces sin daño. Porque tarde o temprano se va a correr dos veces.",
      },
      {
        nombre: "Cursor con checkpoint",
        que: "Guardar hasta dónde llegué, para retomar sin releer todo ni saltear nada.",
      },
      {
        nombre: "Ventanas de tiempo",
        que: "Agregar eventos por ventana fija o deslizante. La base de cualquier métrica sobre un flujo continuo.",
      },
      {
        nombre: "Barrido de compensación",
        que: "Un job que busca lo que quedó inconsistente y lo arregla. Menos elegante que un diseño perfecto y mucho más barato.",
      },
    ],
  },
  {
    id: "entrega",
    numero: "06",
    titulo: "Entrega y operación",
    abrev: "Entrega",
    pregunta: "¿cómo lo prendo, lo apago y me entero?",
    intro:
      "Un patrón que no se puede apagar sin desplegar, ni observar sin entrar por SSH, no está terminado. Esta familia es la mitad no negociable de cualquier diseño.",
    patrones: [
      {
        nombre: "Desplegar ≠ publicar",
        que: "El código llega apagado y se prende aparte. Separa el riesgo técnico del riesgo de producto.",
      },
      {
        nombre: "Feature flags",
        que: "Banderas tipadas y declaradas: release y experiment con vencimiento, killswitch y operational permanentes.",
      },
      {
        nombre: "Killswitch",
        que: "Apagar la funcionalidad en segundos sin desplegar. Lo primero que se busca en un incidente y lo último que se implementa.",
      },
      {
        nombre: "Canary",
        que: "Mandar 1 % del tráfico a la versión nueva y mirar las métricas antes de seguir.",
      },
      {
        nombre: "Blue-green",
        que: "Dos entornos completos y un switch de tráfico. Volver atrás es instantáneo.",
      },
      {
        nombre: "Rolling update",
        que: "Reemplazar pods de a poco. Exige que dos versiones convivan hablando el mismo contrato.",
      },
      {
        nombre: "Shadow traffic",
        que: "Copiar tráfico real a la versión nueva sin usar su respuesta. Testeás con carga real sin arriesgar a nadie.",
      },
      {
        nombre: "Expand / contract",
        que: "Migración de esquema en tres pasos: agregar lo nuevo, escribir en ambos, retirar lo viejo. Nunca un cambio destructivo en un solo deploy.",
      },
      {
        nombre: "Doble escritura y backfill",
        que: "Escribir en los dos lados mientras se rellena el histórico con un job idempotente y reanudable.",
      },
      {
        nombre: "Versionado de contratos",
        que: "Agregar campos opcionales, jamás cambiar el significado de uno existente. Los consumidores viejos siguen vivos.",
        trampa:
          "Un literal en un payload puede estar siendo protocolo para alguien.",
      },
      {
        nombre: "Observabilidad: los tres",
        que: "Trazas (dónde), métricas (cuánto), logs (qué decía). Con dos no alcanza.",
        trampa: "Un rechazo silencioso no aparece en ningún panel.",
      },
      {
        nombre: "SLO y presupuesto de error",
        que: "Un número acordado de cuánto puede fallar. Convierte «anda lento» en una decisión con umbral.",
      },
      {
        nombre: "Alerta sobre síntoma",
        que: "Alertar sobre lo que sufre el usuario, no sobre CPU. Una métrica nueva sin alerta es un panel que nadie mira.",
      },
      {
        nombre: "Infra como código",
        que: "El entorno se reconstruye desde el repo. Si un cambio de infra no está en un diff, no existe.",
      },
      {
        nombre: "Runbook",
        que: "Qué mirar y qué hacer, escrito antes del incidente. En el incidente nadie diseña nada.",
      },
    ],
  },
];

/**
 * La séptima familia tiene otra forma: no se elige, se respeta. Por eso va en
 * su propia lista y se pinta más compacta.
 */
const principios: ReadonlyArray<Principio> = [
  {
    nombre: "SRP",
    que: "Una clase, una razón para cambiar. Si dos áreas de negocio la tocan, son dos clases.",
  },
  {
    nombre: "OCP",
    que: "Abierto a extensión, cerrado a modificación. Agregar un caso no debería exigir editar el match de todos.",
  },
  {
    nombre: "LSP",
    que: "Una implementación debe poder reemplazar a su interfaz sin sorpresas para el que la usa.",
  },
  {
    nombre: "ISP",
    que: "Mejor varias interfaces chicas que una gorda que obliga a implementar lo que no usás.",
  },
  {
    nombre: "DIP",
    que: "Dependé de abstracciones, no de la implementación concreta. Es el motor de puertos y adaptadores.",
  },
  {
    nombre: "Cohesión y acoplamiento",
    que: "Lo que cambia junto vive junto; lo que no, se separa. Resume media lista de arriba.",
  },
  {
    nombre: "Separación de intereses",
    que: "Negocio, transporte y persistencia no comparten función.",
  },
  {
    nombre: "KISS",
    que: "La solución más simple que resuelve el problema real de hoy.",
  },
  {
    nombre: "YAGNI",
    que: "No lo construyas hasta que haga falta. Casi toda la flexibilidad que se anticipa no se usa nunca.",
  },
  {
    nombre: "DRY, con cuidado",
    que: "No repitas conocimiento. Dos códigos parecidos que cambian por razones distintas no son duplicación.",
  },
  {
    nombre: "Composición sobre herencia",
    que: "Armar comportamiento juntando piezas envejece mejor que heredarlo.",
  },
  {
    nombre: "Inyección de dependencias",
    que: "Recibir lo que necesitás en vez de construirlo. Es lo que hace testeable el dominio.",
  },
  {
    nombre: "Fail fast",
    que: "Validar en el borde y explotar temprano, con un mensaje que diga qué faltó.",
  },
  {
    nombre: "Mínima sorpresa",
    que: "Que se comporte como el nombre promete. Vale para funciones y para endpoints.",
  },
  {
    nombre: "Inmutabilidad",
    que: "Lo que no cambia no genera condiciones de carrera.",
  },
  {
    nombre: "Idempotencia",
    que: "Hacerlo dos veces da lo mismo que una. Es el requisito de casi todo lo distribuido.",
  },
  {
    nombre: "ACID",
    que: "Atómico, consistente, aislado, durable. Lo que te da una transacción dentro de una base.",
  },
  {
    nombre: "BASE",
    que: "Disponible y con estado blando, consistente al final. Lo que te queda cuando cruzás servicios.",
  },
  {
    nombre: "CAP",
    que: "Con la red partida elegís consistencia o disponibilidad. No es opcional elegir.",
  },
  {
    nombre: "PACELC",
    que: "Y si no hay partición, seguís eligiendo: latencia o consistencia. La versión honesta de CAP.",
  },
  {
    nombre: "12-factor",
    que: "Config por entorno, procesos sin estado, logs a stdout, paridad dev/prod.",
  },
  {
    nombre: "Ley de Conway",
    que: "El sistema termina con la forma del organigrama. Si no te gusta el corte, mirá los equipos.",
  },
  {
    nombre: "Las 8 falacias",
    que: "La red no es confiable, ni tiene latencia cero, ni ancho de banda infinito, ni es segura, ni la topología es fija.",
  },
  {
    nombre: "Ley de Demeter",
    que: "Hablá con tus vecinos, no con los amigos de tus vecinos.",
  },
  {
    nombre: "El principio del límite",
    que: "Todo recurso compartido — memoria, conexiones, cola — necesita un tope explícito. Lo ilimitado se agota.",
  },
  {
    nombre: "Menor asombro operativo",
    que: "Si para entender qué pasó hay que leer código, falta un log o una métrica.",
  },
];

const trampas: ReadonlyArray<Trampa> = [
  {
    nombre: "Monolito distribuido",
    que: "Servicios separados que igual hay que desplegar juntos, porque comparten esquema o contrato. Pagás el precio de los microservicios sin ninguno de sus beneficios.",
  },
  {
    nombre: "Integración por base de datos",
    que: "Un servicio lee la tabla de otro «porque es más rápido». Convierte cada migración en una negociación entre equipos.",
  },
  {
    nombre: "Trabajo de fondo sin durabilidad",
    que: "Contestar 200 y procesar en memoria. Un redeploy, un OOM o un reinicio y el trabajo se evaporó sin que nadie se entere.",
  },
  {
    nombre: "Cadena síncrona larga",
    que: "Seis saltos donde cada uno espera al siguiente. Las disponibilidades se multiplican: seis servicios al 99.9 % dan 99.4 %.",
  },
  {
    nombre: "Reintento sin tope ni jitter",
    que: "La estampida que vos mismo construís. Un servicio que se estaba recuperando se vuelve a caer con la primera oleada de reintentos.",
  },
  {
    nombre: "Cola sin cola de muertos",
    que: "Un mensaje venenoso reintenta para siempre y bloquea a los que vienen atrás. La cola sana se muere por uno solo.",
  },
  {
    nombre: "Webhook sin deduplicación",
    que: "Todo proveedor reenvía ante la duda. Sin dedupe, su política de reintentos se convierte en tu factura de cómputo.",
  },
  {
    nombre: "Límite sin panel ni alerta",
    que: "Un rate limit que rechaza en silencio protege al servicio y le oculta al equipo que alguien quedó afuera. El 429 invisible es una falla que no existe hasta que un cliente llama.",
  },
  {
    nombre: "Recurso sin tope",
    que: "Una cola en memoria, un pool de conexiones o una lista que crece sin límite. Siempre termina en el mismo lugar.",
  },
  {
    nombre: "Caché sin invalidación pensada",
    que: "Se agrega para arreglar la latencia y se convierte en una fuente de verdad paralela que nadie sabe cuándo caduca.",
  },
  {
    nombre: "Servicio-dios",
    que: "Ese que hay que tocar en cada feature. Es un monolito con latencia de red.",
  },
  {
    nombre: "Patrón elegido por CV",
    que: "Kafka porque es Kafka, microservicios porque son microservicios. La pregunta que lo desarma es siempre la misma: ¿qué problema medido resuelve?",
  },
];

const preguntas: ReadonlyArray<Pregunta> = [
  {
    pregunta: "¿Cuánto entra, en el pico?",
    porQue:
      "Eventos por segundo en el peor minuto, no el promedio del mes. Sin volumetría medida, todo lo demás es opinión.",
  },
  {
    pregunta: "¿Qué pasa si el de al lado no contesta?",
    porQue:
      "Timeout, reintento con jitter, breaker o degradación. Elegir una es obligatorio; «no pasa nada» no es una respuesta.",
  },
  {
    pregunta: "¿Qué pasa si el mismo mensaje llega dos veces?",
    porQue:
      "Si la respuesta no es «nada», falta idempotencia. Y va a llegar dos veces.",
  },
  {
    pregunta: "¿Dónde vive el trabajo si el proceso muere a mitad?",
    porQue:
      "Si vive en RAM, se pierde. Mirá la escalera y decidí en qué escalón estás parado.",
  },
  {
    pregunta: "¿Esto tiene que ser síncrono?",
    porQue:
      "¿Quién espera la respuesta y qué hace con ella? Si nadie la mira, el llamador no debería estar esperando.",
  },
  {
    pregunta: "¿Quién es el dueño de este dato?",
    porQue:
      "Un solo servicio escribe; el resto pide. Si dos escriben, hay un conflicto esperando su turno.",
  },
  {
    pregunta: "¿Cómo me entero de que se rompió?",
    porQue:
      "Traza, métrica, alerta — y un panel donde se vea lo que se rechaza, no solo lo que se procesa.",
  },
  {
    pregunta: "¿Cómo lo apago sin desplegar?",
    porQue:
      "Feature flag o killswitch declarado. Un cambio visible al usuario sin bandera no sale.",
  },
  {
    pregunta: "¿Cómo lo revierto?",
    porQue:
      "Migración en expand-contract, contrato compatible hacia atrás, versión anterior que aún entiende los datos nuevos.",
  },
  {
    pregunta: "¿Qué es lo más simple que funciona?",
    porQue:
      "Y si la respuesta honesta es el monolito con una cola, entonces es el monolito con una cola.",
  },
];

/**
 * La escalera de acoplamiento. El orden importa: cada escalón compra
 * durabilidad y cobra operación, y la frontera entre el 03 y el 04 es la
 * única que cambia de naturaleza — abajo el trabajo vive en memoria.
 */
const escalones: ReadonlyArray<Escalon> = [
  {
    nivel: "01",
    nombre: "Llamada síncrona directa",
    sobrevive: "Nada. Si el otro lado cae, caés con él.",
    cuesta: "Nada. Es lo más simple que existe.",
    cuando:
      "Lectura barata, el llamador necesita la respuesta ya, y perder la operación no duele.",
  },
  {
    nivel: "02",
    nombre: "+ timeout y reintento con jitter",
    sobrevive: "Un hipo de segundos del otro lado.",
    cuesta: "Latencia p95 y carga extra. Sin jitter, creás una estampida.",
    cuando:
      "Dependencia normalmente sana con fallas transitorias. Exige idempotencia del otro lado.",
  },
  {
    nivel: "03",
    nombre: "+ circuit breaker",
    sobrevive: "Una caída larga del otro lado sin que te arrastre.",
    cuesta: "Un estado más que tunear, observar y explicar.",
    cuando:
      "Llamás a un tercero que puede degradarse: un proveedor de búsqueda, de pagos, de envíos.",
  },
  {
    nivel: "04",
    nombre: "Cola de trabajo durable",
    sobrevive: "El reinicio del proceso y el pico de tráfico.",
    cuesta:
      "Un broker que operar, una DLQ que vigilar, y el orden deja de estar garantizado.",
    cuando:
      "El trabajo no puede perderse y el llamador no necesita el resultado. El caso típico de una ingesta de webhooks.",
  },
  {
    nivel: "05",
    nombre: "Evento publicado (pub / sub)",
    sobrevive:
      "Además: el emisor deja de saber quién escucha, así que sumar consumidores no lo toca.",
    cuesta: "Consistencia eventual y contratos versionados en serio.",
    cuando:
      "Varios interesados en el mismo hecho, y ninguno debe frenar al productor.",
  },
  {
    nivel: "06",
    nombre: "Workflow durable",
    sobrevive:
      "El proceso entero con su estado, por horas o días, cruzando reinicios.",
    cuesta:
      "Un cluster, workers dedicados, versionado de workflows, una curva de aprendizaje.",
    cuando:
      "Procesos largos, con pasos compensables y reintentos por paso. Donde viven las orquestaciones de agentes.",
  },
];

/**
 * Las seis estaciones que recorre cualquier evento externo. Es el índice
 * espacial del atlas: si sabés en qué estación duele, sabés en qué familia
 * buscar.
 */
const estaciones: ReadonlyArray<Estacion> = [
  {
    numero: "01",
    nombre: "Origen",
    patrones: [
      "webhook (empuje)",
      "polling / long polling",
      "CDC de la base",
      "carga por lote",
    ],
  },
  {
    numero: "02",
    nombre: "Borde",
    patrones: [
      "API gateway",
      "rate limiting",
      "autenticación / firma",
      "validación de esquema",
      "dedupe por id de evento",
      "load shedding",
    ],
  },
  {
    numero: "03",
    nombre: "Amortiguador",
    patrones: [
      "cola durable",
      "outbox transaccional",
      "cola de mensajes muertos",
      "backpressure",
      "claim check",
    ],
  },
  {
    numero: "04",
    nombre: "Trabajo",
    patrones: [
      "pool de workers",
      "reintento + jitter",
      "saga / compensación",
      "ejecución durable",
      "fan-out / fan-in",
      "reconciliación",
    ],
  },
  {
    numero: "05",
    nombre: "Estado",
    patrones: ["base por servicio", "CQRS / proyección", "cache-aside"],
  },
  {
    numero: "06",
    nombre: "Salida",
    patrones: ["timeout", "circuit breaker", "bulkhead", "rate limit de salida"],
  },
];

export const atlasEs: Atlas = {
  ui,
  familias,
  principios,
  trampas,
  preguntas,
  escalones,
  estaciones,
};
