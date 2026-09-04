/**
 * The atlas in English.
 *
 * This is the version the page is built with, so it ships inside the page
 * chunk. The Spanish twin in `es.ts` is loaded on demand and only by whoever
 * finds the easter egg.
 *
 * The order of the families is deliberate: it is the order the decisions get
 * made in when designing, from the most expensive to reverse to the most
 * operational.
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
  idioma: "en",
  insignia: "Working reference · English & Spanish",
  tituloPlano: "Software architecture",
  tituloAcento: "atlas",
  intro: {
    antes:
      "The map of decisions that get made before the first line of code: which patterns exist, where each one lives, what it costs and when ",
    enfasis: "not",
    despues:
      " to use it. It is not a list of things to add — it is the vocabulary for arguing about a design before implementing it.",
  },
  cifras: [
    "Patterns and principles",
    "Families",
    "Stations on the path",
    "Questions before you code",
  ],
  paraQue: [
    {
      titulo: "What it is",
      texto:
        "A catalogue of the patterns that exist, what each one solves, what it costs and when not to use it.",
    },
    {
      titulo: "What it is for",
      texto:
        "So that the design decision is explicit before the code, instead of being made by omission.",
    },
    {
      titulo: "How to read it",
      texto:
        "Find the station where it hurts, go into the family, read the card. Then answer the ten questions.",
    },
    {
      titulo: "What it is not",
      texto:
        "A list of things to add. Half the atlas exists to justify not using the other half.",
    },
  ],
  indice: {
    etiqueta: "Atlas sections",
    mapa: "Map",
    escalera: "Ladder",
    principios: "07 · Principles",
    trampas: "Traps",
    preguntas: "The 10 questions",
  },
  mapa: {
    etiqueta: "The map",
    titulo: "Where each pattern lives",
    bajada:
      "Almost everything that enters a system travels the same six stations. Every pattern belongs to one of them: if you know which station hurts, you know which family to look in.",
    pie: "The stations are not optional: an event crosses all of them, even the empty ones. An empty station is not a station that does not exist — it is a decision nobody made, and it only shows up under load.",
    svg: {
      alt: "The path of an external event through six stations: origin, edge, buffer and work in a row, and from work two branches, one toward state and one toward egress to third parties. Each station lists the patterns that live in it.",
      titulo: "The path of an external event",
      subtitulo: "from a third party’s webhook to the data already indexed",
      verbos: ["pushes", "accepts", "hands off", "writes", "calls out"],
      transversal1: "cut across all six: observability (trace, metric, log)",
      transversal2: "feature flags · idempotence · versioned contracts",
    },
  },
  escalera: {
    etiqueta: "The ladder",
    titulo: "Coupling: every rung buys durability and charges operations",
    bajada:
      "The “should we make it async?” argument is almost never binary. There are six rungs, and the design work is picking which one — not climbing to the top because it sounds modern.",
    pie: {
      antes: "The dotted line is the only boundary that really matters: ",
      enfasis: "to its left the work lives in one process’s memory",
      despues:
        " and disappears with a restart, an OOM or a redeploy. Climbing one rung too far costs real operations; staying below when the business cannot tolerate losing the event costs an incident.",
    },
    svg: {
      alt: "A six-rung ladder climbing from left to right: direct synchronous call, plus timeout and retry, plus circuit breaker, durable work queue, published event and durable workflow. A dotted vertical line between the third and fourth rungs marks the durability line: to its left the work dies with the process.",
      ejeY: "↑ what survives a crash",
      ejeX: "what it costs to operate →",
      frontera: "THE DURABILITY LINE",
      fronteraPie:
        "to the left, the work lives in memory and dies with the process",
    },
    tabla: ["Rung", "What survives", "What you pay", "When it is the right answer"],
  },
  familiaPrefijo: "Family",
  principios: {
    etiqueta: "Family 07",
    titulo: "Principles",
    complemento: "— what applies even when you choose no pattern at all",
    bajada:
      "Patterns get chosen; principles get respected. These are the ones that come up again and again in code review.",
  },
  trampas: {
    etiqueta: "Antipatterns",
    titulo: "Traps: patterns you choose without noticing",
    bajada:
      "An antipattern is almost never chosen on purpose. It shows up by omission, when nobody asked the question. These are the ones that cost the most.",
  },
  preguntas: {
    etiqueta: "The checklist",
    titulo: "The ten questions, before you open the editor",
    bajada:
      "Ten written answers, one or two lines each. If an answer is “I don’t know”, measuring it is the first thing to do.",
    cierre:
      "The goal is not ceremony. It is that the architecture conversation happens before the code and stays written down, so that six months from now someone can read why the system is the way it is.",
    remate:
      "None of these ten questions is expensive to answer. All of them are ruinously expensive to answer late.",
  },
  egg: {
    tecla: "s",
    invitacion: "to read this in Spanish",
    instruccion:
      "Read this atlas in Spanish: press the S key five times, or tap these five keys.",
    anuncio: "The atlas is now in English.",
  },
};

const familias: ReadonlyArray<Familia> = [
  {
    id: "forma",
    numero: "01",
    titulo: "Shape of the system",
    abrev: "Shape",
    pregunta: "where do I cut?",
    intro:
      "Decides what ships together and what ships apart. It is the most expensive decision in the atlas to reverse: cutting it wrong costs years, not sprints.",
    patrones: [
      {
        nombre: "Monolith",
        que: "Everything in one deployment. One transaction, one log, one deploy: the right answer until the domain or the team stops fitting in a single head.",
        trampa: "It gets abandoned too early, and almost always out of fashion.",
      },
      {
        nombre: "Modular monolith",
        que: "One deployment, but with hard internal boundaries between modules: nobody imports the neighbour’s insides.",
        trampa:
          "If the boundaries are not enforced by tooling, they dissolve within six months.",
      },
      {
        nombre: "Microservices",
        que: "One service per business capability, with its own database and its own deployment cycle.",
        trampa:
          "It pays for the network, for distributed observability and for eventual consistency. Without teams to operate them, it is cost with no benefit.",
      },
      {
        nombre: "Bounded context (DDD)",
        que: "The edge of the model is the edge of the service: an “order” in sales and an “order” in logistics are two different things, and that is fine.",
      },
      {
        nombre: "Ports and adapters",
        que: "The domain defines the interfaces; infrastructure implements them. Swapping Postgres for something else never touches the logic.",
        trampa: "On a small CRUD it adds three layers for nothing.",
      },
      {
        nombre: "Clean / Onion",
        que: "Dependencies always point inward. The core does not know a framework exists.",
      },
      {
        nombre: "Layers (n-tier)",
        que: "Presentation, application, data. Simple, and everybody already knows it.",
        trampa:
          "A single business change touches all three layers: cohesion ends up spread thin.",
      },
      {
        nombre: "Vertical slice",
        que: "Organise by whole use case instead of by technical layer. A feature lives in one folder.",
      },
      {
        nombre: "Microkernel / plugin",
        que: "A minimal core plus loadable extensions. It earns its keep when the variability is per client or per channel.",
      },
      {
        nombre: "Pipes and filters",
        que: "Chained stages that transform a stream, each one ignorant of the rest. A transcoding or indexing pipeline is exactly this.",
      },
      {
        nombre: "Serverless / FaaS",
        que: "The unit of deployment is the function, and it scales to zero.",
        trampa:
          "Cold starts, time limits and a bill that surprises you under sustained traffic.",
      },
      {
        nombre: "Cell-based architecture",
        que: "Complete copies of the stack per group of customers. The blast radius of a failure is the cell, not the whole system.",
        trampa:
          "The most expensive item on the list: every cell is its own infrastructure, deployment and monitoring.",
      },
      {
        nombre: "Micro-frontends",
        que: "The front end split by domain, each part with its own team and its own deploy.",
        trampa:
          "It duplicates the bundle and breaks visual consistency unless there is a design system.",
      },
      {
        nombre: "SOA with a bus",
        que: "Large services talking through a central bus that also transforms and routes.",
        trampa:
          "The bus becomes the new monolith, and that is where all the logic nobody wanted to place ends up living.",
      },
      {
        nombre: "Space-based",
        que: "A replicated shared-memory grid, with no database on the critical path. For extreme, predictable peaks.",
      },
    ],
  },
  {
    id: "hablan",
    numero: "02",
    titulo: "How they talk to each other",
    abrev: "Conversation",
    pregunta: "who waits for whom?",
    intro:
      "Once the system is cut, every conversation needs a shape. Almost every distributed incident is born here: somebody was waiting for an answer that never came.",
    patrones: [
      {
        nombre: "Request / response",
        que: "REST or gRPC: the caller blocks until the answer arrives. Easy to reason about and easy to debug.",
        trampa:
          "Chaining six synchronous hops multiplies the odds of failure — it does not average them.",
      },
      {
        nombre: "Work queue",
        que: "Point to point: a producer drops the task, one consumer out of a pool picks it up. It absorbs peaks by design.",
      },
      {
        nombre: "Publish / subscribe",
        que: "The emitter announces a fact and does not know who is listening. Adding consumers never touches the producer.",
        trampa: "Nobody knows who depends on what until you break the contract.",
      },
      {
        nombre: "Event log",
        que: "The event persists and can be re-read: new consumers can start from the beginning, and a slow one does not block the rest.",
      },
      {
        nombre: "Orchestration",
        que: "One component dictates the order of the steps. Easy to see, easy to audit, easy to fix.",
        trampa: "The orchestrator accumulates everybody else’s business logic.",
      },
      {
        nombre: "Choreography",
        que: "Every service reacts to events, with no central brain. Maximum decoupling.",
        trampa:
          "Nobody can draw the whole flow, and debugging turns into archaeology.",
      },
      {
        nombre: "Saga",
        que: "A long business transaction split into local steps, each one with its own compensation to undo it.",
        trampa:
          "Compensating is not rolling back: the world already saw the intermediate state.",
      },
      {
        nombre: "API gateway",
        que: "A single front door holding auth, rate limiting, routing and edge observability.",
      },
      {
        nombre: "Backend for frontend",
        que: "One backend per client type, assembling exactly the response that screen needs.",
      },
      {
        nombre: "Sidecar",
        que: "A companion process that supplies cross-cutting capabilities (TLS, metrics, proxying) without touching the service’s code.",
      },
      {
        nombre: "Ambassador",
        que: "The sidecar that speaks outward on your behalf: it concentrates the retries, timeouts and breakers of outbound calls.",
      },
      {
        nombre: "Service mesh",
        que: "Sidecars plus a control plane: mTLS, traffic policy and retries declared outside the code.",
        trampa:
          "A whole piece of infrastructure. You do not adopt it for three services.",
      },
      {
        nombre: "Anti-corruption layer",
        que: "A translator at the edge that converts the foreign model into yours, so the vendor’s or the ERP’s vocabulary never leaks into the domain.",
      },
      {
        nombre: "Strangler fig",
        que: "The new thing eats routes off the old one behind the same edge, until the old one has no traffic left and gets switched off.",
      },
      {
        nombre: "Webhooks",
        que: "The third party pushes the fact to you the moment it happens. Cheap and real time.",
        trampa:
          "You do not control the rate. With no limit and no dedupe, the third party decides your capacity.",
      },
      {
        nombre: "Change data capture",
        que: "Changes from the database log get published as events, without touching the code that writes.",
        trampa: "It couples consumers to the physical schema of the table.",
      },
      {
        nombre: "Claim check",
        que: "A reference travels in the message, not the heavy payload: the content stays in a store and the consumer fetches it if it needs it.",
      },
      {
        nombre: "Contract testing",
        que: "The contract between two services is verified in CI instead of being trusted. It breaks the PR, not production.",
      },
      {
        nombre: "Gateway aggregation",
        que: "The edge joins several internal calls into one response, so the client does not make six round trips.",
      },
      {
        nombre: "Polling and long polling",
        que: "When there is no webhook: you set the pace, and that alone is free flow control.",
        trampa:
          "Latency against cost, and you have to keep a cursor that never gets lost.",
      },
    ],
  },
  {
    id: "datos",
    numero: "03",
    titulo: "Data",
    abrev: "Data",
    pregunta: "who owns it, and what may be lost?",
    intro:
      "This is where you decide which truth is single and which truth is allowed to lag. Most of the strange production bugs are an implicit answer to this question.",
    patrones: [
      {
        nombre: "Database per service",
        que: "A single service writes a table; everyone else asks over an API. The schema stops being a public contract.",
      },
      {
        nombre: "Shared database",
        que: "Several services reading and writing the same schema. Blazing fast today.",
        trampa:
          "Any migration becomes a coordinated deployment of everybody. It is the distributed monolith through the back door.",
      },
      {
        nombre: "CQRS",
        que: "The model you write with and the model you read with are different, and they evolve separately.",
      },
      {
        nombre: "Event sourcing",
        que: "State is not stored: it is derived from the sequence of facts. The complete, auditable history comes free.",
        trampa:
          "Versioning old events is forever. You do not adopt it “just in case”.",
      },
      {
        nombre: "Materialised view",
        que: "A precomputed, denormalised read that answers the expensive query cheaply.",
        trampa:
          "Every view needs a written answer to “who rebuilds it, and when?”.",
      },
      {
        nombre: "Cache-aside",
        que: "I read the cache; if it is not there I go to the source and fill it. The default caching pattern.",
        trampa: "Invalidation is the problem, not the filling.",
      },
      {
        nombre: "Write-through / write-behind",
        que: "The write goes through the cache: synchronous (consistent and slow) or deferred (fast and at risk of loss).",
      },
      {
        nombre: "Sharding",
        que: "Split by key — customer, region — so that no single instance carries everything.",
        trampa:
          "Choosing the key badly is paid for with a data migration, not with a refactor.",
      },
      {
        nombre: "Read replicas",
        que: "Scale reads by separating them from writes.",
        trampa:
          "Replication lag means a user does not see what they have just saved.",
      },
      {
        nombre: "Polyglot persistence",
        que: "Each kind of data in the engine that suits it: relational for transactions, document for flexible, index for search.",
        trampa:
          "Every extra engine is one more backup, one more monitor and one more expertise.",
      },
      {
        nombre: "Transactional outbox",
        que: "The event is written in the same transaction as the state, and a relay publishes it afterwards. It solves “I saved it but never told anyone”.",
      },
      {
        nombre: "Idempotent consumer",
        que: "The receiver keeps a record of the ids it already processed, so receiving the same message twice does nothing the second time.",
      },
      {
        nombre: "Idempotency key",
        que: "The caller names the operation, so retrying it is safe. Without this, rung 02 of the ladder duplicates charges.",
      },
      {
        nombre: "Optimistic locking (etag / version)",
        que: "I write saying which version I read; if it changed, I am rejected. Two concurrent edits stop overwriting each other in silence.",
      },
      {
        nombre: "Distributed lock",
        que: "One process at a time over a resource.",
        trampa:
          "It needs a TTL and an owner: a lock with no expiry is an outage waiting for its turn.",
      },
      {
        nombre: "Snapshot",
        que: "A periodic cut of the state, so you do not re-read ten years of events on every start.",
      },
      {
        nombre: "Two-phase commit",
        que: "An atomic transaction across two systems.",
        trampa:
          "Almost always the wrong answer between services: it blocks, it does not scale and it fails ugly. The alternative is a saga.",
      },
      {
        nombre: "Eventual consistency",
        que: "The data converges; it does not match instantly. It is the right answer every time the business tolerates it — and it tolerates it more often than we think.",
      },
      {
        nombre: "Append-only and audit",
        que: "Nothing gets overwritten: things get appended. Investigating an incident stops depending on somebody having logged the right thing.",
      },
      {
        nombre: "Separate analytical plane",
        que: "Reports are not computed over the operational database. A heavy query stops being able to take the product down.",
      },
    ],
  },
  {
    id: "resiliencia",
    numero: "04",
    titulo: "Resilience and flow control",
    abrev: "Resilience",
    pregunta: "what happens when 100× shows up?",
    intro:
      "All of these patterns answer the same question from different angles: what do I do with the work I cannot take right now? There are four honest answers — queue it, reject it, degrade it, or fall over. Not deciding is choosing the fourth.",
    patrones: [
      {
        nombre: "Timeout",
        que: "Nothing waits forever. It is the cheapest pattern in the atlas and the one most often missing.",
        trampa:
          "The client’s timeout has to be shorter than its caller’s, or the whole chain hangs anyway.",
      },
      {
        nombre: "Retry with backoff and jitter",
        que: "Wait longer each time, with random noise, so that nobody comes back all at once.",
        trampa:
          "Without jitter a thousand clients retry in the same millisecond and you rebuild the outage yourself.",
      },
      {
        nombre: "Retry budget",
        que: "A global ceiling: if more than N % of the traffic is retries, they get cut off. It stops the resilience layer from being the attack.",
      },
      {
        nombre: "Circuit breaker",
        que: "After N failures it opens the circuit and fails fast without touching the network; later it lets one probe through to see whether the other side is back.",
      },
      {
        nombre: "Bulkhead",
        que: "Watertight compartments: pools, queues or pods separated by kind of work, so a noisy neighbour cannot sink the ship.",
      },
      {
        nombre: "Rate limiting",
        que: "How much I let in per unit of time. Token bucket tolerates bursts, leaky bucket smooths, sliding window is the fairest and the most expensive.",
      },
      {
        nombre: "Per-tenant quota",
        que: "The limit applies per customer, not globally. A single one stops being able to eat everybody’s capacity.",
        trampa:
          "A global limit protects the service and does not protect the customers from each other.",
      },
      {
        nombre: "Load shedding",
        que: "When I cannot keep up, I throw the least valuable work overboard on purpose and protect the critical path. Rejecting fast is better service than accepting and dying.",
      },
      {
        nombre: "Backpressure",
        que: "Telling whoever is pushing to ease off, instead of accepting and piling up in memory until the OOM.",
      },
      {
        nombre: "Queue-based load levelling",
        que: "The queue absorbs the peak and the consumer works at a steady pace. It turns a capacity problem into a latency one.",
      },
      {
        nombre: "Dead letter queue",
        que: "Whatever failed N times leaves the line: it is neither lost nor blocking the rest, and it stays visible enough to fix.",
      },
      {
        nombre: "Deduplication",
        que: "The same fact twice does not count twice. Without this, any retry from the provider multiplies your work.",
      },
      {
        nombre: "Request coalescing",
        que: "A thousand identical requests arriving together are resolved with a single call to the origin. It kills the cold-cache stampede.",
      },
      {
        nombre: "Graceful degradation",
        que: "Answering something useful when the ideal is not available: the stale cached value, the unsorted list, the generic response.",
      },
      {
        nombre: "Fail closed / fail open",
        que: "When the check cannot run: do I let it through or block it? Both are valid; what is unacceptable is for it to be an accident.",
        trampa:
          "A credential block that fails open is not blocking anything at all.",
      },
      {
        nombre: "Health checks",
        que: "Liveness says whether to restart me; readiness whether I can take traffic. Confusing the two causes cascading restarts.",
      },
      {
        nombre: "Graceful shutdown",
        que: "Stop accepting, finish what is in flight, close. Without this, every deploy loses the work in progress.",
      },
      {
        nombre: "Failover",
        que: "A replica ready to take over. It is worth exactly as much as the last drill that was actually run.",
      },
      {
        nombre: "Chaos engineering",
        que: "Breaking it on purpose during office hours, so as not to discover it on a Sunday.",
      },
    ],
  },
  {
    id: "tiempo",
    numero: "05",
    titulo: "Work over time",
    abrev: "Time",
    pregunta: "who does it, and what if it dies halfway?",
    intro:
      "Everything that is not resolved inside the request lives here. One question orders the whole family: if the process restarts right now, does anybody find out, and does anybody finish it?",
    patrones: [
      {
        nombre: "Consumer pool",
        que: "Several workers compete for the same queue; scaling is adding workers. The workhorse of asynchronous processing.",
      },
      {
        nombre: "Durable execution",
        que: "The workflow’s state is persisted step by step: it survives a worker restart and carries on where it was, with per-activity retries. Temporal is the well-known implementation.",
      },
      {
        nombre: "In-memory background work",
        que: "Fire the task inside the same web process and answer 200. It looks like a queue and it is not.",
        trampa:
          "It dies with the pod, it has no retry and no visibility. It is the origin of most silent losses of work.",
      },
      {
        nombre: "Scheduler / agent / supervisor",
        que: "Somebody watches whatever was left half done and requeues or compensates it. The safety net under everything else.",
      },
      {
        nombre: "Fan-out / fan-in",
        que: "Split one job into N parallel ones and wait for them all to come back. Careful with multiplying the load on whoever is downstream.",
      },
      {
        nombre: "Reconciliation loop",
        que: "Periodically compare the desired state against the real one and correct the difference. It is the only thing that saves you when every event was lost.",
      },
      {
        nombre: "Per-entity debounce",
        que: "Twenty changes to the same product in a minute collapse into a single reindex.",
        trampa:
          "Measure it before dismissing it: it is common for most reindexes to change nothing, and that is pure work to throw away.",
      },
      {
        nombre: "Batch and micro-batch",
        que: "Group N operations into one call. It improves throughput enormously and makes individual latency worse.",
      },
      {
        nombre: "Priority queue",
        que: "The urgent thing does not wait behind last night’s bulk load.",
        trampa:
          "Without a service floor, low priority never gets processed at all.",
      },
      {
        nombre: "Leader election",
        que: "A single owner among several replicas for the tasks that cannot be duplicated.",
      },
      {
        nombre: "Idempotent cron",
        que: "A scheduled job that can run twice without harm. Because sooner or later it will run twice.",
      },
      {
        nombre: "Cursor with checkpoint",
        que: "Save how far I got, so I can resume without re-reading everything or skipping anything.",
      },
      {
        nombre: "Time windows",
        que: "Aggregate events by fixed or sliding window. The basis of any metric over a continuous stream.",
      },
      {
        nombre: "Compensating sweep",
        que: "A job that looks for whatever was left inconsistent and fixes it. Less elegant than a perfect design and far cheaper.",
      },
    ],
  },
  {
    id: "entrega",
    numero: "06",
    titulo: "Delivery and operations",
    abrev: "Delivery",
    pregunta: "how do I turn it on, turn it off and find out?",
    intro:
      "A pattern you cannot switch off without deploying, or observe without SSH-ing in, is not finished. This family is the non-negotiable half of any design.",
    patrones: [
      {
        nombre: "Deploy ≠ release",
        que: "The code arrives switched off and gets turned on separately. It separates technical risk from product risk.",
      },
      {
        nombre: "Feature flags",
        que: "Typed, declared flags: release and experiment with an expiry date, killswitch and operational permanent.",
      },
      {
        nombre: "Killswitch",
        que: "Turn the feature off in seconds without deploying. The first thing anyone looks for in an incident and the last thing anyone implements.",
      },
      {
        nombre: "Canary",
        que: "Send 1 % of the traffic to the new version and watch the metrics before going any further.",
      },
      {
        nombre: "Blue-green",
        que: "Two complete environments and one traffic switch. Going back is instant.",
      },
      {
        nombre: "Rolling update",
        que: "Replace pods a few at a time. It demands that two versions coexist speaking the same contract.",
      },
      {
        nombre: "Shadow traffic",
        que: "Copy real traffic to the new version without using its answer. You test under real load without putting anyone at risk.",
      },
      {
        nombre: "Expand / contract",
        que: "A schema migration in three steps: add the new, write to both, retire the old. Never a destructive change in a single deploy.",
      },
      {
        nombre: "Dual write and backfill",
        que: "Write to both sides while an idempotent, resumable job fills in the history.",
      },
      {
        nombre: "Contract versioning",
        que: "Add optional fields, never change the meaning of an existing one. Old consumers stay alive.",
        trampa:
          "A literal in a payload may be acting as protocol for somebody else.",
      },
      {
        nombre: "Observability: all three",
        que: "Traces (where), metrics (how much), logs (what it said). Two of the three is not enough.",
        trampa: "A silent rejection shows up on no dashboard.",
      },
      {
        nombre: "SLO and error budget",
        que: "An agreed number for how much is allowed to fail. It turns “it feels slow” into a decision with a threshold.",
      },
      {
        nombre: "Symptom-based alerting",
        que: "Alert on what the user suffers, not on CPU. A new metric with no alert is a dashboard nobody looks at.",
      },
      {
        nombre: "Infrastructure as code",
        que: "The environment is rebuilt from the repo. If an infrastructure change is not in a diff, it does not exist.",
      },
      {
        nombre: "Runbook",
        que: "What to look at and what to do, written before the incident. During the incident nobody designs anything.",
      },
    ],
  },
];

/**
 * The seventh family has a different shape: it is not chosen, it is respected.
 * That is why it lives in its own list and gets painted more compactly.
 */
const principios: ReadonlyArray<Principio> = [
  {
    nombre: "SRP",
    que: "One class, one reason to change. If two business areas touch it, it is two classes.",
  },
  {
    nombre: "OCP",
    que: "Open to extension, closed to modification. Adding a case should not require editing everybody’s match statement.",
  },
  {
    nombre: "LSP",
    que: "An implementation must be able to replace its interface with no surprises for whoever uses it.",
  },
  {
    nombre: "ISP",
    que: "Several small interfaces beat one fat one that forces you to implement what you do not use.",
  },
  {
    nombre: "DIP",
    que: "Depend on abstractions, not on the concrete implementation. It is the engine behind ports and adapters.",
  },
  {
    nombre: "Cohesion and coupling",
    que: "What changes together lives together; what does not, gets separated. It summarises half the list above.",
  },
  {
    nombre: "Separation of concerns",
    que: "Business, transport and persistence do not share a function.",
  },
  {
    nombre: "KISS",
    que: "The simplest solution that solves today’s real problem.",
  },
  {
    nombre: "YAGNI",
    que: "Do not build it until it is needed. Almost all the flexibility anyone anticipates never gets used.",
  },
  {
    nombre: "DRY, carefully",
    que: "Do not repeat knowledge. Two similar pieces of code that change for different reasons are not duplication.",
  },
  {
    nombre: "Composition over inheritance",
    que: "Assembling behaviour out of pieces ages better than inheriting it.",
  },
  {
    nombre: "Dependency injection",
    que: "Receive what you need instead of constructing it. It is what makes the domain testable.",
  },
  {
    nombre: "Fail fast",
    que: "Validate at the edge and blow up early, with a message that says what was missing.",
  },
  {
    nombre: "Least surprise",
    que: "It should behave the way the name promises. True for functions and for endpoints alike.",
  },
  {
    nombre: "Immutability",
    que: "What does not change cannot produce a race condition.",
  },
  {
    nombre: "Idempotence",
    que: "Doing it twice gives the same result as doing it once. It is the prerequisite of almost everything distributed.",
  },
  {
    nombre: "ACID",
    que: "Atomic, consistent, isolated, durable. What a transaction gives you inside one database.",
  },
  {
    nombre: "BASE",
    que: "Basically available, soft state, eventually consistent. What you are left with once you cross services.",
  },
  {
    nombre: "CAP",
    que: "With the network partitioned you pick consistency or availability. Choosing is not optional.",
  },
  {
    nombre: "PACELC",
    que: "And with no partition you are still choosing: latency or consistency. The honest version of CAP.",
  },
  {
    nombre: "12-factor",
    que: "Config per environment, stateless processes, logs to stdout, dev/prod parity.",
  },
  {
    nombre: "Conway’s law",
    que: "The system ends up shaped like the org chart. If you do not like the cut, look at the teams.",
  },
  {
    nombre: "The 8 fallacies",
    que: "The network is not reliable, nor zero-latency, nor infinite in bandwidth, nor secure, and the topology is not fixed.",
  },
  {
    nombre: "Law of Demeter",
    que: "Talk to your neighbours, not to your neighbours’ friends.",
  },
  {
    nombre: "The limit principle",
    que: "Every shared resource — memory, connections, a queue — needs an explicit ceiling. Whatever is unbounded runs out.",
  },
  {
    nombre: "Least operational astonishment",
    que: "If understanding what happened requires reading the code, a log or a metric is missing.",
  },
];

const trampas: ReadonlyArray<Trampa> = [
  {
    nombre: "Distributed monolith",
    que: "Separate services that still have to be deployed together, because they share a schema or a contract. You pay the price of microservices with none of the benefits.",
  },
  {
    nombre: "Integration through the database",
    que: "One service reads another one’s table “because it is faster”. It turns every migration into a negotiation between teams.",
  },
  {
    nombre: "Background work without durability",
    que: "Answer 200 and process in memory. One redeploy, one OOM or one restart and the work evaporated without anyone finding out.",
  },
  {
    nombre: "Long synchronous chain",
    que: "Six hops where each one waits for the next. Availabilities multiply: six services at 99.9 % give you 99.4 %.",
  },
  {
    nombre: "Retry with no ceiling and no jitter",
    que: "The stampede you build yourself. A service that was recovering falls over again with the first wave of retries.",
  },
  {
    nombre: "Queue with no dead letter queue",
    que: "A poison message retries forever and blocks everything behind it. A healthy queue dies because of a single one.",
  },
  {
    nombre: "Webhook without deduplication",
    que: "Every provider resends when in doubt. Without dedupe, their retry policy becomes your compute bill.",
  },
  {
    nombre: "Limit with no dashboard and no alert",
    que: "A rate limit that rejects in silence protects the service and hides from the team that somebody was left outside. The invisible 429 is a failure that does not exist until a customer calls.",
  },
  {
    nombre: "Resource with no ceiling",
    que: "An in-memory queue, a connection pool or a list that grows without limit. It always ends up in the same place.",
  },
  {
    nombre: "Cache with no invalidation plan",
    que: "It gets added to fix latency and turns into a parallel source of truth that nobody knows when to expire.",
  },
  {
    nombre: "God service",
    que: "The one that has to be touched on every feature. It is a monolith with network latency.",
  },
  {
    nombre: "Pattern chosen for the résumé",
    que: "Kafka because it is Kafka, microservices because they are microservices. The question that undoes it is always the same: which measured problem does it solve?",
  },
];

const preguntas: ReadonlyArray<Pregunta> = [
  {
    pregunta: "How much comes in, at the peak?",
    porQue:
      "Events per second in the worst minute, not the monthly average. Without measured volume, everything else is opinion.",
  },
  {
    pregunta: "What happens if the one next door does not answer?",
    porQue:
      "Timeout, retry with jitter, breaker or degradation. Picking one is mandatory; “nothing happens” is not an answer.",
  },
  {
    pregunta: "What happens if the same message arrives twice?",
    porQue:
      "If the answer is not “nothing”, idempotence is missing. And it will arrive twice.",
  },
  {
    pregunta: "Where does the work live if the process dies halfway?",
    porQue:
      "If it lives in RAM, it is lost. Look at the ladder and decide which rung you are standing on.",
  },
  {
    pregunta: "Does this have to be synchronous?",
    porQue:
      "Who is waiting for the answer, and what do they do with it? If nobody looks at it, the caller should not be waiting.",
  },
  {
    pregunta: "Who owns this piece of data?",
    porQue:
      "A single service writes; the rest ask. If two write, there is a conflict waiting for its turn.",
  },
  {
    pregunta: "How do I find out that it broke?",
    porQue:
      "Trace, metric, alert — and a dashboard where what gets rejected is visible, not only what gets processed.",
  },
  {
    pregunta: "How do I switch it off without deploying?",
    porQue:
      "A declared feature flag or killswitch. A user-visible change with no flag does not ship.",
  },
  {
    pregunta: "How do I roll it back?",
    porQue:
      "An expand-contract migration, a backward-compatible contract, a previous version that still understands the new data.",
  },
  {
    pregunta: "What is the simplest thing that works?",
    porQue:
      "And if the honest answer is the monolith with a queue, then it is the monolith with a queue.",
  },
];

/**
 * The coupling ladder. The order matters: every rung buys durability and
 * charges operations, and the boundary between 03 and 04 is the only one that
 * changes in nature — below it the work lives in memory.
 */
const escalones: ReadonlyArray<Escalon> = [
  {
    nivel: "01",
    nombre: "Direct synchronous call",
    sobrevive: "Nothing. If the other side goes down, you go down with it.",
    cuesta: "Nothing. It is the simplest thing there is.",
    cuando:
      "A cheap read, the caller needs the answer now, and losing the operation does not hurt.",
  },
  {
    nivel: "02",
    nombre: "+ timeout and retry with jitter",
    sobrevive: "A hiccup of a few seconds on the other side.",
    cuesta: "p95 latency and extra load. Without jitter, you create a stampede.",
    cuando:
      "A normally healthy dependency with transient failures. It demands idempotence on the other side.",
  },
  {
    nivel: "03",
    nombre: "+ circuit breaker",
    sobrevive: "A long outage on the other side without it dragging you down.",
    cuesta: "One more state to tune, to observe and to explain.",
    cuando:
      "You call a third party that can degrade: a search, payments or shipping provider.",
  },
  {
    nivel: "04",
    nombre: "Durable work queue",
    sobrevive: "A process restart and the traffic peak.",
    cuesta:
      "A broker to operate, a DLQ to watch, and ordering stops being guaranteed.",
    cuando:
      "The work cannot be lost and the caller does not need the result. The typical case of a webhook intake.",
  },
  {
    nivel: "05",
    nombre: "Published event (pub / sub)",
    sobrevive:
      "On top of that: the emitter stops knowing who listens, so adding consumers never touches it.",
    cuesta: "Eventual consistency and versioned contracts, taken seriously.",
    cuando:
      "Several parties interested in the same fact, and none of them should hold up the producer.",
  },
  {
    nivel: "06",
    nombre: "Durable workflow",
    sobrevive:
      "The whole process with its state, for hours or days, across restarts.",
    cuesta:
      "A cluster, dedicated workers, workflow versioning, a learning curve.",
    cuando:
      "Long processes, with compensable steps and per-step retries. Where agent orchestration lives.",
  },
];

/**
 * The six stations any external event travels through. It is the atlas’s
 * spatial index: if you know which station hurts, you know which family to
 * look in.
 */
const estaciones: ReadonlyArray<Estacion> = [
  {
    numero: "01",
    nombre: "Origin",
    patrones: [
      "webhook (push)",
      "polling / long polling",
      "CDC from the database",
      "batch load",
    ],
  },
  {
    numero: "02",
    nombre: "Edge",
    patrones: [
      "API gateway",
      "rate limiting",
      "authentication / signature",
      "schema validation",
      "dedupe by event id",
      "load shedding",
    ],
  },
  {
    numero: "03",
    nombre: "Buffer",
    patrones: [
      "durable queue",
      "transactional outbox",
      "dead letter queue",
      "backpressure",
      "claim check",
    ],
  },
  {
    numero: "04",
    nombre: "Work",
    patrones: [
      "worker pool",
      "retry + jitter",
      "saga / compensation",
      "durable execution",
      "fan-out / fan-in",
      "reconciliation",
    ],
  },
  {
    numero: "05",
    nombre: "State",
    patrones: ["database per service", "CQRS / projection", "cache-aside"],
  },
  {
    numero: "06",
    nombre: "Egress",
    patrones: ["timeout", "circuit breaker", "bulkhead", "outbound rate limit"],
  },
];

export const atlasEn: Atlas = {
  ui,
  familias,
  principios,
  trampas,
  preguntas,
  escalones,
  estaciones,
};
